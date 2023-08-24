import React, { useEffect, useState } from "react";
import { Feature } from "flagged";

// Material components
import MDBox from "components/MDBox";
import { Button, Card, Divider, Grid } from "@mui/material";

// Custom components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import FilterDropdown from "components/Dropdown/FilterDropdown";

// Table Data
import ReportTypeData from "layouts/wfmwizard/DailyActivity/data/ReportTypes";

import { useDispatch, useSelector } from "react-redux";
import { projectListThunk } from "redux/Thunks/FieldsData";

import Constants, {
  Icons,
  PageTitles,
  ButtonTitles,
  Colors,
  ModalContent,
  FeatureTags,
  defaultData,
} from "utils/Constants";
import DataTable from "examples/Tables/DataTable";
import createReportType, {
  getAllReportTypes,
  updateReportType,
  deleteReportType,
} from "redux/Thunks/Report";
import { openSnackbar } from "redux/Slice/Notification";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import { useLocation } from "react-router-dom";
import MDInput from "components/MDInput";
import FDropdown2 from "components/Dropdown/fDropdown2";
import { reloadData, removeReportType } from "redux/Slice/Report";

function SetupReport() {
  const [projectList, setProjectList] = useState([]);
  const [reportTypeData, setReportTypeData] = useState({
    type: "new",
    openModal: false,
    list: [],
    body: {
      terminationTypeName: "",
      project: "",
    },
    errors: {},
    openDeleteModal: false,
    editDeleteId: "",
    loading: false,
  });
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([
    {
      inputLabel: "Project",
      list: [{ [Constants.MONGOOSE_ID]: "all", title: "All" }],
      selectedValue: "all",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const reportTypeList = useSelector((state) => state.report);
  const dispatch = useDispatch();

  const handleCloseReportType = () =>
    setReportTypeData((prev) => ({ ...prev, type: "new", openModal: false, body: {}, errors: {} }));

  const handleCloseDeleteReportTypeModal = () =>
    setReportTypeData((prev) => ({ ...prev, openDeleteModal: false }));

  const handleDeleteReportTypeModal = (id) => {
    setReportTypeData((prev) => ({ ...prev, openDeleteModal: true, editDeleteId: id }));
  };

  const handleEditReportType = (data) => {
    setReportTypeData((prev) => ({
      ...prev,
      type: "update",
      openModal: true,
      body: { ...data.body },
      editDeleteId: data.id,
    }));
  };

  const { columns, rows } = ReportTypeData(
    reportTypeList.reportType,
    handleEditReportType,
    handleDeleteReportTypeModal
  );

  const handleFilter = async (filterVale = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      project: filterVale[0].selectedValue,
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    await dispatch(getAllReportTypes(data));
  };

  useEffect(() => {
    const { openNewReportType } = location.state || { openNewReportType: false };
    setReportTypeData((prev) => ({ ...prev, openModal: openNewReportType }));
    const fetchProjects = async () => {
      const res = await dispatch(projectListThunk());
      setFilters((prevFilters) => [
        {
          inputLabel: "Project",
          list: [...filters[0].list, ...res.payload.data],
          selectedValue: "all",
        },
        ...prevFilters.slice(1),
      ]);
      setProjectList(res.payload.data);
    };
    fetchProjects();
    handleFilter();
  }, []);

  const handleReportTypeChange = (e) => {
    const { name, value } = e.target;
    setReportTypeData((prev) => ({ ...prev, body: { ...prev.body, [name]: value } }));
  };

  const reportTypevalidation = () => {
    const { body } = reportTypeData;
    const errors = {};
    if (!body.terminationTypeName) errors.terminationTypeName = Constants.REQUIRED;
    if (!body.project) errors.project = Constants.REQUIRED;
    return errors;
  };

  const handleCreateReportType = async () => {
    setLoading(true);
    const errors = reportTypevalidation();
    if (Object.keys(errors).length === 0) {
      const { body } = reportTypeData;
      const res = await dispatch(createReportType(body));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.REPORT_TYPE_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else if (res.payload.status === 400) {
        dispatch(
          openSnackbar({
            message: Constants.REPORT_TYPE_CREATE_ERROR,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
      setReportTypeData((prev) => ({ ...prev, openModal: false, errors: {}, body: {} }));
    } else {
      setReportTypeData((prev) => ({ ...prev, errors }));
    }
    setLoading(false);
  };

  const handleUpdateReportType = async () => {
    setLoading(true);
    const errors = reportTypevalidation();
    if (Object.keys(errors).length === 0) {
      const { body, editDeleteId } = reportTypeData;
      const res = await dispatch(updateReportType({ body, reportTypeId: editDeleteId }));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.REPORT_TYPE_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else if (res.payload.status === 400) {
        dispatch(
          openSnackbar({
            message: Constants.REPORT_TYPE_UPDATE_ERROR,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
      setReportTypeData((prev) => ({
        ...prev,
        openModal: false,
        errors: {},
        body: {},
        editDeleteId: "",
        type: "new",
      }));
    } else {
      setReportTypeData((prev) => ({ ...prev, errors }));
    }
    setLoading(false);
  };

  const handleDeleteReportType = async () => {
    const { editDeleteId } = reportTypeData;
    const res = await dispatch(deleteReportType(editDeleteId));
    if (res.payload.status === 200) {
      await dispatch(removeReportType(editDeleteId));
      await dispatch(
        openSnackbar({
          message: Constants.REPORT_TYPE_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      dispatch(
        openSnackbar({
          message: Constants.REPORT_TYPE_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setReportTypeData((prev) => ({ ...prev, openDeleteModal: false, editDeleteId: "" }));
  };

  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => [{ ...prev[0], selectedValue: value }, ...prev.slice(1)]);
    handleFilter([{ ...filters[0], selectedValue: value }, ...filters.slice(1)]);
  };

  const handleResetFilter = () => {
    setFilters((prev) => [{ ...prev[0], selectedValue: "all" }, ...prev.slice(1)]);
    handleFilter([{ ...filters[0], selectedValue: "all" }, ...filters.slice(1)]);
  };

  const handleTablePagination = async () => {
    const paramData = {
      page: next + 1,
      perPage: tablePagination.perPage,
      project: filters[0].selectedValue,
    };
    const data = new URLSearchParams(paramData);
    const res = await dispatch(getAllReportTypes(data));
    if (res.payload.status === 200) setNext(res.payload.data.data.length > 0 ? next + 1 : next);
  };
  const handleReload = async () => {
    await dispatch(reloadData());
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <PageTitle title={PageTitles.REPORT_TYPE} />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title={ButtonTitles.NEW_REPORT_TYPE}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => setReportTypeData((prev) => ({ ...prev, openModal: true }))}
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
      <Divider sx={{ marginTop: pxToRem(22) }} />
      <Feature name={FeatureTags.SETUP_REPORT}>
        <MDBox display="flex" justifyContent="space-between">
          <MDBox display="flex wrap" flexWrap="wrap" justifyContent="start">
            {filters?.map((val) => (
              <FilterDropdown
                label={val.inputLabel}
                name={val.inputLabel}
                defaultValue={val?.selectedValue}
                value={val?.selectedValue}
                handleChange={handleFilterChange}
                menu={val.list}
                key={val.inputLabel}
              />
            ))}
            <Button
              sx={{
                m: 2,
                mt: pxToRem(45),
                ml: 0,
                mb: 0,
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                },
                fontSize: pxToRem(14),
                textTransform: "capitalize",
              }}
              variant="outlined"
              color="info"
              startIcon={Icons.RESET_FILTER}
              onClick={handleResetFilter}
            >
              {ButtonTitles.RESET_FILTER}
            </Button>
          </MDBox>
        </MDBox>
        <MDBox mt={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
                  showTotalEntries={false}
                  noEndBorder
                  loading={reportTypeList.loading}
                  currentPage={tablePagination.page}
                  handleTablePagination={handleTablePagination}
                  handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
                />
              </MDBox>
            </Card>
          </Grid>
        </MDBox>

        {/* Create and Update Report type modal */}
        <BasicModal
          open={reportTypeData.openModal}
          handleClose={handleCloseReportType}
          title={
            reportTypeData.type === "new"
              ? ModalContent.NEW_REPORT_TYPE_TITLE
              : ModalContent.EDIT_REPORT_TYPE_TITLE
          }
          actionButton={
            (reportTypeData.type === "new" && !loading && ButtonTitles.SUBMIT) ||
            (reportTypeData.type === "new" && loading && ButtonTitles.SUBMIT_LOADING) ||
            (reportTypeData.type === "update" && !loading && ButtonTitles.UPDATE) ||
            (reportTypeData.type === "update" && loading && ButtonTitles.UPDATE_LOADING)
          }
          handleAction={
            reportTypeData.type === "new" ? handleCreateReportType : handleUpdateReportType
          }
        >
          <MDTypography
            variant="caption"
            mb={1}
            sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
          >
            Termination Type Name*
          </MDTypography>
          <MDInput
            sx={{
              marginTop: 0,
              marginBottom: 2,
              minWidth: 150,
              textTransform: "capitalize",
              "& input": {
                fontSize: "16px",
              },
            }}
            size="small"
            placeholder="Termination Type Name"
            variant="outlined"
            name="terminationTypeName"
            value={reportTypeData.body.terminationTypeName}
            error={reportTypeData.errors?.terminationTypeName}
            helperText={reportTypeData.errors?.terminationTypeName}
            FormHelperTextProps={{
              sx: { marginLeft: 0, color: "#FF2E2E" },
            }}
            onChange={handleReportTypeChange}
          />
          <FDropdown2
            label="Project"
            id="demo-select-small"
            name="project"
            value={reportTypeData.body.project}
            defaultValue=""
            options={projectList || []}
            error={reportTypeData.errors?.project}
            helperText={reportTypeData.errors?.project}
            handleChange={handleReportTypeChange}
            marginBottom={2}
          />
        </BasicModal>

        {/* Delete Modal for Report type */}
        <DeleteModal
          open={reportTypeData.openDeleteModal}
          title={ModalContent.REPORT_TYPE_DELETE_TITLE}
          message={ModalContent.REPORT_TYPE_DELETE_MESSAGE}
          handleClose={handleCloseDeleteReportTypeModal}
          handleDelete={handleDeleteReportType}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default SetupReport;
