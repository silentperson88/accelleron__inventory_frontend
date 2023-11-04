// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bgLogin.jpg";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ForgetPassword from "redux/Thunks/Authentication";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// Contants
import constant, { Colors } from "utils/Constants";
import { InputAdornment, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import pxToRem from "assets/theme/functions/pxToRem";
// Validations Rules
import Validations from "utils/Validations/index";
import MDInput from "components/MDInput";

// Logo
import logo from "assets/images/brand.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();

  const handleValidation = () => {
    const emailValidate = Validations.validate("email", email, null, null, true);
    if (emailValidate !== "") {
      setEmailError(emailValidate);
      return false;
    }
    return true;
  };
  const handleForgetPassword = async () => {
    setLoading(true);
    const val = handleValidation();
    if (val) {
      const res = await dispatch(ForgetPassword({ email }));
      if (res.payload.status === 200) {
        setStatus(true);
      } else if (res.payload.status === 400) {
        setError(constant.FORGET_PASSWORD_EMAIL_Failure);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError(Validations.validate("email", e.target.value, null, null, true));
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleForgetPassword(event);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <MDBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Card sx={{ width: pxToRem(450), backgroundColor: "#eceff7" }}>
          <MDBox display="flex" alignItems="center" justifyContent="center">
            <MDBox component="img" src={logo} alt="Brand" width="13rem" marginTop="42px" />
          </MDBox>
          {!status ? (
            <MDBox>
              <MDBox display="flex" alignItems="center" justifyContent="center">
                <MDTypography
                  sx={{ fontSize: pxToRem(24), fontWeight: 600, color: "#344054" }}
                  mt={2}
                >
                  Forgot Password
                </MDTypography>
              </MDBox>
              <MDBox ml={8} sx={{ width: pxToRem(320) }}>
                <MDTypography
                  sx={{ fontSize: pxToRem(14), fontWeight: 400, color: "#8C8C99" }}
                  my={1}
                >
                  {constant.FORGET_PASSWORD_MESSAGE}
                </MDTypography>
              </MDBox>
              <MDTypography textAlign="center" color="error" mt={1}>
                {error}
              </MDTypography>
              <MDBox pt={2} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2} ml={5}>
                    <InputLabel
                      sx={{
                        fontSize: pxToRem(16),
                        fontWeight: 600,
                        color: "#344054",
                        marginBottom: 1,
                      }}
                    >
                      Email
                    </InputLabel>
                    <MDInput
                      type="email"
                      value={email}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Enter Your Email Here"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon fontSize="medium" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        width: pxToRem(320),
                        backgroundColor: "#fff",
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                        },
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <MDTypography display="block" variant="button" color="error" ml={1}>
                      {emailError}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={4} ml={5}>
                    <MDButton
                      variant="gradient"
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: Colors.PRIMARY,
                        color: "#fff",
                        padding: 2,
                        fontSize: pxToRem(16),
                        fontWeight: 700,
                        width: pxToRem(320),
                      }}
                      onClick={handleForgetPassword}
                    >
                      {loading ? "Loading..." : "Send reset link"}
                    </MDButton>
                  </MDBox>
                  <Link to="/authentication/sign-in">
                    <MDTypography variant="caption" display="flex" justifyContent="center" mt={2}>
                      <ArrowBackIosIcon /> Back to login
                    </MDTypography>
                  </Link>
                  <MDBox textAlign="center" mt={3}>
                    <MDTypography
                      variant="caption"
                      sx={{ color: "#8C8C99", fontSize: pxToRem(12), fontWeight: 400 }}
                      fontWeight="light"
                    >
                      ©2023 Finvibes. All rights reserved.
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox
              mx={3}
              // mt={18}
              py={2}
              mb={3}
              display="flex"
              justifycontent="center"
              flexDirection="column"
              alignItems="center"
            >
              <MDTypography mb={3} textAlign="center" variant="Subtitle">
                {constant.FORGET_PASSWORD_EMAIL_SUCCESS}
              </MDTypography>
              <MDButton
                component={Link}
                to="/authentication/sign-in"
                variant="contained"
                color="info"
                fontWeight="medium"
                style={{ boxShadow: "none" }}
              >
                Back to Login
              </MDButton>
            </MDBox>
          )}
        </Card>
      </MDBox>
    </BasicLayout>
  );
}

export default ForgotPassword;
