/* eslint-disable react/self-closing-comp */
import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/authentication-background.jpg";
// import logo from "assets/images/loginLogo.png";
import { InputAdornment, InputLabel } from "@mui/material";
import pxToRem from "assets/theme/functions/pxToRem";
// Validations Rules
import Validations from "utils/Validations/index";

// Sessions
import { Colors } from "utils/Constants";

// Logo
import logo from "assets/images/brand.png";
import firebase from "firebaseConfig";

function CustomerLogin() {
  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationId, setVerificationId] = useState("");

  const handlePhoneValidation = () => {
    const mobileNumberValidation = Validations.validate("phone", mobileNumber, 10, 10, true);

    console.log(mobileNumberValidation);

    if (mobileNumberValidation !== "") {
      setMobileNumberError(mobileNumberValidation);
      return false;
    }
    return true;
  };

  const handleOTPValidation = () => {
    const otpValidation = Validations.validate("otp", otp, 6, 6, true);
    if (otpValidation !== "") {
      setOtpError(otpValidation);
      return false;
    }
    return true;
  };

  const handleSignInWithPhoneNumber = async () => {
    if (handlePhoneValidation() === false) return;
    const recaptchaContainer = document.getElementById("recaptcha-container");
    console.log(recaptchaContainer);
    const appVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer, {
      size: "normal", // or 'normal'
      callback: (response) => {
        console.log("Captcha Resolved", response);
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });

    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(mobileNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
    } catch (error) {
      console.error(error);
      // Handle the error appropriately
    }

    setOtpSent(true);
  };

  const handleOtpVerfication = async () => {
    if (handleOTPValidation() === false) return;
    setLoading(true);
  };

  const handleMobileNumberChange = (e) => {
    const { value } = e.target;
    if (value.length <= 10) setMobileNumber(value);
    setMobileNumberError("");
  };

  useEffect(() => {
    console.log(verificationId);
  }, [verificationId]);

  const handleOTPChange = (e) => {
    const { value } = e.target;
    if (value.length <= 6) setOTP(value);
    setOtpError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (otpSent) {
        handleOtpVerfication();
      } else {
        handleSignInWithPhoneNumber();
      }
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
        <Card
          sx={{
            width: pxToRem(450),
            backgroundColor: "#eceff7",
          }}
        >
          <MDBox display="flex" alignItems="center" justifyContent="center">
            <MDBox component="img" src={logo} alt="Brand" width="13rem" marginTop="42px" />
          </MDBox>
          <MDBox display="flex" alignItems="center" justifyContent="center">
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form">
                {!otpSent ? (
                  <MDBox mb={2}>
                    <InputLabel
                      sx={{
                        fontSize: pxToRem(16),
                        fontWeight: 600,
                        color: "#344054",
                        marginBottom: 1,
                      }}
                    >
                      Mobile Number
                    </InputLabel>
                    <MDInput
                      sx={{
                        width: pxToRem(320),
                        backgroundColor: "#fff",
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                        },
                      }}
                      type="tel"
                      value={mobileNumber}
                      placeholder="Enter Your Mobile Number Here"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                      }}
                      onChange={handleMobileNumberChange}
                      onKeyDown={handleKeyDown}
                    />
                    <MDTypography variant="caption" color="error" display="flex" mt={1}>
                      {mobileNumberError}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <MDBox mb={2}>
                    <InputLabel
                      sx={{
                        fontSize: pxToRem(16),
                        fontWeight: 600,
                        color: "#344054",
                        marginBottom: 1,
                      }}
                    >
                      OTP (One-Time Password)
                    </InputLabel>
                    <MDInput
                      sx={{
                        width: pxToRem(320),
                        backgroundColor: "#fff",
                        borderRadius: 0,
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                        },
                      }}
                      type="number"
                      onChange={handleOTPChange}
                      value={otp}
                      placeholder="Enter OTP Here"
                      onKeyDown={handleKeyDown}
                    />
                    <MDTypography variant="button" color="error" mt={1} display="flex">
                      {otpError}
                    </MDTypography>
                  </MDBox>
                )}

                <div id="recaptcha-container"></div>

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
                  disabled={loading}
                  onClick={otpSent ? handleOtpVerfication : handleSignInWithPhoneNumber}
                  fullWidth
                >
                  {(!loading && !otpSent && "Send OTP") ||
                    (loading && !otpSent && "Sending Otp...") ||
                    (!loading && otpSent && `Verify OTP`) ||
                    (loading && otpSent && `Verifying OTP...`)}
                </MDButton>
                <MDBox textAlign="center" mt={4}>
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
        </Card>
      </MDBox>
    </BasicLayout>
  );
}

export default CustomerLogin;
