import React, { useEffect, useState } from "react";

import { Button, FormControl, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import Report from "layouts/report/data/reportData";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";

// Constant
import Constants, {
  ButtonTitles,
  Icons,
  ModalContent,
  PageTitles,
  FeatureTags,
  defaultData,
  Colors,
} from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";

// Redux component
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReportTypes,
  getAllReports,
  deleteReport,
  exportReportThunk,
} from "redux/Thunks/Report";
import { projectListThunk } from "redux/Thunks/FieldsData";
import { openSnackbar } from "redux/Slice/Notification";
import UserListThunk from "redux/Thunks/UserManagement";
import MDTypography from "components/MDTypography";
import { Feature } from "flagged";
import { removeReport } from "redux/Slice/Report";

function reports() {
  const mongooseId = "_id";
  const [filters, setFilters] = useState([
    {
      inputLabel: "Project",
      list: [{ [mongooseId]: "all", title: "All" }],
      selectedValue: "all",
    },
    {
      inputLabel: "Report Type",
      list: [{ [mongooseId]: "all", terminationTypeName: "All" }],
      selectedValue: "all",
    },
    {
      inputLabel: "Submitted By",
      list: [{ [mongooseId]: "all", title: "All" }],
      selectedValue: "all",
    },
    {
      inputLabel: "Date",
      list: ["All", "Today", "This Week", "This Month", "Last Month", "This Year"],
      selectedValue: "All",
    },

    {
      inputLabel: "Status",
      list: ["All", "Open", "Submitted", "In Discussion", "Closed"],
      selectedValue: "All",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const [reportData, setReportData] = useState({
    type: "new",
    openModal: false,
    openDeleteModal: false,
    list: [],
    body: {},
    deleteId: "",
    error: {},
    loading: false,
  });
  const reportSLice = useSelector((state) => state?.report);
  const dispatch = useDispatch();

  const handleCloseDeleteModal = () => setReportData({ ...reportData, openDeleteModal: false });
  const handleOpenDeleteModal = (reportId) =>
    setReportData({ ...reportData, openDeleteModal: true, deleteId: reportId });

  const handleDownloadReport = async (reportId, format = "pdf") => {
    const currentDate = new Date();
    const filename = `reynard_report_${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.${format}`;

    const res = await dispatch(exportReportThunk(reportId));
    const url = window.URL.createObjectURL(res.payload);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const { columns, rows } = Report(
    reportSLice.reportList,
    handleOpenDeleteModal,
    handleDownloadReport
  );

  const handleFilter = async (filterVale = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      project: filterVale[0].selectedValue,
      reportType: filterVale[1].selectedValue,
      createdBy: filterVale[2].selectedValue.toLowerCase().replace(/ /g, "_"),
      created: filterVale[3].selectedValue.toLowerCase().replace(/ /g, "_"),
      status: filterVale[4].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    await dispatch(getAllReports(data));
  };

  useEffect(() => {
    (async () => {
      const paramData = {
        page: 0,
        perPage: 100,
        project: filters[0].selectedValue,
      };
      const data = new URLSearchParams(paramData);
      handleFilter();
      const [projectList, reportTypeList, users] = await Promise.all([
        dispatch(projectListThunk()),
        dispatch(getAllReportTypes(data)),
        dispatch(UserListThunk()),
      ]);
      const temp = [...filters];
      filters[0].list = [...filters[0].list, ...projectList.payload.data];
      filters[1].list = [...filters[1].list, ...reportTypeList.payload.data.data];
      // filter users whose role is not admin
      const userList = users.payload.data.data.reduce((acc, user) => {
        if (
          user.role?.accessType !== defaultData.WEB_ACCESSTYPE &&
          user.role?.title !== defaultData.SUPER_ADMIN_ROLE &&
          user.role?.title !== defaultData.ADMIN_ROLE
        ) {
          acc.push({
            [Constants.MONGOOSE_ID]: user[Constants.MONGOOSE_ID],
            title: `${user.firstName}${user.lastName}`,
          });
        }
        return acc;
      }, []);
      filters[2].list = [...filters[2].list, ...userList];
      setFilters(temp);
    })();
  }, []);

  const handleFilterChange = (e) => {
    const temp = [...filters];
    const { value } = e.target;
    const index = filters.findIndex((filter) => filter.inputLabel === e.target.name);
    temp[index].selectedValue = value;
    setFilters(temp);
    handleFilter(temp);
  };

  const handleResetFilter = () => {
    const temp = filters.map((filter) => ({
      ...filter,
      selectedValue: filter.list[0][mongooseId] || filter.list[0],
    }));
    setFilters(temp);
    handleFilter(temp);
  };

  const handleDeleteReport = async () => {
    const res = await dispatch(deleteReport(reportData.deleteId));
    if (res.payload.status === 200) {
      await dispatch(removeReport());
      await dispatch(
        openSnackbar({
          message: Constants.REPORT_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      await dispatch(
        openSnackbar({
          message: Constants.REPORT_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }

    setReportData({ ...reportData, openDeleteModal: false, deleteId: "" });
  };

  const handleTablePagination = async () => {
    const paramData = {
      page: next + 1,
      perPage: tablePagination.perPage,
      project: filters[0].selectedValue,
      reportType: filters[1].selectedValue,
      createdBy: filters[2].selectedValue.toLowerCase().replace(/ /g, "_"),
      created: filters[3].selectedValue.toLowerCase().replace(/ /g, "_"),
      status: filters[4].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    const data = new URLSearchParams(paramData);
    const res = await dispatch(getAllReports(data));
    if (res.payload.status === 200) setNext(res.payload.data.length > 0 ? next + 1 : next);
  };
  const handleReload = async () => {
    reportData.loading = false;
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.REPORT} />
        <BasicButton
          icon={Icons.RELOAD}
          background={Colors.WHITE}
          border
          color={Colors.BLACK}
          action={handleReload}
        />
      </MDBox>
      <Feature name={FeatureTags.SETUP_REPORT}>
        <>
          <MDBox display="flex" justifyContent="space-between" mt={2} mx={0}>
            <MDBox display="flex wrap" flexWrap="wrap" justifyContent="start" mt={2} mx={0}>
              {filters &&
                filters.map((val) => (
                  <FormControl
                    sx={{ m: 1, ml: 0, minWidth: 150 }}
                    size="small"
                    key={val.inputLabel}
                  >
                    <MDTypography
                      variant="caption"
                      mb={1}
                      sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                    >
                      {val.inputLabel}
                    </MDTypography>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      name={val?.inputLabel}
                      defaultValue={val?.selectedValue}
                      value={val?.selectedValue}
                      sx={{
                        height: 40,
                        fontWeight: 600,
                        textTransform: "capitalize",
                        backgroundColor: "#fff",
                        paddingY: "0.65rem",
                        paddingRight: "0.55rem",
                        cursor: "pointer",
                      }}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                      }}
                      IconComponent={Icons.DROPDOWN}
                      onChange={handleFilterChange}
                    >
                      {val.list.map((item) => (
                        <MenuItem
                          key={item?.[mongooseId] || item}
                          value={item?.[mongooseId] || item}
                          sx={{
                            textTransform: "capitalize",
                            fontSize: pxToRem(14),
                            fontWeight: 400,
                            color: "#344054",
                          }}
                        >
                          {item?.title || item?.terminationTypeName || item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              <Button
                sx={{
                  mt: 4,
                  mr: 1,
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
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
              showTotalEntries={false}
              noEndBorder
              loading={reportSLice?.reportLoading}
              licenseRequired
              currentPage={tablePagination.page}
              handleTablePagination={handleTablePagination}
              handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
            />
          </MDBox>

          {/* Delete Modal for Report type */}
          <DeleteModal
            open={reportData.openDeleteModal}
            title={ModalContent.REPORT_DELETE_TITLE}
            message={ModalContent.REPORT_DELETE_MESSAGE}
            handleClose={handleCloseDeleteModal}
            handleDelete={handleDeleteReport}
          />
        </>
      </Feature>
    </DashboardLayout>
  );
}

export default reports;
