import React, { useEffect, useState } from "react";

// Material Components
import { Divider, Grid, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import pxToRem from "assets/theme/functions/pxToRem";
import { styled } from "@mui/material/styles";

// Custom components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import PageTitle from "examples/NewDesign/PageTitle";
import FTextField from "components/Form/FTextField";
import ImageUpload from "components/ImageUpload/imageUpload";
import FDropdown, { FormDropdownModal } from "components/Dropdown/FDropdown";

// Utils
import Constants, { PageTitles, FeatureTags, countryList, ButtonTitles } from "utils/Constants";
import Validator from "utils/Validations";

// Material Dashboard 2 React helper functions
import { useDispatch } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import createWarehouseThunk, { warehouseUpdateThunk } from "redux/Thunks/Warehouse";

// 3rd party lib
import PhoneInput from "react-phone-input-2";
import { Feature } from "flagged";
import { useLocation, useNavigate } from "react-router-dom";

const StyledMDBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),

  borderRadius: theme.spacing(1),
  border: "1px solid #E0E6F5",
  background: "var(--base-white, #FFF)",

  /* Shadow/sm */
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",

  padding: theme.spacing(`${pxToRem(30)} ${pxToRem(200)}`), // Default padding for all breakpoints
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(100)}`), // Adjust padding for small screens and below
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(50)}`), // Adjust padding for small screens and below
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(0)}`), // Adjust padding for extra-small screens
  },
}));

function index() {
  const Countrys = countryList.map((name) =>
    FormDropdownModal(name.toLowerCase().replace(" ", "_"), name)
  );
  const [warehouseBody, setWarehouseBody] = useState({
    warehouseName: "",
    country: "",
    state: "",
    city: "",
    street: "",
    zipCode: "",
    contactNumber: {
      number: "",
      code: "",
      in: "",
    },
    email: "",
    image: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  // use to check the form is used for update or create
  const [updateWarehouse, setUpdateWarehouse] = useState(false);
  const [enableUpdateButton, setEnableUpdateButton] = useState(false);
  const [warehouseErrors, setWarehouseErrors] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const warehouse = location?.state?.warehouse || {};
    // if the length of keys is greater than 0 then load it in wareouse body
    if (Object.keys(warehouse).length > 0) {
      setUpdateWarehouse(true);
      setWarehouseBody({
        id: warehouse?.[Constants.MONGOOSE_ID] || "",
        warehouseName: warehouse?.name || "",
        country: warehouse?.country.toLowerCase().replace(" ", "_") || "",
        state: warehouse?.state || "",
        city: warehouse?.city || "",
        street: warehouse?.street || "",
        zipCode: warehouse?.zipCode || "",
        contactNumber: warehouse?.contactNumber || {
          number: "",
          code: "",
          in: "",
        },
        email: warehouse?.email || "",
        image: warehouse?.image || "",
        status: warehouse?.isActive.toString() || "",
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouseBody({
      ...warehouseBody,
      [name]: value,
    });
    if (updateWarehouse) setEnableUpdateButton(true);
  };

  const handlePhoneNumberChange = (num, country, type) => {
    setWarehouseBody({
      ...warehouseBody,
      [type]: {
        number: num.split(country.dialCode)[1],
        code: country.countryCode.toUpperCase(),
        in: `+${country.dialCode}`,
      },
    });
    if (updateWarehouse) setEnableUpdateButton(true);
  };

  const warehouseValidation = () => {
    const {
      warehouseName,
      country,
      state,
      city,
      street,
      zipCode,
      contactNumber,
      email,
      image,
      status,
    } = warehouseBody;
    const errors = {};
    const warehouseNameError = Validator.validate("basic", warehouseName);
    const countryError = Validator.validate("basic", country);
    const stateError = Validator.validate("basic", state);
    const cityError = Validator.validate("basic", city);
    const streetError = Validator.validate("basic2", street);
    const zipCodeError = Validator.validate("basic2", zipCode);
    const contactNumberError = Validator.validate("basic2", contactNumber.number);
    const contactNumberCode = Validator.validate("basic2", contactNumber.code);
    const contactNumberIn = Validator.validate("basic2", contactNumber.in);
    const warehouseEmailError = Validator.validate("basic", email);
    const imageError = Validator.validate("basic", image);
    const statusError = Validator.validate("basic", status.toString());

    if (warehouseNameError !== "") errors.warehouseName = warehouseNameError;
    if (countryError !== "") errors.country = countryError;
    if (stateError !== "") errors.state = stateError;
    if (cityError !== "") errors.city = cityError;
    if (streetError !== "") errors.street = streetError;
    if (zipCodeError !== "") errors.zipCode = zipCodeError;
    if (contactNumberError !== "") errors.contactNumber = contactNumberError;
    if (contactNumberCode !== "") errors.contactNumber = contactNumberCode;
    if (contactNumberIn !== "") errors.contactNumber = contactNumberIn;
    if (warehouseEmailError !== "") errors.email = warehouseEmailError;
    if (imageError !== "") errors.image = imageError;
    if (statusError !== "") errors.status = statusError;

    setWarehouseErrors(errors);
    return Object.values(errors).filter((val) => val !== "").length === 0;
  };

  const handleResetModal = () => {
    setWarehouseBody({
      warehouseName: "",
      country: "",
      state: "",
      city: "",
      street: "",
      zipCode: "",
      contactNumber: {
        number: "",
        code: "",
        in: "+1",
      },
      email: "",
      image: "",
      status: "",
    });
    setWarehouseErrors({});
  };

  // Redirect to previous page and Works only on update warehouse
  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageChange = (name, imageValues) => {
    setWarehouseBody({
      ...warehouseBody,
      [name]: imageValues?.[0]?.url || "",
    });
    if (updateWarehouse) setEnableUpdateButton(true);
  };

  const handleImageCancel = (fieldName) => {
    setWarehouseBody({
      ...warehouseBody,
      [fieldName]: "",
    });
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (warehouseValidation()) {
      setLoading(true);
      const body = {
        name: warehouseBody.warehouseName,
        country: warehouseBody.country.toUpperCase().replace("_", " "),
        state: warehouseBody.state,
        city: warehouseBody.city,
        street: warehouseBody.street,
        zipCode: warehouseBody.zipCode,
        contactNumber: warehouseBody.contactNumber,
        email: warehouseBody.email,
        image: warehouseBody.image,
        isActive: warehouseBody.status,
      };

      const res = await dispatch(
        updateWarehouse
          ? warehouseUpdateThunk({ id: warehouseBody.id, body })
          : createWarehouseThunk(body)
      );
      if (res.payload.status === 200) {
        await dispatch(
          openSnackbar({
            message: updateWarehouse
              ? Constants.WAREHOUSE_UPDATE_SUCCESS
              : Constants.WAREHOUSE_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        handleResetModal();
        if (updateWarehouse) {
          navigate("/client/setting/warehouse");
        }
      } else if (res.payload.status === 422) {
        const errors = res.payload.data.data.error;
        let tempError = {};
        errors.forEach((item) => {
          tempError = { ...tempError, ...item };
        });
        setWarehouseErrors(tempError);
      } else {
        await dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
        handleResetModal();
      }
      setLoading(false);
    }
  };

  return (
    <DashboardLayout xPadding={0}>
      <MDBox px={3}>
        <DashboardNavbar />
        <PageTitle
          title={updateWarehouse ? PageTitles.EDIT_WAREHOUSE : PageTitles.ADD_NEW_WAREHOUSE}
        />
        <Divider sx={{ marginTop: 2 }} />
      </MDBox>
      <Feature name={FeatureTags.WAREHOUSE}>
        <MDBox px={3}>
          <StyledMDBox>
            <MDBox
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: pxToRem(16),
              }}
            >
              <MDTypography
                sx={{
                  color: "#667085",
                  fontFamily: "Inter",
                  fontSize: 24,
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: pxToRem(16),
                }}
              >
                Warehouse information
              </MDTypography>
              <MDBox
                sx={{
                  width: "100%",
                  gap: pxToRem(16),
                }}
              >
                <Grid container spacing={2}>
                  <Grid item lg={12} sm={12}>
                    <FTextField
                      label="Warehouse*"
                      placeholder="Warehouse"
                      name="warehouseName"
                      id="warehouseName"
                      type="text"
                      width="100%"
                      error={Boolean(warehouseErrors?.warehouseName)}
                      helperText={warehouseErrors?.warehouseName}
                      value={warehouseBody?.warehouseName}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item lg={8} sm={12}>
                    <FTextField
                      label="Street*"
                      placeholder="Street"
                      name="street"
                      id="street"
                      type="text"
                      width="100%"
                      error={Boolean(warehouseErrors?.street)}
                      helperText={warehouseErrors?.street}
                      value={warehouseBody.street}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item lg={4} sm={12}>
                    <FTextField
                      label="City*"
                      placeholder="City"
                      name="city"
                      id="city"
                      type="text"
                      width="100%"
                      error={Boolean(warehouseErrors?.city)}
                      helperText={warehouseErrors?.city}
                      value={warehouseBody.city}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item lg={4} sm={12}>
                    <FTextField
                      label="Sate/province/area*"
                      placeholder="state/province/area"
                      name="state"
                      id="state"
                      type="text"
                      width="100%"
                      error={Boolean(warehouseErrors?.state)}
                      helperText={warehouseErrors?.state}
                      value={warehouseBody.state}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item lg={4} sm={12}>
                    <FTextField
                      label="Zip Code*"
                      placeholder="Zip Code"
                      name="zipCode"
                      id="zipCode"
                      width="100%"
                      error={Boolean(warehouseErrors?.zipCode)}
                      helperText={warehouseErrors?.zipCode}
                      value={warehouseBody.zipCode}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item lg={4} sm={12}>
                    <FDropdown
                      label="Country*"
                      menu={Countrys}
                      value={warehouseBody.country}
                      name="country"
                      id="country"
                      handleChange={(name, value, id) =>
                        handleChange({ target: { name, value, id } })
                      }
                      error={Boolean(warehouseErrors?.country)}
                      helperText={warehouseErrors?.country}
                    />
                  </Grid>

                  <Grid item lg={4} sm={12}>
                    <MDTypography variant="caption" ml={0}>
                      Phone Number*
                    </MDTypography>
                    <PhoneInput
                      country="us"
                      value={warehouseBody.contactNumber.in + warehouseBody.contactNumber.number}
                      onChange={(num, country) =>
                        handlePhoneNumberChange(num, country, "contactNumber")
                      }
                      inputStyle={{
                        width: "100%",
                        height: "46px",
                      }}
                      containerStyle={{
                        border: !warehouseErrors?.contactNumber
                          ? "1px solid #C4C4C4"
                          : "1px solid red",
                        borderRadius: "5px",
                      }}
                    />
                    <MDTypography variant="caption" color="error" sx={{ marginTop: 2 }}>
                      {warehouseErrors?.contactNumber}
                    </MDTypography>
                  </Grid>
                  <Grid item lg={4} sm={12}>
                    <FTextField
                      label="Email*"
                      placeholder="Email"
                      name="warehouseEmail"
                      id="warehouseEmail"
                      type="text"
                      width="100%"
                      error={Boolean(warehouseErrors?.email)}
                      helperText={warehouseErrors?.email}
                      value={warehouseBody.email}
                      handleChange={(e) =>
                        handleChange({ target: { name: "email", value: e.target.value } })
                      }
                    />
                  </Grid>
                  <Grid item lg={4} sm={12}>
                    <FDropdown
                      label="Status*"
                      menu={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                      ].map(({ label, value }) => FormDropdownModal(value, label))}
                      value={warehouseBody?.status}
                      name="status"
                      handleChange={(name, value, id) =>
                        handleChange({ target: { name, value, id } })
                      }
                      error={Boolean(warehouseErrors?.status)}
                      helperText={warehouseErrors?.status}
                    />
                  </Grid>
                  <Grid item lg={12} sm={12}>
                    <ImageUpload
                      label="Photo (400X500)"
                      name="photo"
                      onImageUpload={(imageValues) => handleImageChange("image", imageValues)}
                      onImageCancel={(updatedImageUrl) =>
                        handleImageCancel("image", updatedImageUrl)
                      }
                      data={[
                        warehouseBody?.image && {
                          name: "",
                          url: warehouseBody?.image,
                          size: 0,
                        },
                      ]}
                      type="EquipmentDocument"
                      formats={["image/jpeg", "image/jpg", "image/png"]}
                      acceptType="image/*"
                      maxImageCount={1}
                      error={Boolean(warehouseErrors?.image)}
                      helperText={warehouseErrors?.image}
                      resetComponent={warehouseBody?.image === ""}
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </StyledMDBox>

          <MDBox
            sx={{
              marginTop: 3,
              backgroundColor: "#fff",
              height: "71px",
              padding: "12px 32px 16px 32px",
              border: "1px solid #E0E6F5",
            }}
          >
            <MDBox sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {updateWarehouse && (
                <MDButton
                  variant="outlined"
                  color="info"
                  style={{ textTransform: "none", boxShadow: "none" }}
                  sx={{ marginRight: "16px" }}
                  onClick={handleCancel}
                >
                  {ButtonTitles.CANCEL}
                </MDButton>
              )}
              <MDButton
                variant="contained"
                color="info"
                style={{ textTransform: "none", boxShadow: "none" }}
                onClick={handleAction}
                disabled={updateWarehouse ? !enableUpdateButton : false}
              >
                {(!loading && !updateWarehouse && ButtonTitles.SUBMIT) ||
                  (loading && !updateWarehouse && ButtonTitles.SUBMIT_LOADING) ||
                  (!loading && updateWarehouse && ButtonTitles.UPDATE) ||
                  (loading && updateWarehouse && ButtonTitles.UPDATE_LOADING)}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Feature>
    </DashboardLayout>
  );
}

export default index;
