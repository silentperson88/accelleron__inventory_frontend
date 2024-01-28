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
import BankData from "layouts/leadUtils/bank/data/BankData";
import DataTable from "examples/Tables/DataTable";

// Redux
import getAllBanks, { registerBanks, updateBanks, deleteBanks } from "redux/Thunks/leadUtilsThunks";
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

function LeadUtilsBanks() {
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
  const [bankBody, setBankBody] = useState({
    type: "new",
    openModal: false,
    body: {
      bankName: "",
      bankStatus: true,
    },
    errors: {},
    openDeleteModal: false,
    openConfirmationModal: false,
    editDeleteId: "",
  });
  const dispatch = useDispatch();
  const [next, setNext] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bankError, setBankError] = useState({});
  const [bankList, setBankList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(Constants.PENDING);

  const handleFilter = async (tempFilters = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    const paramData = {
      page: defaultData.PAGE,
      perPage: tablePagination.perPage,
      ...(tempFilters[0].selectedValue !== "All" && { bankStatus: tempFilters[0].selectedValue }),
    };

    const res = await dispatch(getAllBanks(paramCreater(paramData)));
    setLoadingStatus(Constants.FULFILLED);
    setBankList(res.payload.data.data);
  };

  const handleResetFilter = () => {
    setFilters((prev) => [{ ...prev[0], selectedValue: "All" }, ...prev.slice(1)]);
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
    const res = await dispatch(getAllBanks(paramCreater(data)));
    if (res.payload.status === 200) {
      setBankList([...bankList, ...res.payload.data.data]);
      setNext(res.payload.data.data.length > 0 ? next + 1 : next);
    }
  };

  useEffect(() => {
    (async () => {
      handleFilter();
    })();
  }, []);

  const handleEdit = (data) => {
    setBankBody((prevData) => ({
      ...prevData,
      type: "update",
      openModal: true,
      body: { ...data.body },
      editDeleteId: data.id,
    }));
  };

  const handleDelete = (id) => {
    setBankBody((prev) => ({ ...prev, openDeleteModal: true, editDeleteId: id }));
  };
  const handleCloseProfileFunctions = () => {
    setBankBody((prev) => ({
      ...prev,
      type: "new",
      openModal: false,
      body: {
        name: "",
        isActive: true,
      },
      errors: {},
    }));
    setBankError({});
  };

  const handleCloseDeleteProfileFunctionModal = () =>
    setBankBody((prev) => ({ ...prev, openDeleteModal: false }));

  const handleCloseConfirmationlModal = () =>
    setBankBody((prev) => ({ ...prev, openConfirmationModal: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankBody((prev) => ({ ...prev, body: { ...prev.body, [name]: value } }));
  };

  const profileFunctionsValidation = () => {
    const { body } = bankBody;
    const errors = {};
    const questionError = Validations.validate("basic", body.bankName);
    if (questionError !== "") {
      errors.name = questionError;
    }
    setBankError(errors);
    return Object.values(errors).filter((val) => val !== "").length === 0;
  };

  const handleRegisterBanks = async () => {
    if (profileFunctionsValidation()) {
      setLoading(true);
      const { body } = bankBody;
      const res = await dispatch(registerBanks(body));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.LEAD_UTILS_BANKS_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        handleCloseProfileFunctions();
      } else if (res.payload.status === 401) {
        const temp = { ...bankError };
        temp.bankName = res.payload.data.message;
        setBankError(temp);
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

  const handleUpdateBanks = async () => {
    setLoading(true);
    if (profileFunctionsValidation()) {
      const { body } = bankBody;
      const res = await dispatch(updateBanks(body));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.LEAD_UTILS_BANKS_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        handleCloseProfileFunctions();
      } else if (res.payload.status === 401) {
        const temp = { ...bankError };
        temp.bankName = res.payload.data.message;
        setBankError(temp);
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
    const { body } = bankBody;
    const res = await dispatch(updateBanks(body));
    if (res.payload.status === 200) {
      handleFilter();
      dispatch(
        openSnackbar({
          message: Constants.LEAD_UTILS_BANKS_UPDATE_SUCCESS,
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

  const handleDeleteProfileFunction = async () => {
    const { editDeleteId } = bankBody;
    const res = await dispatch(deleteBanks(editDeleteId));
    if (res.payload.status === 200) {
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.LEAD_UTILS_BANKS_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      handleCloseDeleteProfileFunctionModal();
    } else {
      dispatch(
        openSnackbar({
          message: Constants.LEAD_UTILS_BANKS_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleStatusChange = (event, data) => {
    setBankBody((prev) => ({
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
  const { columns, rows } = BankData(bankList, handleEdit, handleDelete, handleStatusChange);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <PageTitle title={PageTitles.LEAD_UTILS_BANKS} />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title={ButtonTitles.LEAD_UTILS_BANKS}
            icon="add_circle_outline"
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => setBankBody((prev) => ({ ...prev, openModal: true }))}
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
        open={bankBody.openModal}
        handleClose={handleCloseProfileFunctions}
        title={
          bankBody.type === "new" ? ModalContent.CREATE_BANK_TITLE : ModalContent.UPDATE_BANK_TITLE
        }
        actionButton={
          (bankBody.type === "new" && !loading && ButtonTitles.SUBMIT) ||
          (bankBody.type === "new" && loading && ButtonTitles.SUBMIT_LOADING) ||
          (bankBody.type === "update" && !loading && ButtonTitles.UPDATE) ||
          (bankBody.type === "update" && loading && ButtonTitles.UPDATE_LOADING)
        }
        handleAction={bankBody.type === "new" ? handleRegisterBanks : handleUpdateBanks}
      >
        <FTextField
          label="Name*"
          placeholder="Name"
          id="bankName"
          name="bankName"
          type="text"
          error={Boolean(bankError?.bankName)}
          helperText={bankError?.bankName}
          value={bankBody?.body?.bankName}
          handleChange={handleChange}
          marginBottom={2}
        />
        {bankBody.type === "new" ? (
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
              name="bankStatus"
              value={bankBody.body.bankStatus}
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
        open={bankBody.openDeleteModal}
        title={ModalContent.PROFILE_FUNCTION_DELETE_TITLE}
        message={ModalContent.PROFILE_FUNCTION_DELETE_MESSAGE}
        handleClose={handleCloseDeleteProfileFunctionModal}
        handleDelete={handleDeleteProfileFunction}
      />

      {/* Confirmation Modal for Profile Function Status */}
      <ConfirmationModal
        open={bankBody.openConfirmationModal}
        title={ModalContent.BANK_STATUS_TITLE}
        message={
          bankBody.body.isActive
            ? ModalContent.BANK_ACTIVE_STATUS_MESSAGE
            : ModalContent.BANK_INACTIVE_STATUS_MESSAGE
        }
        handleClose={handleCloseConfirmationlModal}
        handleAction={handleUpdateStatus}
      />
    </DashboardLayout>
  );
}

export default LeadUtilsBanks;
