import React, { useEffect, useState } from "react";

import MDBox from "components/MDBox";
import { Card, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import pxToRem from "assets/theme/functions/pxToRem";
import MDTypography from "components/MDTypography";
import moment from "moment";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import reportDetailsData from "layouts/report/data/reportDetailsData";

// Constant
import Constants, { Icons, CardTitles, Colors, FeatureTags, defaultData } from "utils/Constants";

// Redux Component
import { getReportById, updateReportStatus } from "redux/Thunks/Report";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import { Feature } from "flagged";

function reportDetails() {
  const [reportStatus, setReportStatus] = useState({
    openStatusModal: false,
    statusList: ["Open", "Submitted", "In Discussion", "Closed"],
    currentReportStatus: "",
  });
  const [reportDetail, setReprotDetail] = useState({
    list: [],
    body: {},
    loadingList: "pending",
  });
  const navigate = useNavigate();
  const { reportId } = useParams();

  const reports = useSelector((state) => state.report);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[6]?.screensInfo?.agreement;
  const dispatch = useDispatch();
  const { reportColumns, reportRows } = reportDetailsData(reportDetail.list);

  const handleCloseStatusChange = () =>
    setReportStatus({ ...reportStatus, openStatusModal: false });

  const fetchReportById = async () => {
    const res = await dispatch(getReportById(reportId));
    if (res?.payload.status === 200) {
      setReprotDetail({
        ...reportDetail,
        list: [res?.payload.data?.data],
        loadingList: "fullfilled",
      });
      const tempStatus = res?.payload.data?.data?.status
        .split("_")
        .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`);
      setReportStatus({
        ...reportStatus,
        openStatusModal: false,
        currentReportStatus: tempStatus.join(" "),
      });
    } else {
      navigate("/client/report");
    }
  };

  useEffect(() => {
    (async () => {
      if (reports.reportList.length > 0) {
        const tempReport = reports.reportList.find(
          (report) => report[Constants.MONGOOSE_ID] === reportId
        );
        setReprotDetail({ ...reportDetail, list: [tempReport], loadingList: "fullfilled" });
        const tempStatus = tempReport?.status
          .split("_")
          .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`);
        setReportStatus({
          ...reportStatus,
          currentReportStatus: tempStatus,
        });
      } else {
        fetchReportById();
      }
    })();
  }, []);

  const handleReportStatusChange = async (e) => {
    const newStatus = e.target.value;
    const body = {
      status: newStatus.replace(" ", "_").toLowerCase(),
    };
    const res = await dispatch(updateReportStatus({ reportId, body }));
    if (res?.payload.status === 200) {
      setReportStatus({ ...reportStatus, currentReportStatus: newStatus.replace("_", " ") });
      handleCloseStatusChange();
      fetchReportById();
      dispatch(
        openSnackbar({
          message: Constants.REPORT_STATUS_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else {
      dispatch(
        openSnackbar({
          message: Constants.REPORT_STATUS_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageTitle title="Report Details" />
      <Feature name={FeatureTags.SETUP_REPORT}>
        <>
          <Card id="delete-account" sx={{ mt: 3 }}>
            <MDBox>
              <MDBox borderRadius="lg" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderRadius="lg"
                  sx={{
                    py: pxToRem(10),
                    px: pxToRem(24),
                    height: pxToRem(55),
                    background: Colors.PRIMARY,
                    color: Colors.WHITE,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <MDTypography variant="h6" fontWeight="medium" color="white">
                    {CardTitles.REPORT_DETAILS}
                  </MDTypography>
                </MDBox>

                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ mt: pxToRem(10), borderRight: "0.0625rem solid #E0E6F5" }}
                  >
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(49),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Project
                      </MDTypography>
                      <MDBox
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {reportDetail.list[0]?.project?.title}
                      </MDBox>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(49),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Report Type
                      </MDTypography>
                      <MDBox
                        lineHeight={1}
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {reportDetail.list[0]?.reportType?.terminationTypeName}
                      </MDBox>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(49),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Location
                      </MDTypography>
                      <MDBox
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {reportDetail.list[0]?.location?.title}
                      </MDBox>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(70),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Status
                      </MDTypography>
                      <MDBox
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        <FormControl sx={{ minWidth: 100 }} size="small">
                          <Select
                            displayEmpty
                            disabled={!permission?.update}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            name="Select Status"
                            sx={{ height: 40, textTransform: "capitalize" }}
                            value={reportStatus.currentReportStatus}
                            onChange={handleReportStatusChange}
                            IconComponent={Icons.DROPDOWN}
                          >
                            {reportStatus.statusList.map((item) => (
                              <MenuItem
                                key={item}
                                value={item}
                                sx={{ textTransform: "capitalize" }}
                              >
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </MDBox>
                    </MDBox>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ mt: pxToRem(8), borderRight: "0.0625rem solid #E0E6F5" }}
                  >
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(49),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Cable
                      </MDTypography>
                      <MDBox
                        lineHeight={1}
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {reportDetail.list[0]?.cable?.cableName}
                      </MDBox>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(49),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Date
                      </MDTypography>
                      <MDBox
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {moment(reportDetail.list[0]?.createdAt).format(
                          defaultData.WEB_DATE_FORMAT
                        )}
                      </MDBox>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(49),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Created by
                      </MDTypography>
                      <MDBox
                        lineHeight={1}
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {reportDetail.list[0]?.account?.name}
                      </MDBox>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      display="flex"
                      justifyContent="start"
                      alignItems="center"
                      sx={{
                        py: pxToRem(4),
                        px: pxToRem(24),
                        height: pxToRem(70),
                      }}
                    >
                      <MDTypography variant="h6" fontWeight="medium" color="secondary" width="60%">
                        Total No. of Parameters
                      </MDTypography>
                      <MDBox
                        lineHeight={1}
                        sx={{
                          fontSize: pxToRem(14),
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {reportRows.length}
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>

          <MDBox mt={5}>
            <Grid item xs={12}>
              <Card>
                <MDBox>
                  <DataTable
                    table={{ columns: reportColumns, rows: reportRows }}
                    isSorted
                    entriesPerPage={{ defaultValue: 10 }}
                    showTotalEntries={false}
                    noEndBorder
                    loading={reportDetail.loadingList}
                    licenseRequired
                  />
                </MDBox>
              </Card>
            </Grid>
          </MDBox>

          {/* Shift Status */}
          <BasicModal
            open={reportStatus.openStatusModal}
            handleClose={handleCloseStatusChange}
            title={Constants.REPORT_STATUS}
          >
            <FormControl sx={{ m: 1, ml: 0, minWidth: 150 }} size="small">
              <InputLabel id="demo-select-small">Select Status</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                label="Select Status"
                name="Select Status"
                sx={{ height: 40, textTransform: "capitalize" }}
                value={reportStatus.currentReportStatus}
                onChange={handleReportStatusChange}
                IconComponent={Icons.DROPDOWN}
              >
                {reportStatus.statusList.map((item) => (
                  <MenuItem key={item} value={item} sx={{ textTransform: "capitalize" }}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </BasicModal>
        </>
      </Feature>
    </DashboardLayout>
  );
}

export default reportDetails;
