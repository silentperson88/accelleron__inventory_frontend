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
import { InputAdornment, IconButton, CircularProgress, InputLabel } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import pxToRem from "assets/theme/functions/pxToRem";
import { useEffect, useState } from "react";

// Logo
import logo from "assets/images/brand.png";

import Constants, { Colors } from "utils/Constants";
import { useDispatch } from "react-redux";
import { ResetPasswordThunk, checkResetTokenThunk } from "redux/Thunks/Authentication";
import { Link, useParams } from "react-router-dom";
import Validations from "utils/Validations/index";
import MDInput from "components/MDInput";

function ResetPassword() {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenExpire, setTokenExpire] = useState(false);
  const [isNewToken, setIsNewToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { id, token } = useParams();
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPasswordClick = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (password.confirmPassword !== "") {
      setError(password.newPassword !== password.confirmPassword);
    }
  }, [password]);
  useEffect(() => {
    (async () => {
      if (token) {
        const res = await dispatch(checkResetTokenThunk(token));
        if (res.payload.status === 200) {
          setIsNewToken(true);
        } else if (res.payload.status === 401) {
          setSuccess(true);
          setTokenExpire(true);
        }
      }
    })();
  }, [token]);

  const handleResetPassword = async () => {
    setLoading(true);
    const passwordValidation = Validations.validate("password", password.newPassword, 6, 30, true);
    if (passwordValidation !== "") {
      setPasswordError(passwordValidation);
    } else {
      const body = {
        id,
        body: { newPassword: password.newPassword, confirmPassword: password.confirmPassword },
      };
      const res = await dispatch(ResetPasswordThunk(body));
      if (res.payload.status === 200) {
        setSuccess(true);
        setTokenExpire(false);
      } else if (res.payload.status === 400) {
        setSuccess(true);
        setTokenExpire(true);
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleResetPassword(event);
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
            <MDBox component="img" src={logo} alt="Brand" width="8rem" marginTop="42px" />
          </MDBox>
          {!success ? (
            <MDBox>
              {!isNewToken ? (
                <MDBox py={5} display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress color="info" />
                </MDBox>
              ) : (
                <MDBox>
                  <MDBox display="flex" alignItems="center" justifyContent="center">
                    <MDTypography
                      sx={{ fontSize: pxToRem(24), fontWeight: 600, color: "#344054" }}
                      mt={2}
                    >
                      Reset Password
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={2} pb={3} px={3} mt={0}>
                    <MDBox component="form" role="form">
                      <MDBox mb={3} ml={5}>
                        <InputLabel
                          sx={{
                            fontSize: pxToRem(16),
                            fontWeight: 600,
                            color: "#344054",
                            marginBottom: 1,
                          }}
                        >
                          New Password
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
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter New Password"
                          onChange={handleChange}
                          name="newPassword"
                          value={password.newPassword}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon fontSize="medium" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleShowPasswordClick}>
                                  {showPassword ? (
                                    <VisibilityOutlinedIcon />
                                  ) : (
                                    <VisibilityOffOutlinedIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          onKeyPress={handleKeyDown}
                        />
                        <MDTypography variant="button" color="error" ml={1}>
                          {passwordError}
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={2} ml={5}>
                        <InputLabel
                          sx={{
                            fontSize: pxToRem(16),
                            fontWeight: 600,
                            color: "#344054",
                            marginBottom: 1,
                          }}
                        >
                          Confirm Password
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
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
                          onChange={handleChange}
                          name="confirmPassword"
                          value={password.confirmPassword}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon fontSize="medium" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleShowConfirmPasswordClick}>
                                  {showConfirmPassword ? (
                                    <VisibilityOutlinedIcon />
                                  ) : (
                                    <VisibilityOffOutlinedIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          onKeyPress={handleKeyDown}
                        />
                        <MDTypography variant="button" color="error" ml={1}>
                          {error ? Constants.PASSWORD_NOT_MATCHED : ""}
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={1} ml={5}>
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
                          onClick={handleResetPassword}
                        >
                          {loading ? "Loading..." : "Change My Password"}
                        </MDButton>
                      </MDBox>
                      <MDBox mt={8} display="flex" justifyContent="center" alignItems="flex-end">
                        <MDTypography
                          variant="caption"
                          sx={{ color: "text", fontSize: pxToRem(12), fontWeight: 400 }}
                          fontWeight="light"
                        >
                          ©2023 Finvibes. All rights reserved.
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
          ) : (
            <MDBox
              mx={3}
              py={2}
              mb={3}
              display="flex"
              justifycontent="center"
              flexDirection="column"
              alignItems="center"
            >
              <MDTypography
                mb={3}
                textAlign="center"
                variant="Subtitle"
                color={tokenExpire ? "error" : "secondary"}
              >
                {tokenExpire
                  ? Constants.PASSWORD_LINK_EXPIRED
                  : Constants.PASSWORD_RESET_SUCCESSFULLY}
              </MDTypography>
              <MDButton
                component={Link}
                to={tokenExpire ? "/authentication/forgot-password" : "/authentication/sign-in"}
                variant="contained"
                color="info"
                fontWeight="medium"
                style={{ boxShadow: "none" }}
              >
                Back to {tokenExpire ? "Forgot Password" : "Login"}
              </MDButton>
            </MDBox>
          )}
        </Card>
      </MDBox>
    </BasicLayout>
  );
}

export default ResetPassword;
