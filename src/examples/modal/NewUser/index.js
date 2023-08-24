import { Modal, Grid, Icon, InputAdornment, IconButton, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ModalTitle from "examples/NewDesign/ModalTitle";
import Validations from "utils/Validations/index";
import Constants, { Icons } from "utils/Constants";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch } from "react-redux";
import { CreateNewUser } from "redux/Thunks/UserManagement";
import RoleListThunk from "redux/Thunks/Role";
import { openSnackbar } from "redux/Slice/Notification";
import MDTypography from "components/MDTypography";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import pxToRem from "assets/theme/functions/pxToRem";
import MDInput from "components/MDInput";

function newUser({ open, handleClose, handleFilter }) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    contactNumber: {
      number: "",
      code: "",
      in: "",
    },
    emergencyContactNumber: {
      number: "",
      code: "",
      in: "",
    },
  });
  const [roleOptions, setRoleOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    (async () => {
      const res = await dispatch(RoleListThunk());
      setRoleOptions(res.payload.data.data);
    })();
  }, []);
  const validate = () => {
    const emailValidate = Validations.validate("email", values.email, null, null, false);
    const passwordValidate = Validations.validate("password", values.password, 6, 30, true);

    const newErrors = {};

    if (!values) {
      return false;
    }

    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (emailValidate) {
      newErrors.email = Constants.EMAIL_NOT_VALID;
    }

    if (!values.firstName) {
      newErrors.firstName = "First name is required";
    } else if (values.firstName.trim() === "") {
      newErrors.firstName = Constants.INVALID_SPACE;
    }

    if (!values.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (values.lastName.trim() === "") {
      newErrors.lastName = Constants.INVALID_SPACE;
    }

    if (!values.role) {
      newErrors.role = "Role name is required";
    } else if (values.role.trim() === "") {
      newErrors.role = Constants.INVALID_SPACE;
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (passwordValidate) {
      newErrors.password = passwordValidate;
    }

    if (values.contactNumber.number === "") {
      newErrors.contactNumber = "Contact number is required";
    }

    if (values.emergencyContactNumber.number === "") {
      newErrors.emergencyContactNumber = "Emergency Contact number is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).filter((val) => val !== "").length === 0;
  };
  const handleResetModal = () => {
    setErrors({});
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNumber: {
        number: "",
        code: "",
        in: "",
      },
      emergencyContactNumber: {
        number: "",
        code: "",
        in: "",
      },
    });
    handleClose();
  };

  const handleChange = (e) => {
    if (e.target.value !== "") {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    } else {
      const tempValue = { ...values };
      delete tempValue[e.target.name];
      setValues(tempValue);
    }
  };

  const handlePhoneNumberChange = (num, country, type) => {
    setValues({
      ...values,
      [type]: {
        number: num.split(country.dialCode)[1],
        code: country.countryCode.toUpperCase(),
        in: `+${country.dialCode}`,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const val = validate();
    if (val) {
      const body = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email,
        password: values.password,
        contactNumber: values.contactNumber,
        emergencyContactNumber: values.emergencyContactNumber,
        role: values.role.trim(),
      };
      const res = await dispatch(CreateNewUser(body));
      if (res.payload.status === 200) {
        handleResetModal();
        dispatch(openSnackbar({ message: res.payload.data.message, notificationType: "success" }));
        handleFilter();
      } else if (res.payload.status === 401) {
        const temp = { ...errors };
        temp.email = Constants.EMAIL_EXIST;
        setErrors(temp);
      } else if (res.payload.status === 422) {
        const newErrors = {};
        // add key pair of error into newErrors
        res.payload.data.data.error.forEach((error) => {
          Object.keys(error).forEach((key) => {
            newErrors[key] = error[key];
          });
        });
        setErrors(newErrors);
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox
          bgColor="info"
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="lg"
          sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
        >
          <ModalTitle title="New User" color="white" />
          <Icon
            sx={{ cursor: "pointer", color: "beige" }}
            fontSize="medium"
            onClick={handleResetModal}
          >
            {Icons.CROSS}
          </Icon>
        </MDBox>
        <MDBox
          display="flex"
          flexWrap="wrap"
          px={3}
          py={2}
          sx={{
            maxHeight: 500,
            overflowY: "scroll",
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDTypography
                variant="caption"
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                Role Name*
              </MDTypography>
              <Autocomplete
                displayEmpty
                options={roleOptions.filter(
                  (element) => element?.title !== "admin" && element?.title !== "superadmin"
                )}
                getOptionLabel={(option) => option.title || ""}
                name="role"
                id="role"
                variant="standard"
                sx={{
                  "& .MuiAutocomplete-inputRoot": {
                    padding: "4px",
                  },
                }}
                popupIcon={<KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />}
                onChange={(e, value) =>
                  handleChange({ target: { name: "role", value: value?.[Constants.MONGOOSE_ID] } })
                }
                renderInput={(params) => (
                  <MDInput
                    {...params}
                    name="role"
                    onChange={(e) => handleChange(e)}
                    placeholder="Enter Role Name*"
                    error={Boolean(errors.role)}
                    helperText={errors.role}
                    FormHelperTextProps={{
                      sx: { marginLeft: 0, color: "#FF2E2E" },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                mb={1}
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                First Name*
              </MDTypography>
              <MDInput
                sx={{
                  marginTop: 0,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                name="firstName"
                placeholder="First Name*"
                value={values.firstName}
                onChange={handleChange}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                Last Name*
              </MDTypography>
              <MDInput
                sx={{
                  marginTop: 0,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                name="lastName"
                placeholder="Last Name*"
                value={values.lastName}
                onChange={handleChange}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                Email*
              </MDTypography>
              <MDInput
                sx={{
                  marginTop: 0,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                name="email"
                placeholder="Email*"
                value={values.email}
                error={Boolean(errors.email)}
                helperText={errors.email}
                onChange={handleChange}
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                Password*
              </MDTypography>
              <MDInput
                sx={{
                  marginTop: 0,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                placeholder="Password*"
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPasswordClick}>
                        {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <MDTypography variant="caption" ml={0}>
                Contact Number*
              </MDTypography>
              <PhoneInput
                country="us"
                value={values.contactNumber.in + values.contactNumber.number}
                onChange={(num, country) => handlePhoneNumberChange(num, country, "contactNumber")}
                inputStyle={{
                  width: "100%",
                  height: "43px",
                }}
              />
              <MDTypography variant="caption" color="error" sx={{ marginTop: 2 }}>
                {errors?.contactNumber}
              </MDTypography>
            </Grid>

            <Grid item xs={6}>
              <MDTypography variant="caption" ml={0}>
                Emergency Contact number*
              </MDTypography>
              <PhoneInput
                country="us"
                value={values.emergencyContactNumber.in + values.emergencyContactNumber.number}
                onChange={(num, country) =>
                  handlePhoneNumberChange(num, country, "emergencyContactNumber")
                }
                inputStyle={{
                  width: "100%",
                  height: "43px",
                }}
              />
              <MDTypography variant="caption" color="error" sx={{ marginTop: 2 }}>
                {errors?.emergencyContactNumber}
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox px={2} mb={2} mr={1} mt={1}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid xs={0}>
              <MDButton
                variant="contained"
                color="info"
                onClick={handleSubmit}
                style={{ boxShadow: "none", textTransform: "none" }}
              >
                {loading ? "Loading..." : "Submit"}
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default newUser;
