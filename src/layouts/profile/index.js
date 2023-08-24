// @mui material components
import Grid from "@mui/material/Grid";
import { Box, Tab, Tabs, CircularProgress, Icon, Card, Tooltip, IconButton } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import pxToRem from "assets/theme/functions/pxToRem";
// Overview page components
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProfileThunk from "redux/Thunks/Profile";
import Personaldetails from "examples/modal/UpdateProfile/PersonalDetails";
import bgImage from "assets/images/Profilebg.png";
import Pdf from "assets/images/pdf.svg";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import { useNavigate, useParams } from "react-router-dom";
import { UserListbyIdThunk } from "redux/Thunks/UserManagement";
import uploadImageThunk from "redux/Thunks/ImageUpload";
import { updateAdminProfileThunk } from "redux/Thunks/SuperAdmin";
import certificateActionThunk, { passportActionThunk } from "redux/Thunks/Certificate";
import moment from "moment";
import Constants, { Icons, defaultData } from "utils/Constants";
import CertificateConfirmationModal from "examples/modal/CertificateConfirmation";
import { openSnackbar } from "redux/Slice/Notification";

function Overview() {
  const mongooseID = "_id";
  const [profileData, setProfileData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState({ key: "", list: [] });
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOpenEdit = () => setOpenEdit(true);
  const handleOpen = (key, certificate) => {
    setOpen(true);
    setSelectedCertificate({ key, list: [certificate] });
  };
  useEffect(() => {
    (async () => {
      if (id) {
        // User Profile
        const res = await dispatch(UserListbyIdThunk(id));
        if (res.payload?.status === 200) {
          setProfileData([res.payload.data.data]);
        } else {
          navigate("/client/setting/usermanagement");
        }
      } else {
        // Admin Profile
        const res = await dispatch(ProfileThunk());
        setProfileData([res.payload.data]);
      }
    })();
  }, [id, update]);

  const handleApproveCertificate = async (status, comment) => {
    const { key } = selectedCertificate;
    const certificateId = selectedCertificate.list?.[0]?.[mongooseID];
    const userCert = profileData?.[0]?.userCertificate;

    const data = {
      id: userCert?.[mongooseID],
      key,
      certificateID: certificateId,
      status: { status, comment },
    };
    const res = await dispatch(certificateActionThunk(data));
    if (res.payload?.status === 200) {
      dispatch(
        openSnackbar({ message: Constants.CERTIFICATE_UPDATE, notificationType: "success" })
      );
      handleClose();
      setUpdate(!update);
    }
  };

  const handlePassportApprove = async (status, comment) => {
    const certificateId = selectedCertificate.list?.[0]?.[mongooseID];
    const userCert = profileData?.[0]?.contractualDetail;

    const data = {
      id: userCert?.[mongooseID],
      certificateID: certificateId,
      status: { status, comment },
    };
    const res = await dispatch(passportActionThunk(data));
    if (res.payload?.status === 200) {
      dispatch(
        openSnackbar({ message: Constants.CERTIFICATE_UPDATE, notificationType: "success" })
      );
      handleClose();
      setUpdate(!update);
    }
  };
  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    const type = "profile";
    const res = await dispatch(uploadImageThunk({ file, type }));
    if (res.error === undefined) {
      const b = {
        body: { profileImage: res.payload.data.iconUrl },
        id: profileData[0]?.[mongooseID],
      };
      const res1 = await dispatch(updateAdminProfileThunk(b));
      if (res1.error === undefined) {
        dispatch(
          openSnackbar({ message: Constants.PROFILE_IMAGE_UPDATE, notificationType: "success" })
        );
        setUpdate(!update);
      }
    } else {
      dispatch(
        openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
      );
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {profileData.length > 0 ? (
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
              height: "100%",
            }}
          >
            <Grid
              container
              spacing={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              alignContent={{ xs: "center", md: "flex-start", lg: "flex-start" }}
            >
              <Grid item>
                {profileData[0]?.profileImage ? (
                  <MDAvatar
                    src={profileData[0]?.profileImage}
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
                      {profileData[0]?.firstName.charAt(0)}
                    </MDTypography>
                  </MDAvatar>
                )}

                {profileData[0]?.role?.title.toLowerCase() === defaultData.ADMIN_ROLE ? (
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Tooltip title="Change profile image">
                        <IconButton
                          aria-label="change-profile-image"
                          component="label"
                          htmlFor="profile-image-input"
                        >
                          <Icon
                            fontSize="medium"
                            display="flex"
                            sx={{
                              ml: 14,
                              mt: -7,
                              cursor: "pointer",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "50%",
                            }}
                          >
                            {Icons.EDIT}
                          </Icon>
                          <input
                            type="file"
                            id="profile-image-input"
                            accept="image/*"
                            hidden
                            onChange={handleProfileImageChange}
                          />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
              <Grid item width="24%">
                {profileData?.map((element) => (
                  <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDBox display="flex" justifyContent="center" alignItems="center">
                      <MDTypography
                        sx={{ fontSize: pxToRem(20), fontWeight: "700", color: "#191D31" }}
                      >
                        {`${element?.firstName} ${element?.lastName}`}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" justifyContent="center" alignItems="center">
                      <Tooltip title={element?.email}>
                        <MDTypography
                          sx={{
                            fontSize: pxToRem(15),
                            fontWeight: "600",
                            marginLeft: "25px",
                            color: "#191D31",
                          }}
                        >
                          {element?.email.length > 20
                            ? `${element?.email.slice(0, 20)}...`
                            : element?.email}
                        </MDTypography>
                      </Tooltip>
                      <Icon
                        fontSize="medium"
                        onClick={handleOpenEdit}
                        sx={{ ml: 2, cursor: "pointer" }}
                      >
                        {Icons.EDIT}
                      </Icon>
                    </MDBox>
                  </MDBox>
                ))}
              </Grid>
            </Grid>
            <MDBox mt={5} mb={3}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 1, md: 3 }}
                display="flex"
                flexWrap="wrap"
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  xl={3}
                  sx={{
                    display: "flex",
                    height:
                      profileData[0]?.role?.accessType === defaultData.MOBILE_ACCESSTYPE ||
                      profileData[0]?.role?.accessType === defaultData.BOTH_ACCESSTYPE
                        ? "380px"
                        : "120px",
                  }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    orientation="vertical"
                    sx={{
                      backgroundColor: "#ffffff",
                      width: "100%!important",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Tab
                      defaultIndex={0}
                      label="Organizational Profile"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        fontSize: pxToRem(14),
                        paddingLeft: "12px",
                        fontWeight: `${value === 0 ? "600" : null}`,
                        borderRadius: 0,
                        width: "500px!important",
                        height: "34px!important",
                        backgroundColor: `${value === 0 ? "#F6F7FF" : "#ffffff"}`,
                        borderLeft: `2px solid ${value === 0 ? "#191A51" : "#ffffff"}`,
                      }}
                    />
                    <Tab
                      label="Personal Details"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: "12px",
                        paddingLeft: "12px",
                        fontSize: pxToRem(14),
                        fontWeight: `${value === 1 ? "600" : null}`,
                        borderRadius: 0,
                        height: "34px!important",
                        backgroundColor: `${value === 1 ? "#F6F7FF" : "#ffffff"}`,
                        borderLeft: `2px solid ${value === 1 ? "#191A51" : "#ffffff"}`,
                        textTransform: "capitalize",
                      }}
                    />
                    {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE ? null : (
                      <Tab
                        label="Certificates"
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          marginTop: "12px",
                          paddingLeft: "12px",
                          fontSize: pxToRem(14),
                          height: "34px!important",
                          fontWeight: `${value === 2 ? "600" : null}`,
                          borderRadius: 0,
                          backgroundColor: `${value === 2 ? "#F6F7FF" : "#ffffff"}`,
                          borderLeft: `2px solid ${value === 2 ? "#191A51" : "#ffffff"}`,
                        }}
                      />
                    )}
                    {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE ? null : (
                      <Tab
                        label="Contractual Details"
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          marginTop: "12px",
                          paddingLeft: "12px",
                          fontSize: pxToRem(14),
                          fontWeight: `${value === 3 ? "600" : null}`,
                          borderRadius: 0,
                          height: "34px!important",
                          backgroundColor: `${value === 3 ? "#F6F7FF" : "#ffffff"}`,
                          borderLeft: `2px solid ${value === 3 ? "#191A51" : "#ffffff"}`,
                        }}
                      />
                    )}
                    {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE ? null : (
                      <Tab
                        label="Medical"
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          marginTop: "12px",
                          paddingLeft: "12px",
                          fontSize: pxToRem(14),
                          height: "34px!important",
                          fontWeight: `${value === 4 ? "600" : null}`,
                          borderRadius: 0,
                          backgroundColor: `${value === 4 ? "#F6F7FF" : "#ffffff"}`,
                          borderLeft: `2px solid ${value === 4 ? "#191A51" : "#ffffff"}`,
                        }}
                      />
                    )}
                    {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE ? null : (
                      <Tab
                        label="GDRP"
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          marginTop: "12px",
                          paddingLeft: "12px",
                          height: "34px!important",
                          fontSize: pxToRem(14),
                          fontWeight: `${value === 5 ? "600" : null}`,
                          borderRadius: 0,
                          backgroundColor: `${value === 5 ? "#F6F7FF" : "#ffffff"}`,
                          borderLeft: `2px solid ${value === 5 ? "#191A51" : "#ffffff"}`,
                        }}
                      />
                    )}
                  </Tabs>
                </Grid>
                <Grid
                  xs
                  mt={{ xs: 0, sm: 0, md: -30, lg: -30 }}
                  sx={{ borderLeft: "1px solid #E0E6F5" }}
                >
                  {value === 0 && (
                    <Box>
                      {profileData?.map((element) => (
                        <ProfileInfoCard
                          title="Organizational Profile"
                          info={{
                            Organization: element?.account?.name ? element?.account?.name : "N/A",
                            Status: element.isActive ? "Active" : "Not Active",
                            Country: element?.country ? element?.country : "N/A",
                          }}
                          action={{ route: "", tooltip: "Edit Profile" }}
                          shadow={false}
                        />
                      ))}
                    </Box>
                  )}
                  {value === 1 && (
                    <Box>
                      {profileData?.map((element) => (
                        <ProfileInfoCard
                          title="Personal Details"
                          info={{
                            Phone: element?.contactNumber?.number
                              ? `${element?.contactNumber?.in}${element?.contactNumber?.number}`
                              : element?.contactNumber,
                            Country: element?.country ? element?.country : "N/A",
                            Address: element?.address ? element?.address : "N/A",
                            Nationality: element?.nationality ? element?.nationality : "N/A",
                            Languages: element?.motherLanguage ? element?.motherLanguage : "N/A",
                            ...(profileData[0]?.role.accessType !== defaultData.WEB_ACCESSTYPE && {
                              "Preferred Airport of Departure": element?.prefAirportDeprt
                                ? element?.prefAirportDeprt
                                : "N/A",
                              "Second Pref. Airport of Departure":
                                element?.secondaryPrefAirportDeprt
                                  ? element?.secondaryPrefAirportDeprt
                                  : "N/A",
                              "Driving License?": element?.drivingLicence ? "Yes" : "No",
                              "Shoe Size": element?.shoeSize ? element?.shoeSize : "N/A",
                              "Clothes Size": element?.clothesSize ? element?.clothesSize : "N/A",
                            }),
                          }}
                          action={{ route: "", tooltip: "Edit Profile" }}
                          shadow={false}
                        />
                      ))}
                      {profileData[0]?.role?.accessType === defaultData.WEB_ACCESSTYPE ? null : (
                        <MDBox>
                          <MDTypography
                            variant="h5"
                            fontWeight="medium"
                            color="text"
                            textTransform="capitalize"
                            mt={2}
                            ml={2}
                          >
                            {profileData[0]?.nextOfKin.length > 0 ? " Next of Kin" : null}
                          </MDTypography>
                          {profileData[0]?.nextOfKin?.map((kin, index) => (
                            <ProfileInfoCard
                              title={`Kin ${index + 1}`}
                              info={{
                                Name: kin?.kinName || "N/A",
                                Relationship: kin?.relationship || "N/A",
                                Address: kin
                                  ? `${kin?.kinStreet || ""} ${kin?.kinArea || ""} ${
                                      kin?.kinCity || ""
                                    } ${kin?.kinState || ""} ${kin?.kinCountry || ""} ${
                                      kin?.kinZip || ""
                                    }`
                                  : "N/A",
                                Phone: kin?.kinContactNumber
                                  ? `${kin?.kinContactNumber?.in}${kin?.kinContactNumber?.number}`
                                  : "N/A",
                              }}
                              action={{ route: "", tooltip: "Edit Profile" }}
                              shadow={false}
                            />
                          ))}
                        </MDBox>
                      )}
                    </Box>
                  )}
                  {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE
                    ? null
                    : value === 2 && (
                        <Box ml={2}>
                          <MDTypography
                            variant="h5"
                            fontWeight="medium"
                            color="text"
                            textTransform="capitalize"
                          >
                            Certificates
                          </MDTypography>
                          <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
                            mt={2}
                          >
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                Passport
                              </MDTypography>
                              {profileData?.map((element) => {
                                const passport = element?.contractualDetail?.identityProof?.[0];
                                const hasPassport = !!passport;
                                const tooltipTitle = hasPassport ? passport?.name : "N/A";
                                const displayedName =
                                  hasPassport && passport?.name.length > 20
                                    ? `${passport?.name.slice(0, 20)}...`
                                    : passport?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={passport?.name ?? "N/A"}
                                  >
                                    {!passport?.name || !passport?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasPassport
                                            ? passport.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}
                                    <MDBox ml={2} mt={0}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasPassport
                                          ? `${(parseFloat(passport.size) / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasPassport && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() => handleOpen("passport", passport)}
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                Copy CV
                              </MDTypography>
                              {profileData?.map((element) => {
                                const cv = element?.userCertificate?.cv?.[0];
                                const hasCV = !!cv;
                                const tooltipTitle = hasCV ? cv?.name : "N/A";
                                const displayedName =
                                  hasCV && cv?.name.length > 20
                                    ? `${cv?.name.slice(0, 20)}...`
                                    : cv?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={cv?.name ?? "N/A"}
                                  >
                                    {!cv?.name || !cv?.name.includes("pdf") ? (
                                      <img
                                        src={hasCV ? cv.url : process.env.REACT_APP_IMAGE_NOT_FOUND}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasCV
                                          ? `${(parseFloat(cv.size) / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasCV && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() => handleOpen("cv", cv)}
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                Medical (fit for offshore)
                              </MDTypography>
                              {profileData?.map((element) => {
                                const medical = element?.userCertificate?.medical?.[0];
                                const hasMedical = !!medical;
                                const tooltipTitle = hasMedical ? medical?.name : "N/A";
                                const displayedName =
                                  hasMedical && medical?.name.length > 20
                                    ? `${medical?.name.slice(0, 20)}...`
                                    : medical?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={medical?.name ?? "N/A"}
                                  >
                                    {!medical?.name || !medical?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasMedical
                                            ? medical.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        Start date :{" "}
                                        {hasMedical
                                          ? moment(medical.fromDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        End date :{" "}
                                        {hasMedical
                                          ? moment(medical.toDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasMedical
                                          ? `${(parseFloat(medical.size) / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasMedical && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() => handleOpen("medical", medical)}
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                GWO - Manual Handling
                              </MDTypography>
                              {profileData?.map((element) => {
                                const manualHandling =
                                  element?.userCertificate?.gwoManualHandling?.[0];
                                const hasManualHandling = !!manualHandling;
                                const tooltipTitle = hasManualHandling
                                  ? manualHandling?.name
                                  : "N/A";
                                const displayedName =
                                  hasManualHandling && manualHandling?.name.length > 20
                                    ? `${manualHandling?.name.slice(0, 20)}...`
                                    : manualHandling?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={manualHandling?.name ?? "N/A"}
                                  >
                                    {!manualHandling?.name ||
                                    !manualHandling?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasManualHandling
                                            ? manualHandling.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        Start date :{" "}
                                        {hasManualHandling
                                          ? moment(manualHandling.fromDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        End date :{" "}
                                        {hasManualHandling
                                          ? moment(manualHandling.toDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasManualHandling
                                          ? `${(parseFloat(manualHandling.size) / 1024).toFixed(
                                              2
                                            )} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasManualHandling && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() =>
                                          handleOpen("gwoManualHandling", manualHandling)
                                        }
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                GWO - First Aid
                              </MDTypography>
                              {profileData?.map((element) => {
                                const firstAid = element?.userCertificate?.gwoFristAid?.[0];
                                const hasFirstAid = !!firstAid;
                                const tooltipTitle = hasFirstAid ? firstAid?.name : "N/A";
                                const displayedName =
                                  hasFirstAid && firstAid?.name.length > 20
                                    ? `${firstAid?.name.slice(0, 20)}...`
                                    : firstAid?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={firstAid?.name ?? "N/A"}
                                  >
                                    {!firstAid?.name || !firstAid?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasFirstAid
                                            ? firstAid.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        Start date :{" "}
                                        {hasFirstAid
                                          ? moment(firstAid.fromDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        End date :{" "}
                                        {hasFirstAid
                                          ? moment(firstAid.toDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasFirstAid
                                          ? `${(parseFloat(firstAid.size) / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasFirstAid && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() => handleOpen("gwoFristAid", firstAid)}
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                GWO - Fire Awareness
                              </MDTypography>
                              {profileData?.map((element) => {
                                const fireAwareness =
                                  element?.userCertificate?.gwoFireAwareness?.[0];
                                const hasFireAwareness = !!fireAwareness;
                                const tooltipTitle = hasFireAwareness ? fireAwareness?.name : "N/A";
                                const displayedName =
                                  hasFireAwareness && fireAwareness?.name.length > 20
                                    ? `${fireAwareness?.name.slice(0, 20)}...`
                                    : fireAwareness?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={fireAwareness?.name ?? "N/A"}
                                  >
                                    {!fireAwareness?.name ||
                                    !fireAwareness?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasFireAwareness
                                            ? fireAwareness.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        Start date :{" "}
                                        {hasFireAwareness
                                          ? moment(fireAwareness.fromDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        End date :{" "}
                                        {hasFireAwareness
                                          ? moment(fireAwareness.toDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasFireAwareness
                                          ? `${(parseFloat(fireAwareness.size) / 1024).toFixed(
                                              2
                                            )} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasFireAwareness && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() =>
                                          handleOpen("gwoFireAwareness", fireAwareness)
                                        }
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                GWO - Working at Height
                              </MDTypography>
                              {profileData?.map((element) => {
                                const height = element?.userCertificate?.gwoWorkingAtHeight?.[0];
                                const hasHeight = !!height;
                                const tooltipTitle = hasHeight ? height?.name : "N/A";
                                const displayedName =
                                  hasHeight && height?.name.length > 20
                                    ? `${height?.name.slice(0, 20)}...`
                                    : height?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={height?.name ?? "N/A"}
                                  >
                                    {!height?.name || !height?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasHeight
                                            ? height.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        Start date :{" "}
                                        {hasHeight
                                          ? moment(height.fromDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        End date :{" "}
                                        {hasHeight
                                          ? moment(height.toDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasHeight
                                          ? `${(parseFloat(height.size) / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasHeight && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() => handleOpen("gwoWorkingAtHeight", height)}
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                            <Grid item xs={10} xl={5}>
                              <MDTypography
                                display="block"
                                variant="caption"
                                fontWeight="medium"
                                mb={1}
                                mt={1}
                              >
                                GWO - Sea Survival
                              </MDTypography>
                              {profileData?.map((element) => {
                                const seaSurvival = element?.userCertificate?.gwoSeaSurvival?.[0];
                                const hasSeaSurvival = !!seaSurvival;
                                const tooltipTitle = hasSeaSurvival ? seaSurvival?.name : "N/A";
                                const displayedName =
                                  hasSeaSurvival && seaSurvival?.name.length > 20
                                    ? `${seaSurvival?.name.slice(0, 20)}...`
                                    : seaSurvival?.name || "N/A";
                                return (
                                  <MDBox
                                    display="flex"
                                    border="1px solid #E0E6F5"
                                    borderRadius="8px"
                                    p={1}
                                    key={seaSurvival?.name ?? "N/A"}
                                  >
                                    {!seaSurvival?.name || !seaSurvival?.name.includes("pdf") ? (
                                      <img
                                        src={
                                          hasSeaSurvival
                                            ? seaSurvival.url
                                            : process.env.REACT_APP_IMAGE_NOT_FOUND
                                        }
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          border: "1px solid #D0D5DD",
                                          borderRadius: "8px",
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={Pdf}
                                        alt="Preview"
                                        height="60px"
                                        width="60px"
                                        style={{
                                          marginTop: "5px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    )}

                                    <MDBox ml={2}>
                                      <Tooltip title={tooltipTitle}>
                                        <MDTypography
                                          display="block"
                                          variant="caption"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {displayedName}
                                        </MDTypography>
                                      </Tooltip>
                                      <MDTypography display="block" variant="caption" color="text">
                                        Start date :{" "}
                                        {hasSeaSurvival
                                          ? moment(seaSurvival.fromDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        End date :{" "}
                                        {hasSeaSurvival
                                          ? moment(seaSurvival.toDate).format("DD-MM-YYYY")
                                          : "N/A"}
                                      </MDTypography>
                                      <MDTypography display="block" variant="caption" color="text">
                                        {hasSeaSurvival
                                          ? `${(parseFloat(seaSurvival.size) / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </MDTypography>
                                    </MDBox>
                                    {hasSeaSurvival && (
                                      <Icon
                                        fontSize="medium"
                                        sx={{ ml: "auto", cursor: "pointer" }}
                                        justifyContent="flex-end"
                                        onClick={() => handleOpen("gwoSeaSurvival", seaSurvival)}
                                      >
                                        {Icons.VIEW}
                                      </Icon>
                                    )}
                                  </MDBox>
                                );
                              })}
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                  {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE
                    ? null
                    : value === 3 && (
                        <Box>
                          {profileData?.map((element) => (
                            <ProfileInfoCard
                              title="Contractual Details"
                              info={{
                                "Passport/ID": element?.contractualDetail?.passport
                                  ? element?.contractualDetail?.passport
                                  : "N/A",
                                "National Identification Number (BSN/NINO/SSN etc.)": element
                                  ?.contractualDetail?.nationalIdentificationNumber
                                  ? element?.contractualDetail?.nationalIdentificationNumber
                                  : "N/A",
                                "Date of Birth": element?.contractualDetail?.birthDate
                                  ? moment(element?.contractualDetail?.birthDate).format(
                                      "DD-MM-YYYY"
                                    )
                                  : "N/A",
                                "Place of Birth": element?.contractualDetail?.birthPlace
                                  ? element?.contractualDetail?.birthPlace
                                  : "N/A",
                                "Employment Type": element?.contractualDetail?.employmentType
                                  ? element?.contractualDetail?.employmentType
                                  : "N/A",
                                ...(profileData[0]?.contractualDetail?.employmentType !==
                                  "internal-employee" && {
                                  "Company Name": element?.contractualDetail?.companyName
                                    ? element?.contractualDetail?.companyName
                                    : "N/A",
                                  "Company Registration Nr.": element?.contractualDetail
                                    ?.companyRegistrationNumber
                                    ? element?.contractualDetail?.companyRegistrationNumber
                                    : "N/A",
                                  "Company VAT Nr.": element?.contractualDetail?.companyVATNumber
                                    ? element?.contractualDetail?.companyVATNumber
                                    : "N/A",
                                  "Company Address": element?.contractualDetail?.companyAddress
                                    ? element?.contractualDetail?.companyAddress
                                    : "N/A",
                                }),
                                "Bank Name": element?.contractualDetail?.bankName
                                  ? element?.contractualDetail?.bankName
                                  : "N/A",
                                "Account Name Holder": element?.contractualDetail?.accountHolderName
                                  ? element?.contractualDetail?.accountHolderName
                                  : "N/A",
                                "Bank Account Nr (IBAN)": element?.contractualDetail?.bankAccount
                                  ? element?.contractualDetail?.bankAccount
                                  : "N/A",
                                "BIC/SWIFT": element?.contractualDetail?.bicSwift
                                  ? element?.contractualDetail?.bicSwift
                                  : "N/A",
                              }}
                              action={{ route: "", tooltip: "Edit Profile" }}
                              shadow={false}
                            />
                          ))}
                        </Box>
                      )}
                  {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE
                    ? null
                    : value === 4 && (
                        <Box>
                          <MDTypography
                            mt={2}
                            ml={2}
                            mb={2}
                            variant="h5"
                            fontWeight="medium"
                            color="text"
                            textTransform="capitalize"
                          >
                            Medical
                          </MDTypography>
                          {profileData[0]?.medical && profileData[0]?.medical.length > 0 ? (
                            profileData[0]?.medical.map((item) => (
                              <MDBox display="flex" alignContent="center" flexDirection="column">
                                <MDBox
                                  ml={2}
                                  display="flex"
                                  alignContent="center"
                                  py={2}
                                  pr={2}
                                  sx={{ borderBottom: "1px solid #E0E6F5" }}
                                >
                                  <MDBox display="flex" flexDirection="column" width="65%">
                                    <MDTypography
                                      textTransform="capitalize"
                                      sx={{
                                        fontSize: pxToRem(16),
                                        fontWeight: "500",
                                        color: "#667085",
                                      }}
                                    >
                                      {item.title}
                                    </MDTypography>
                                    <MDTypography
                                      textTransform="capitalize"
                                      sx={{
                                        fontSize: pxToRem(14),
                                        fontWeight: "400",
                                        color: "#667085",
                                      }}
                                    >
                                      {item.description}
                                    </MDTypography>
                                  </MDBox>
                                  <MDTypography
                                    sx={{
                                      fontSize: pxToRem(16),
                                      fontWeight: "600",
                                      color: "#191D31",
                                    }}
                                  >
                                    {item.answer ? "Yes" : "No"}
                                  </MDTypography>
                                </MDBox>
                              </MDBox>
                            ))
                          ) : (
                            <MDTypography
                              mt={2}
                              ml={2}
                              variant="h6"
                              fontWeight="medium"
                              color="text"
                              textTransform="capitalize"
                            >
                              No Medical data available
                            </MDTypography>
                          )}
                        </Box>
                      )}
                  {profileData[0]?.role.accessType === defaultData.WEB_ACCESSTYPE
                    ? null
                    : value === 5 && (
                        <Box>
                          {profileData?.map((element) => (
                            <ProfileInfoCard
                              title="GDRP"
                              info={{
                                "Grant permission to use information for business purposes":
                                  element?.gdpr && element?.gdpr[0]?.answer ? "Yes" : "No",
                                "Grant permission to use e-mail for communication":
                                  element?.gdpr && element?.gdpr[1]?.answer ? "Yes" : "No",
                              }}
                              action={{ route: "", tooltip: "Edit Profile" }}
                              shadow={false}
                            />
                          ))}
                        </Box>
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
      <Personaldetails
        openPersonal={openEdit}
        setOpenPersonal={setOpenEdit}
        title="Update Profile"
        pdata={profileData}
        update={update}
        setUpdate={setUpdate}
      />
      <CertificateConfirmationModal
        title="Approve Certificate"
        open={open}
        handleClose={handleClose}
        profileView={selectedCertificate}
        handleApprove={(status, comment) => {
          if (selectedCertificate.key === "passport") {
            handlePassportApprove(status, comment);
          } else {
            handleApproveCertificate(status, comment);
          }
        }}
      />
    </DashboardLayout>
  );
}

export default Overview;
