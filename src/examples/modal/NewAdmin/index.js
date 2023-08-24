import {
  CircularProgress,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  IconButton,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import style from "assets/style/Modal";
import imageStyle from "assets/style/imageUpload";
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateClientThunk } from "redux/Thunks/SuperAdmin";
import uploadImageThunk from "redux/Thunks/ImageUpload";
import { openSnackbar } from "redux/Slice/Notification";
import License from "examples/modal/NewAdmin/License/License";
import ModalTitle from "examples/NewDesign/ModalTitle";
import Validations from "utils/Validations/index";
import Constants, { Icons } from "utils/Constants";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countries from "countries-list";

const countryList = Object.values(countries.countries).map((country) => country.name);

function index({ open, handleClose, fetchClientList }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nationality: "",
    companyName: "",
    companyLogo: "",
    address: "",
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

  const [errors, setErrors] = useState({});
  const [Licenses, setLicense] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const licenseList = useSelector((state) => state.License.allLicense);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  const dispatch = useDispatch();

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

  const handleImageGenerateUrl = async (files, status) => {
    if (status === "removed") {
      setUploadedImage("");
      return;
    }
    const type = "companyLogo";
    const res = await dispatch(uploadImageThunk({ file: files.file, type }));
    setUploadedImage(res.payload.data.iconUrl);
  };

  const validate = () => {
    const emailValidate = Validations.validate("email", values.email, null, null, false);
    const passwordValidate = Validations.validate("basic2", values.password, 6, 30, true);
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

    if (!values.companyName) {
      newErrors.companyName = "Company name is required";
    } else if (values.companyName.trim() === "") {
      newErrors.companyName = Constants.INVALID_SPACE;
    }

    if (!uploadedImage) {
      newErrors.logo = "Company Logo is required";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (passwordValidate) {
      newErrors.password = passwordValidate;
    }

    if (!values.nationality) {
      newErrors.nationality = "Nationality is required";
    }

    if (!Licenses.length > 0) {
      newErrors.AccountLicence = "At least 1 license is required";
    }
    if (!values.address) {
      newErrors.address = "Address is required";
    } else if (values.address.trim() === "") {
      newErrors.address = Constants.INVALID_SPACE;
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
    // const tempValues = {
    //   email: "",
    //   password: "",
    //   firstName: "",
    //   lastName: "",
    //   nationality: countryList[0],
    //   companyName: "",
    //   companyLogo: "",
    //   address: "",
    //   contactNumber: {
    //     number: "",
    //     code: "",
    //     in: "",
    //   },
    //   emergencyContactNumber: {
    //     number: "",
    //     code: "",
    //     in: "",
    //   },
    // };

    // setValues(tempValues);
    setErrors("");
    handleClose();
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const val = validate();
    if (val) {
      setIsSubmitting(true);
      const body = {
        name: values.companyName.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        contactNumber: values.contactNumber,
        emergencyContactNumber: values.emergencyContactNumber,
        password: values.password,
        logo: uploadedImage,
        AccountLicence: Licenses,
        nationality: values.nationality,
      };
      setIsSubmitting(false);
      const res = await dispatch(CreateClientThunk(body));
      if (res.payload.status === 200) {
        handleResetModal();
        dispatch(openSnackbar({ message: res.payload.data.message, notificationType: "success" }));
        fetchClientList();
      } else if (res.payload.status === 422) {
        const newErrors = Object.assign({}, ...res.payload.data.data.error);
        setErrors(newErrors);
      } else if (res.payload.status === 401) {
        const temp = {};
        temp.email = Constants.EMAIL_EXIST;
        setErrors(temp);
      } else if (res.payload.status === 400) {
        const temp = {};
        temp.companyName = Constants.Company_EXIST;
        setErrors(temp);
      }
    }
    setLoading(false);
  };
  return (
    <MDBox>
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
            <ModalTitle title="New Company" color="white" />
            <Icon
              sx={{ cursor: "pointer", color: "beige" }}
              fontSize="medium"
              onClick={handleResetModal}
            >
              {Icons.CROSS}
            </Icon>
          </MDBox>
          {licenseList.length > 0 ? (
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              px={3}
              py={2}
              sx={{
                maxHeight: 500,
                overflowY: "scroll",
                "::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              <TextField
                sx={{ marginBottom: 2 }}
                name="firstName"
                label="First Name*"
                value={values.firstName}
                onChange={handleChange}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              />
              <TextField
                sx={{ marginBottom: 2 }}
                name="lastName"
                label="Last Name*"
                value={values.lastName}
                onChange={handleChange}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              />
              <TextField
                sx={{ marginBottom: 2 }}
                name="email"
                label="Email*"
                value={values.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              />
              <TextField
                sx={{ marginBottom: 2 }}
                name="password"
                label="Password*"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                margin="normal"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPasswordClick}>
                        {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              />
              <FormControl
                variant="outlined"
                fullWidth
                error={Boolean(errors.nationality)}
                sx={{ marginTop: 2 }}
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              >
                <InputLabel id="nationality-label">Nationality*</InputLabel>
                <Select
                  name="nationality"
                  labelId="nationality"
                  id="nationality-select"
                  value={values.nationality}
                  onChange={handleChange}
                  sx={{
                    color: "black",
                    backgroundColor: "black",
                    paddingY: "0.65rem",
                    maxHeight: 100,
                    marginBottom: 2,
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        height: 200,
                        width: 635,
                        opacity: 1,
                        transform: "none",
                        top: 183,
                        left: 442,
                      },
                    },
                  }}
                >
                  {countryList.map((item) => (
                    <MenuItem value={item} id={item} key={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ marginLeft: 0 }}>{errors.nationality}</FormHelperText>
              </FormControl>
              <TextField
                sx={{ marginBottom: 2 }}
                name="companyName"
                label="Company Name*"
                value={values.companyName}
                onChange={handleChange}
                error={Boolean(errors.companyName)}
                helperText={errors.companyName}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              />
              <MDBox>
                <MDTypography variant="caption" ml={0}>
                  Company Logo*
                </MDTypography>
                <Dropzone
                  classNames={imageStyle}
                  maxFiles={1}
                  name="companyLogo"
                  onChangeStatus={handleImageGenerateUrl}
                  uploadedImage={uploadedImage}
                  fullWidth
                  accept="image/*"
                />
                <MDTypography variant="caption" color="error" sx={{ marginTop: 2 }}>
                  {errors?.logo}
                </MDTypography>
              </MDBox>
              <License licenseList={licenseList} Licenses={Licenses} setLicense={setLicense} />

              <MDTypography variant="caption" color="error">
                {errors?.AccountLicence}
              </MDTypography>

              <TextField
                sx={{ marginBottom: 2 }}
                name="address"
                multiline
                label="Address*"
                rows={3}
                value={values.address}
                onChange={handleChange}
                error={Boolean(errors.address)}
                helperText={errors.address}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0 },
                }}
              />
              <MDBox display="flex" flexWrap="wrap" justifyContent="space-between">
                <MDBox>
                  <MDTypography variant="caption" ml={0}>
                    Contact Number*
                  </MDTypography>
                  <PhoneInput
                    country="us"
                    value={values.contactNumber.in + values.contactNumber.number}
                    onChange={(num, country) =>
                      handlePhoneNumberChange(num, country, "contactNumber")
                    }
                    style={{ width: "100%" }}
                  />
                  <MDTypography variant="caption" color="error" sx={{ marginTop: 2 }}>
                    {errors?.contactNumber}
                  </MDTypography>
                </MDBox>
                <MDBox>
                  <MDTypography variant="caption" ml={0}>
                    Emergency Contact number*
                  </MDTypography>
                  <PhoneInput
                    country="us"
                    value={values.emergencyContactNumber.in + values.emergencyContactNumber.number}
                    onChange={(num, country) =>
                      handlePhoneNumberChange(num, country, "emergencyContactNumber")
                    }
                    style={{ width: "100%" }}
                  />
                  <MDTypography variant="caption" color="error" sx={{ marginTop: 2 }}>
                    {errors?.emergencyContactNumber}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox py={5} display="flex" justifyContent="center" alignItems="center">
              <CircularProgress color="info" />
            </MDBox>
          )}
          <MDBox px={0} mb={2} ml={2}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center">
              <Grid item xs={2}>
                <MDButton
                  variant="contained"
                  color={isSubmitting ? "secondary" : "info"}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  style={{ textTransform: "none", boxShadow: "none" }}
                >
                  {loading ? "Loading..." : "Submit"}
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Modal>
    </MDBox>
  );
}

export default index;
