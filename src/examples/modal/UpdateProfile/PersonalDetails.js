import { Autocomplete, Grid, Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAdminProfileThunk } from "redux/Thunks/SuperAdmin";
import { openSnackbar } from "redux/Slice/Notification";
import ModalTitle from "examples/NewDesign/ModalTitle";
import Constants, { Icons, defaultData, ModalContent, FormFields } from "utils/Constants";
import PhoneInput from "react-phone-input-2";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import MDInput from "components/MDInput";
import countries from "countries-list";
import Validations from "utils/Validations/index";

const countryList = Object.values(countries.countries).map((country) => country.name);
function personaldetails({ openPersonal, setOpenPersonal, title, data, pdata, update, setUpdate }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    country: "",
    motherLanguage: "",
  });
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const mongooseId = "_id";
  let phoneNumber;
  if (title === ModalContent.UPDATE_ADMIN) {
    phoneNumber = data?.contactNumber?.number
      ? `${data?.contactNumber?.in}${data?.contactNumber?.number}`
      : data?.contactNumber;
  } else if (pdata[0]?.contactNumber?.in && pdata[0]?.contactNumber?.number) {
    phoneNumber = `${pdata[0]?.contactNumber?.in}${pdata[0]?.contactNumber?.number}`;
  } else {
    phoneNumber = pdata[0]?.contactNumber;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
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
  useEffect(() => {
    if (
      (title !== ModalContent.UPDATE_ADMIN && pdata?.length !== 0) ||
      (data && data.length !== 0)
    ) {
      const checkValue = title !== ModalContent.UPDATE_ADMIN ? pdata[0] : data;
      setInitialData(checkValue);

      setValues((prevValues) => ({
        ...prevValues,
        firstName: checkValue?.firstName || prevValues.firstName,
        lastName: checkValue?.lastName || prevValues.lastName,
        email: checkValue?.email || prevValues.email,
        contactNumber: checkValue?.contactNumber || prevValues.contactNumber,
        address: checkValue?.address || prevValues.address,
        country: checkValue?.country || prevValues.country,
        motherLanguage: checkValue?.motherLanguage || prevValues.motherLanguage,
      }));
    }
  }, [pdata, data]);
  const validation = () => {
    const tempError = {};
    const emailValidate = Validations.validate("email", values.email, null, null, false);
    if (Object.keys(values).length === 0) {
      tempError.allFields = "Required";
    } else {
      if (!values.firstName) {
        tempError.firstName = "First name is required";
      }
      if (!values.lastName) {
        tempError.lastName = "Last name is required";
      }
      if (!values.email) {
        tempError.email = "Email is required";
      } else if (emailValidate) {
        tempError.email = Constants.EMAIL_NOT_VALID;
      }
      if (
        (title !== ModalContent.UPDATE_ADMIN &&
          pdata[0]?.role.title.toLowerCase() === defaultData.ADMIN_ROLE) ||
        (data && data?.role.title.toLowerCase() === defaultData.ADMIN_ROLE)
      ) {
        if (!values.address) {
          tempError.address = "Address is required";
        }
        if (!values.country) {
          tempError.country = "Country is required";
        }
        if (!values.motherLanguage) {
          tempError.motherLanguage = "Language is required";
        }
      }
    }

    const isValid = Object.keys(tempError).length === 0;

    setErrors(tempError);

    return isValid;
  };

  const handleClosePersonal = () => {
    setErrors({});
    setOpenPersonal(false);
    setValues(initialData);
  };
  const handleUpdate = async () => {
    setLoading(true);
    const val = validation();
    if (val) {
      const updatedValues = {};

      if (pdata?.length !== 0 || data?.length !== 0) {
        const checkValue = title !== ModalContent.UPDATE_ADMIN ? pdata[0] : data;
        if (checkValue.firstName !== values.firstName) {
          updatedValues.firstName = values.firstName;
        }
        if (checkValue.lastName !== values.lastName) {
          updatedValues.lastName = values.lastName;
        }
        if (checkValue.email !== values.email) {
          updatedValues.email = values.email;
        }
        if (checkValue.contactNumber !== values.contactNumber) {
          updatedValues.contactNumber = values.contactNumber;
        }
        if (checkValue.address !== values.address) {
          updatedValues.address = values.address;
        }
        if (checkValue.country !== values.country) {
          updatedValues.country = values.country;
        }
        if (checkValue.motherLanguage !== values.motherLanguage) {
          updatedValues.motherLanguage = values.motherLanguage;
        }
      }

      const b = {
        body: updatedValues,
        id: title === ModalContent.UPDATE_ADMIN ? data[mongooseId] : pdata[0][mongooseId],
      };

      const res = await dispatch(updateAdminProfileThunk(b));

      if (res.payload.status === 200) {
        handleClosePersonal();
        await dispatch(
          openSnackbar({
            message: Constants.PROFILE_UPDATED_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setUpdate(!update);
      } else if (res.payload.status === 422) {
        const newErrors = Object.assign({}, ...res.payload.data.data.error);
        setErrors(newErrors);
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      open={openPersonal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox
          bgColor="info"
          p={3}
          textAlign="center"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="lg"
          sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
        >
          <ModalTitle title={title} color="white" />
          <Icon
            sx={{ cursor: "pointer", color: "beige" }}
            fontSize="medium"
            onClick={handleClosePersonal}
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
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                First Name*
              </MDTypography>
              <MDInput
                sx={{
                  marginBottom: 1,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                name="firstName"
                placeholder="First Name"
                value={values.firstName}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                onChange={handleChange}
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
                  marginBottom: 1,
                  "& input": {
                    fontSize: "16px",
                    color: "#667085",
                  },
                }}
                name="lastName"
                placeholder="Last Name"
                value={values.lastName}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                onChange={handleChange}
                fullWidth
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "#FF2E2E" },
                }}
              />
            </Grid>
            {(title === ModalContent.UPDATE_ADMIN ||
              pdata[0]?.role.title.toLowerCase() === defaultData.ADMIN_ROLE) && (
              <>
                <Grid item xs={6}>
                  <MDTypography
                    variant="caption"
                    sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                  >
                    Country*
                  </MDTypography>
                  <Autocomplete
                    options={countryList}
                    name="country"
                    id="country"
                    value={values.country}
                    variant="standard"
                    sx={{
                      mb: 1,
                      "& .MuiAutocomplete-inputRoot": {
                        padding: "4px",
                      },
                    }}
                    freeSolo
                    popupIcon={Icons.DROPDOWN}
                    onChange={(e, value) => handleChange({ target: { name: "country", value } })}
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        name="country"
                        value={values.country}
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter Country Name"
                        error={Boolean(errors.country)}
                        helperText={errors.country}
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
                    sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                  >
                    Language*
                  </MDTypography>
                  <Autocomplete
                    options={["English", "Spanish", "Dutch", "French", FormFields.NOT_APPLICABLE]}
                    name="motherLanguage"
                    id="motherLanguage"
                    variant="standard"
                    sx={{
                      mb: 1,
                      "& .MuiAutocomplete-inputRoot": {
                        padding: "4px",
                      },
                    }}
                    freeSolo
                    popupIcon={Icons.DROPDOWN}
                    onChange={(e, value) =>
                      handleChange({ target: { name: "motherLanguage", value } })
                    }
                    value={values.motherLanguage}
                    error={Boolean(errors.motherLanguage)}
                    helperText={errors.motherLanguage}
                    renderInput={(params) => (
                      <MDInput
                        {...params}
                        name="motherLanguage"
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter Language Name"
                        value={values.motherLanguage}
                        error={Boolean(errors.motherLanguage)}
                        helperText={errors.motherLanguage}
                        FormHelperTextProps={{
                          sx: { marginLeft: 0, color: "#FF2E2E" },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MDTypography
                    variant="caption"
                    sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                  >
                    Address*
                  </MDTypography>
                  <MDInput
                    sx={{
                      mb: 1,
                      "& .MuiInputBase-input": {
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#667085",
                      },
                    }}
                    multiline
                    autoComplete="off"
                    inputProps={{
                      style: { textTransform: "capitalize", flex: "1", minHeight: "4em" },
                    }}
                    name="address"
                    value={values.address}
                    error={Boolean(errors.address)}
                    helperText={errors.address}
                    FormHelperTextProps={{
                      sx: { marginLeft: 0, color: "#FF2E2E" },
                    }}
                    onChange={handleChange}
                    placeholder="Please Enter Address"
                    fullWidth
                  />
                </Grid>
              </>
            )}
            {(title === ModalContent.UPDATE_ADMIN ||
              pdata[0]?.role.title.toLowerCase() !== defaultData.ADMIN_ROLE) && (
              <Grid item xs={6}>
                <MDTypography
                  variant="caption"
                  mb={1}
                  sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                >
                  Email*
                </MDTypography>
                <MDInput
                  sx={{
                    marginBottom: 1,
                    "& input": {
                      fontSize: "16px",
                      color: "#667085",
                    },
                  }}
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  onChange={handleChange}
                  fullWidth
                  FormHelperTextProps={{
                    sx: { marginLeft: 0, color: "#FF2E2E" },
                  }}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <MDTypography
                variant="caption"
                mb={1}
                sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
              >
                Contact Number*
              </MDTypography>
              <PhoneInput
                country="us"
                value={
                  phoneNumber && typeof phoneNumber === "string"
                    ? phoneNumber.replace(/\D/g, "")
                    : ""
                }
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
          </Grid>
        </MDBox>
        <MDBox px={2} mb={2} mr={1}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item xs={0}>
              <MDButton
                variant="contained"
                color="info"
                onClick={handleUpdate}
                style={{ boxShadow: "none", textTransform: "none" }}
              >
                {loading ? "Loading..." : "Update"}
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default personaldetails;
