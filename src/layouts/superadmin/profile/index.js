// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import ConfirmationModal from "examples/modal/ConfirmationModal";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Icon,
  Tab,
  Tabs,
  Tooltip,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from "assets/images/Profilebg.png";
import pxToRem from "assets/theme/functions/pxToRem";
import AdminListThunk, { adminUserThunk } from "redux/Thunks/SuperAdmin";
import Personaldetails from "examples/modal/UpdateProfile/PersonalDetails";
import licenseListThunk, {
  accountLicenseByIdThunk,
  requestLicenseThunk,
} from "redux/Thunks/License";
import Constants, { Icons } from "utils/Constants";
import { openSnackbar } from "redux/Slice/Notification";
import MDAvatar from "components/MDAvatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Overview() {
  const [adminData, setAdminData] = useState({});
  const [permission, setPermission] = useState([]);
  const [value, setValue] = useState(0);
  const [confirmationData, setConfirmationData] = useState({
    open: false,
    title: "",
    selectedLicense: {},
    accountId: "",
  });
  const [update, setUpdate] = useState(false);
  const [openPersonal, setOpenPersonal] = useState(false);
  const adminList = useSelector((state) => state.superadmin);
  const licenseList = useSelector((state) => state.License.allLicense);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOpenPersonal = () => setOpenPersonal(true);

  const fetchAccountLicense = async () => {
    if (adminList.lists.length > 0) {
      const currentUser = adminList.lists.find(
        (item) => item.accountOwner[Constants.MONGOOSE_ID] === id
      );
      setConfirmationData({
        ...confirmationData,
        accountId: currentUser[Constants.MONGOOSE_ID],
      });
      const res = await dispatch(accountLicenseByIdThunk(currentUser[Constants.MONGOOSE_ID]));
      setPermission(res.payload.data);
    } else if (adminList.lists.length === 0) {
      const data = new URLSearchParams({
        page: 0,
        perPage: 20,
      });
      await dispatch(AdminListThunk(data));
    }
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const res = await dispatch(adminUserThunk(id));
        if (res.payload.status === 200) {
          setAdminData(res.payload?.data?.data);
        } else {
          navigate("/admin/home");
        }
      }
    })();
  }, [id, update]);

  useEffect(() => {
    (async () => {
      if (licenseList.length === 0) {
        await dispatch(licenseListThunk());
      }
      fetchAccountLicense();
    })();
  }, [adminList]);

  const handleChange = (event, licenceId, permissionId) => {
    if (event.target.checked) {
      setConfirmationData({
        ...confirmationData,
        open: true,
        title: "Approve Permission",
        selectedLicense: { licence: licenceId, permission: [permissionId] },
      });
    } else {
      setConfirmationData({
        ...confirmationData,
        open: true,
        title: "Remove Permission",
        selectedLicense: { licence: licenceId, permission: [permissionId] },
      });
    }
  };

  const handleConfirmation = async () => {
    const body = {
      isRequested: confirmationData.title === "Approve Permission",
      isRejected: confirmationData.title === "Remove Permission",
      isApproved: confirmationData.title === "Approve Permission",
      account: confirmationData.accountId,
      ...confirmationData.selectedLicense,
    };
    await dispatch(requestLicenseThunk(body));
    await dispatch(
      openSnackbar({
        message:
          confirmationData.title === "Approve Permission"
            ? Constants.LICENSE_PROVISION_SUCCESS
            : Constants.LICENSE_REMOVED_SUCCESS,
        notificationType: Constants.NOTIFICATION_SUCCESS,
      })
    );
    fetchAccountLicense();
    setConfirmationData({ ...confirmationData, open: false, title: "" });
  };

  const handleConfirmationClose = () => {
    setConfirmationData({ ...confirmationData, open: false, title: "" });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {adminData && Object.keys(adminData).length > 0 ? (
        <MDBox position="relative">
          <MDBox
            display="flex"
            alignItems="center"
            position="relative"
            minHeight="14.75rem"
            ml={-4}
            mr={-3.5}
            sx={{
              backgroundImage: ({ functions: { rgba, linearGradient } }) =>
                `${linearGradient(rgba("#FFC9B0", 0.6), rgba("#FFC9B0", 0.6))}, url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "50%",
              overflow: "hidden",
            }}
          />
          <Card
            sx={{
              position: "relative",
              mt: -24,
              py: 6,
              height: "100vh",
              mb: 2,
            }}
          >
            <Grid
              container
              spacing={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              alignContent="flex-start"
            >
              <Grid item>
                {adminData?.profileImage ? (
                  <MDAvatar
                    src={adminData?.profileImage}
                    bgColor="info"
                    size="xxl"
                    shadow="sm"
                    sx={{ marginLeft: "35px" }}
                  />
                ) : (
                  <MDAvatar
                    size="xxl"
                    shadow="sm"
                    sx={{ marginLeft: "35px", backgroundColor: "#191A51" }}
                  >
                    <MDTypography color="light" sx={{ fontSize: pxToRem(50), fontWeight: "700" }}>
                      {adminData?.firstName.charAt(0)}
                    </MDTypography>
                  </MDAvatar>
                )}
              </Grid>
              <Grid item width="24%">
                <MDBox height="100%" mt={0.5} lineHeight={1}>
                  <MDBox display="flex" justifyContent="center" alignItems="center">
                    <MDTypography
                      sx={{ fontSize: pxToRem(20), fontWeight: "700", color: "#191D31" }}
                    >
                      {`${adminData?.firstName} ${adminData?.lastName}`}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" alignItems="center">
                    <MDTypography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: "600",
                        marginLeft: "25px",
                        color: "#191D31",
                      }}
                    >
                      {adminData?.email}
                    </MDTypography>
                    <Tooltip title="Edit Profile" placement="top">
                      <Icon
                        fontSize="medium"
                        onClick={handleOpenPersonal}
                        sx={{ ml: 1, cursor: "pointer", marginBottom: "4px" }}
                      >
                        {Icons.EDIT}
                      </Icon>
                    </Tooltip>
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={5} mb={3}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  xl={3}
                  sx={{
                    display: "flex",
                    height: "180px",
                  }}
                >
                  <Tabs
                    value={value}
                    onChange={handleTabChange}
                    orientation="vertical"
                    aria-label="Vertical tabs example"
                    sx={{ backgroundColor: "#ffffff", width: "100%!important" }}
                  >
                    <Tab
                      defaultIndex={0}
                      label="Admin Details"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        fontSize: pxToRem(14),
                        paddingLeft: "12px",
                        fontWeight: `${value === 0 ? "600" : null}`,
                        borderRadius: 0,
                        width: "500px!important",
                        backgroundColor: `${value === 0 ? "#F6F7FF" : "#ffffff"}`,
                        borderLeft: `2px solid ${value === 0 ? "#191A51" : "#ffffff"}`,
                      }}
                    />
                    <Tab
                      label="Organizational Profile"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: "12px",
                        paddingLeft: "12px",
                        fontSize: pxToRem(14),
                        fontWeight: `${value === 1 ? "600" : null}`,
                        borderRadius: 0,
                        backgroundColor: `${value === 1 ? "#F6F7FF" : "#ffffff"}`,
                        borderLeft: `2px solid ${value === 1 ? "#191A51" : "#ffffff"}`,
                      }}
                    />
                    <Tab
                      label="License"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: "12px",
                        paddingLeft: "12px",
                        fontSize: pxToRem(14),
                        fontWeight: `${value === 2 ? "600" : null}`,
                        borderRadius: 0,
                        backgroundColor: `${value === 2 ? "#F6F7FF" : "#ffffff"}`,
                        borderLeft: `2px solid ${value === 2 ? "#191A51" : "#ffffff"}`,
                      }}
                    />
                  </Tabs>
                </Grid>
                <Grid item xs mt={-30} sx={{ borderLeft: "1px solid #E0E6F5" }}>
                  {value === 0 && (
                    <Box>
                      <MDBox key={adminData[Constants.MONGOOSE_ID]}>
                        <ProfileInfoCard
                          title="Admin Details"
                          info={{
                            Phone: adminData?.contactNumber?.number
                              ? `${adminData?.contactNumber?.in}${adminData?.contactNumber?.number}`
                              : adminData?.contactNumber,
                            Country: adminData?.country ? adminData?.country : "N/A",
                            Address: adminData?.address ? adminData?.address : "N/A",
                            Nationality: adminData?.nationality ? adminData?.nationality : "N/A",
                            Languages: adminData?.motherLanguage
                              ? adminData?.motherLanguage
                              : "N/A",
                          }}
                          action={{ route: "", tooltip: "Edit Profile" }}
                          shadow={false}
                        />
                      </MDBox>
                    </Box>
                  )}
                  {value === 1 && (
                    <Box>
                      <MDBox key={adminData[Constants.MONGOOSE_ID]}>
                        <ProfileInfoCard
                          title="Organization Profile"
                          info={{
                            oraganization: adminData?.account?.name,
                            status: adminData?.isActive ? "Active" : "DeActive",
                            Country: adminData?.country ? adminData?.country : "N/A",
                          }}
                          action={{ route: "", tooltip: "Edit Profile" }}
                          shadow={false}
                        />
                      </MDBox>
                    </Box>
                  )}
                  {value === 2 && (
                    <Card sx={{ height: "100%", boxShadow: "none" }}>
                      <MDBox p={2}>
                        <MDTypography
                          variant="h5"
                          fontWeight="medium"
                          color="text"
                          textTransform="capitalize"
                        >
                          License
                        </MDTypography>
                      </MDBox>
                      {licenseList.map((val) => (
                        <Accordion key={val[Constants.MONGOOSE_ID]} style={{ boxShadow: "none" }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            style={{ boxShadow: "none", borderBottom: "1px solid #E0E6F5" }}
                          >
                            <MDTypography
                              variant="caption"
                              fontWeight="regular"
                              color="text"
                              textTransform="capitalize"
                            >
                              {val?.name}
                            </MDTypography>
                          </AccordionSummary>
                          {val.permissions.map((item) => (
                            <AccordionDetails key={item[Constants.MONGOOSE_ID]}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={permission.some(
                                      (element) => element?.permission?.name === item?.name
                                    )}
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        val[Constants.MONGOOSE_ID],
                                        item[Constants.MONGOOSE_ID]
                                      )
                                    }
                                    name={item?.name}
                                  />
                                }
                                label={item?.name}
                              />
                            </AccordionDetails>
                          ))}
                        </Accordion>
                      ))}
                    </Card>
                  )}
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </MDBox>
      ) : (
        <MDBox py={5} mt={30} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )}
      {openPersonal && (
        <Personaldetails
          openPersonal={openPersonal}
          setOpenPersonal={setOpenPersonal}
          title="Update Admin Profile"
          data={adminData}
          update={update}
          setUpdate={setUpdate}
        />
      )}
      {confirmationData.open && (
        <ConfirmationModal
          title={confirmationData.title}
          open={confirmationData.open}
          handleClose={handleConfirmationClose}
          handleAction={handleConfirmation}
        />
      )}
    </DashboardLayout>
  );
}

export default Overview;
