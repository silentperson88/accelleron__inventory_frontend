import React, { useEffect, useState } from "react";

// Material Common Components
import ConfirmationModal from "examples/modal/Confirmation/Confirmation";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import CustomButton from "examples/NewDesign/CustomButton";
import pxToRem from "assets/theme/functions/pxToRem";
import PageTitle from "examples/NewDesign/PageTitle";
import FTextField from "components/Form/FTextField";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Material Components
import { Divider, FormControlLabel, Radio, RadioGroup } from "@mui/material";

// Table
import CodeData from "layouts/leadUtils/codes/data/CodeData";
import DataTable from "examples/Tables/DataTable";

// Redux
import { getAllCodes, registerCodes, updateCodes, deleteCodes } from "redux/Thunks/leadUtilsThunks";
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch } from "react-redux";

// Utils
import Constants, {
  PageTitles,
  ButtonTitles,
  Colors,
  Icons,
  defaultData,
  ModalContent,
} from "utils/Constants";
import { paramCreater } from "utils/methods/methods";
import Validations from "utils/Validations/index";
import ResetFilterButton from "components/Buttons/ResetButton";

function LeadUtilsCodes() {
  const [filters, setFilters] = useState([
    {
      inputLabel: "Status",
      list: [
        { [Constants.MONGOOSE_ID]: "All", title: "All" },
        { [Constants.MONGOOSE_ID]: "true", title: "Active" },
        { [Constants.MONGOOSE_ID]: "false", title: "In Active" },
      ],
      selectedValue: "All",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [codeBody, setCodeBody] = useState({
    type: "new",
    openModal: false,
    body: {
      code: "",
      status: true,
    },
    errors: {},
    openDeleteModal: false,
    openConfirmationModal: false,
    editDeleteId: "",
  });
  const dispatch = useDispatch();
  const [next, setNext] = useState(0);
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState({});
  const [codeList, setCodeList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(Constants.PENDING);

  const handleFilter = async (tempFilters = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    const paramData = {
      page: defaultData.PAGE,
      perPage: tablePagination.perPage,
      ...(tempFilters[0].selectedValue !== "All" && { status: tempFilters[0].selectedValue }),
    };

    const res = await dispatch(getAllCodes(paramCreater(paramData)));
    setLoadingStatus(Constants.FULFILLED);
    setCodeList(res.payload.data.data);
  };

  const handleResetFilter = () => {
    setFilters((prev) => [{ ...prev[0], selectedValue: "All" }]);
    handleFilter([{ ...filters[0], selectedValue: "All" }, ...filters.slice(1)]);
  };

  const handleFilterChange = (e) => {
    const temp = [...filters];
    const { value } = e.target;
    const index = filters.findIndex((filter) => filter.inputLabel === e.target.name);
    temp[index].selectedValue = value;
    setFilters(temp);
    handleFilter(temp);
  };

  const handleTablePagination = async () => {
    const data = {
      page: next + 1,
      perPage: tablePagination.perPage,
    };
    const res = await dispatch(getAllCodes(paramCreater(data)));
    if (res.payload.status === 200) {
      setCodeList([...codeList, ...res.payload.data.data]);
      setNext(res.payload.data.data.length > 0 ? next + 1 : next);
    }
  };

  useEffect(() => {
    (async () => {
      handleFilter();
    })();
  }, []);

  const handleEdit = (data) => {
    setCodeBody((prevData) => ({
      ...prevData,
      type: "update",
      openModal: true,
      body: { ...data.body },
      editDeleteId: data.id,
    }));
  };

  const handleDelete = (id) => {
    setCodeBody((prev) => ({ ...prev, openDeleteModal: true, editDeleteId: id }));
  };
  const handleCloseProfileFunctions = () => {
    setCodeBody((prev) => ({
      ...prev,
      type: "new",
      openModal: false,
      body: {
        code: "",
        status: true,
      },
      errors: {},
    }));
    setCodeError({});
  };

  const handleCloseDeleteProfileFunctionModal = () =>
    setCodeBody((prev) => ({ ...prev, openDeleteModal: false }));

  const handleCloseConfirmationlModal = () =>
    setCodeBody((prev) => ({ ...prev, openConfirmationModal: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCodeBody((prev) => ({ ...prev, body: { ...prev.body, [name]: value } }));
  };

  const codesValidation = () => {
    const { body } = codeBody;
    const errors = {};
    const questionError = Validations.validate("basic", body.code);
    if (questionError !== "") {
      errors.name = questionError;
    }
    setCodeError(errors);
    return Object.values(errors).filter((val) => val !== "").length === 0;
  };

  const handleRegisterCodes = async () => {
    if (codesValidation()) {
      setLoading(true);
      const { body } = codeBody;
      const res = await dispatch(registerCodes(body));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.LEAD_UTILS_CODES_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        handleCloseProfileFunctions();
      } else if (res.payload.status === 401) {
        const temp = { ...codeError };
        temp.code = res.payload.data.message;
        setCodeError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
      setLoading(false);
    }
  };

  const handleUpdateCodes = async () => {
    setLoading(true);
    if (codesValidation()) {
      const { body } = codeBody;
      const res = await dispatch(updateCodes(body));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.LEAD_UTILS_CODES_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        handleCloseProfileFunctions();
      } else if (res.payload.status === 401) {
        const temp = { ...codeError };
        temp.code = res.payload.data.message;
        setCodeError(temp);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    }
    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    const { body } = codeBody;
    const res = await dispatch(updateCodes(body));
    if (res.payload.status === 200) {
      handleFilter();
      dispatch(
        openSnackbar({
          message: Constants.LEAD_UTILS_CODES_UPDATE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      handleCloseConfirmationlModal();
    } else {
      dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleDeleteCodes = async () => {
    const { editDeleteId } = codeBody;
    const res = await dispatch(deleteCodes(editDeleteId));
    if (res.payload.status === 200) {
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.LEAD_UTILS_CODES_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      handleCloseDeleteProfileFunctionModal();
    } else {
      dispatch(
        openSnackbar({
          message: Constants.LEAD_UTILS_CODES_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleStatusChange = (event, data) => {
    setCodeBody((prev) => ({
      ...prev,
      openConfirmationModal: true,
      body: { ...data.body },
      editDeleteId: data?.id,
    }));
  };

  const handleReload = async () => {
    setLoadingStatus(Constants.PENDING);
    handleFilter();
  };
  const { columns, rows } = CodeData(codeList, handleEdit, handleDelete, handleStatusChange);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <PageTitle title={PageTitles.LEAD_UTILS_CODES} />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title={ButtonTitles.LEAD_UTILS_BANKS}
            icon="add_circle_outline"
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => setCodeBody((prev) => ({ ...prev, openModal: true }))}
          />
          <Divider
            orientation="vertical"
            sx={{
              backgroundColor: "var(--gray-300, #D0D5DD)",
              height: "auto",
              marginLeft: pxToRem(16),
              marginRight: 0,
            }}
          />
          <BasicButton
            icon={Icons.RELOAD}
            background={Colors.WHITE}
            border
            color={Colors.BLACK}
            action={handleReload}
          />
        </MDBox>
      </MDBox>
      <Divider sx={{ marginTop: 2 }} />
      <MDBox display="flex" alignItems="center">
        <MDBox
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="start"
          sx={{ flexDirection: "row", mr: 2 }}
        >
          {filters &&
            filters.map((val) => (
              <FilterDropdown
                key={val.inputLabel}
                label={val.inputLabel}
                name={val.inputLabel}
                defaultValue={val?.selectedValue}
                value={val?.selectedValue}
                handleChange={handleFilterChange}
                menu={val.list}
              />
            ))}

          <ResetFilterButton handleReset={handleResetFilter} />
        </MDBox>
      </MDBox>
      <MDBox mt={3} mb={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus}
          currentPage={tablePagination.page}
          handleTablePagination={handleTablePagination}
          handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
        />
      </MDBox>

      {/* Create and Update Profile Function modal */}
      <BasicModal
        open={codeBody.openModal}
        handleClose={handleCloseProfileFunctions}
        title={
          codeBody.type === "new" ? ModalContent.CREATE_CODE_TITLE : ModalContent.UPDATE_CODE_TITLE
        }
        actionButton={
          (codeBody.type === "new" && !loading && ButtonTitles.SUBMIT) ||
          (codeBody.type === "new" && loading && ButtonTitles.SUBMIT_LOADING) ||
          (codeBody.type === "update" && !loading && ButtonTitles.UPDATE) ||
          (codeBody.type === "update" && loading && ButtonTitles.UPDATE_LOADING)
        }
        handleAction={codeBody.type === "new" ? handleRegisterCodes : handleUpdateCodes}
      >
        <FTextField
          label="Code*"
          placeholder="Enter Code"
          id="code"
          name="code"
          type="text"
          error={Boolean(codeError?.code)}
          helperText={codeError?.code}
          value={codeBody?.body?.code}
          handleChange={handleChange}
          marginBottom={2}
        />
        {codeBody.type === "new" ? (
          <MDBox>
            <MDTypography
              variant="caption"
              mb={1}
              mt={2}
              sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
            >
              Status
            </MDTypography>
            <RadioGroup
              name="status"
              value={codeBody.body.status}
              onChange={handleChange}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel label="Yes" value="true" control={<Radio />} />
              <FormControlLabel
                sx={{ marginLeft: "8px" }}
                label="No"
                value="false"
                control={<Radio />}
              />
            </RadioGroup>
          </MDBox>
        ) : null}
      </BasicModal>

      {/* Delete Modal for Profile Function */}
      <DeleteModal
        open={codeBody.openDeleteModal}
        title={ModalContent.DELETE_CODE_TITLE}
        message={ModalContent.DELETE_CODE_MESSAGE}
        handleClose={handleCloseDeleteProfileFunctionModal}
        handleDelete={handleDeleteCodes}
      />

      {/* Confirmation Modal for Profile Function Status */}
      <ConfirmationModal
        open={codeBody.openConfirmationModal}
        title={ModalContent.CODE_STATUS_TITLE}
        message={
          codeBody.body.isActive
            ? ModalContent.CODE_ACTIVE_STATUS_MESSAGE
            : ModalContent.CODE_INACTIVE_STATUS_MESSAGE
        }
        handleClose={handleCloseConfirmationlModal}
        handleAction={handleUpdateStatus}
      />
    </DashboardLayout>
  );
}

export default LeadUtilsCodes;
