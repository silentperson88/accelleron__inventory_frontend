// Material Dashboard 2 React components
import { Box, Grid, Tab, Tabs, styled } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Data
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import pxToRem from "assets/theme/functions/pxToRem";
import PageTitle from "examples/NewDesign/PageTitle";
import FDropdown from "components/Dropdown/FDropdown";
import AccessDenied from "components/AccessDenied/accessDenied";

import Constants, {
  Icons,
  PageTitles,
  FeatureTags,
  ButtonTitles,
  Colors,
  defaultData,
} from "utils/Constants";
import ProductDocument from "layouts/resources/productDocument";
import ProductWarehouse from "layouts/resources/productWarehouse";
import CustomButton from "examples/NewDesign/CustomButton";
import FTextField from "components/Form/FTextField";
import DateTime from "components/DateTime/DateTime";

// Library
import ReactDatePicker from "react-datepicker";
import moment from "moment";

// Redux
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewProduct, equipmentByIdThunk, equipmentUpdateThunk } from "redux/Thunks/Equipment";
import { equipmentConfig } from "redux/Thunks/Config";

// Icons
import HardwareOutlinedIcon from "@mui/icons-material/HardwareOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";

// feature flag
import { Feature } from "flagged";
import exportImportSampleFileThunk from "redux/Thunks/Other";

const StyledMDBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  minHeight: "800px",
  border: "1px solid #E0E6F5",
  background: "var(--base-white, #FFF)",

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
function configEquipment() {
  const [values, setValues] = useState({});
  const [updateEquipment, setUpdateEquipment] = useState({});
  const [tabvalue, setTabValue] = useState(0);
  const [documentFormFilled, setDocumentFormFilled] = useState(false);
  const [warehouseFormFilled, setWarehouseFormFilled] = useState(false);
  const [equipDocumentData, setEquipDocumentData] = useState({
    errors: {},
  });
  const [warehouseData, setWarehouseData] = useState({
    errors: {},
  });
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.equipmentConfig?.agreement?.create;
  const { checkEquipmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !documentFormFilled) {
      dispatch(
        openSnackbar({
          message: "Please fill in all required fields before proceeding.",
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
      return;
    }
    // If trying to move to the next tab from the second tab, check if the form is filled
    if (newValue === 2 && !warehouseFormFilled) {
      dispatch(
        openSnackbar({
          message: "Please fill in all required fields before proceeding.",
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
      return;
    }
    // Set the new tab value if the conditions are met
    setTabValue(newValue);
  };
  useEffect(() => {
    (async () => {
      await dispatch(equipmentConfig());
    })();
  }, []);
  useEffect(() => {
    if (checkEquipmentId) {
      // Set the form completion status for all tabs to true
      setDocumentFormFilled(true);
      setWarehouseFormFilled(true);
    }
    (async () => {
      if (checkEquipmentId) {
        const temp = { ...values };
        const res = await dispatch(equipmentByIdThunk(checkEquipmentId));
        setUpdateEquipment(res.payload.data.data);
        ConfigData?.equipmentConfig?.properties?.equipment.forEach((val) => {
          if (val.type === "text" || val.type === "number") {
            temp[val.id] = res.payload.data.data?.[val.id];
          }
          if (val.type === "options" && val.parentFieldId === "") {
            temp[val.id] = res.payload.data.data?.[val.id][Constants.MONGOOSE_ID];
          }
        });
        setValues({ ...temp });
      }
    })();
  }, [ConfigData]);
  const validate = () => {
    switch (tabvalue) {
      case 0: {
        const newErrors = {};

        if (ConfigData?.equipmentConfig?.properties?.equipment) {
          ConfigData?.equipmentConfig?.properties?.equipment.forEach((item) => {
            const checkValue =
              item.parentFieldId !== "" ? item.dependentIds.includes(values?.equipmentType) : {};
            const itemValue = values?.[item.id];
            if (item.IsRequired) {
              const dynamicField = values?.dynamicFields?.find(
                (val) => val?.title.replace(/\s/g, "") === item.id
              );
              if (!item.questionId && !itemValue && item.parentFieldId === "") {
                newErrors[item.id] = item.hint;
              } else if (item.questionId && !dynamicField) {
                newErrors[item.id] = item.hint;
              } else if (
                !item.questionId &&
                typeof itemValue === "string" &&
                itemValue.trimStart() === ""
              ) {
                newErrors[item.id] = "Invalid value";
              } else if (
                !item.questionId &&
                item.type === "options" &&
                item.parentFieldId === "" &&
                (!itemValue || itemValue.length === 0)
              ) {
                newErrors[item.id] = item.hint;
              } else if (
                !item.questionId &&
                item.type === "options" &&
                item.parentFieldId !== "" &&
                Object.keys(values).findIndex(
                  (key) => key.toLocaleLowerCase() === item.parentFieldId.toLocaleLowerCase()
                ) === -1
              ) {
                newErrors[item.id] = item.hint;
              } else if (item.questionId && dynamicField?.value[0]?.trimStart() === "") {
                newErrors[item.id] = "Invalid value";
              } else if (!item.questionId && item.type === "number" && itemValue < 0) {
                newErrors[item.id] = "Invalid Value";
              }
            } else if (
              !item.IsRequired &&
              !itemValue &&
              checkValue === true &&
              item.type === "options-values"
            ) {
              newErrors[item.id] = "Total Value Required";
            }
          });
        }

        setErrors(newErrors);
        return Object.values(newErrors).filter((val) => val !== "").length === 0;
      }
      case 1: {
        const newErrors = {};
        if (ConfigData?.equipmentConfig?.properties?.imageSpecificationAndPrice) {
          ConfigData?.equipmentConfig?.properties?.imageSpecificationAndPrice.forEach((item) => {
            if (item.IsRequired) {
              const itemValue = equipDocumentData?.[item.id];
              const dynamicField = equipDocumentData?.dynamicFields?.find(
                (val) => val?.title.replace(/\s/g, "") === item.id
              );

              if (!item.questionId && !itemValue && item.parentFieldId === "") {
                newErrors[item.id] = item.hint;
              } else if (item.questionId && !dynamicField) {
                newErrors[item.id] = item.hint;
              } else if (
                !item.questionId &&
                typeof itemValue === "string" &&
                itemValue.trimStart() === ""
              ) {
                newErrors[item.id] = "Invalid value";
              } else if (
                !item.questionId &&
                item.type === "options" &&
                item.parentFieldId === "" &&
                (!itemValue || itemValue.length === 0)
              ) {
                newErrors[item.id] = item.hint;
              } else if (
                !item.questionId &&
                item.type === "options" &&
                item.parentFieldId !== "" &&
                Object.keys(equipDocumentData).findIndex(
                  (key) => key.toLocaleLowerCase() === item.parentFieldId.toLocaleLowerCase()
                ) === -1
              ) {
                newErrors[item.id] = item.hint;
              } else if (item.questionId && dynamicField?.value[0]?.trimStart() === "") {
                newErrors[item.id] = "Invalid value";
              } else if (!item.questionId && item.type === "number" && itemValue < 0) {
                newErrors[item.id] = "Invalid Value";
              }
            }
          });
        }
        setEquipDocumentData((prevData) => ({
          ...prevData,
          errors: newErrors,
        }));
        return Object.values(newErrors).filter((val) => val !== "").length === 0;
      }
      case 2: {
        const WarehouseError = {};
        if (ConfigData?.equipmentConfig?.properties?.warehouseInfo) {
          ConfigData?.equipmentConfig?.properties?.warehouseInfo.forEach((item) => {
            if (item.IsRequired) {
              const itemValue = warehouseData?.[item.id];
              const dynamicField = warehouseData?.dynamicFields?.find(
                (val) => val?.title.replace(/\s/g, "") === item.id
              );

              if (!item.questionId && !itemValue && item.parentFieldId === "") {
                WarehouseError[item.id] = item.hint;
              } else if (item.questionId && !dynamicField) {
                WarehouseError[item.id] = item.hint;
              } else if (
                !item.questionId &&
                typeof itemValue === "string" &&
                itemValue.trimStart() === ""
              ) {
                WarehouseError[item.id] = "Invalid value";
              } else if (
                !item.questionId &&
                item.type === "options" &&
                item.parentFieldId === "" &&
                (!itemValue || itemValue.length === 0)
              ) {
                WarehouseError[item.id] = item.hint;
              } else if (
                !item.questionId &&
                item.type === "options" &&
                item.parentFieldId !== "" &&
                Object.keys(warehouseData).findIndex(
                  (key) => key.toLocaleLowerCase() === item.parentFieldId.toLocaleLowerCase()
                ) === -1
              ) {
                WarehouseError[item.id] = item.hint;
              } else if (item.questionId && dynamicField?.value[0]?.trimStart() === "") {
                WarehouseError[item.id] = "Invalid value";
              } else if (!item.questionId && item.type === "number" && itemValue < 0) {
                WarehouseError[item.id] = "Invalid Value";
              }
            }
          });
        }
        setWarehouseData((prevData) => ({
          ...prevData,
          errors: WarehouseError,
        }));
        return Object.values(WarehouseError).filter((val) => val !== "").length === 0;
      }
      default:
        return false;
    }
  };
  const requiredList = [
    "name",
    "equipmentNumber",
    "serialNumber",
    "value",
    "weight",
    "equipmentCategory",
    "equipmentType",
    "equipmentForm",
    "hsCode",
  ];

  const handleConfigChange = (name, value, id) => {
    const temp = { ...values };
    if (!requiredList.includes(name)) {
      const index = temp.dynamicFields.findIndex((val) => val.fieldId === id);
      if (index >= 0 && value !== "") {
        temp.dynamicFields[index].value = [value];
      } else if (index >= 0 && value === "") {
        temp.dynamicFields.splice(index, 1);
      } else {
        const dynamicFieldValueObject = {
          title: name,
          value: [value],
          fieldId: id,
        };
        temp.dynamicFields.push(dynamicFieldValueObject);
      }
    } else if (name in temp && value === "") {
      delete temp[name];
    } else {
      temp[name] = value;
    }

    ConfigData?.equipmentConfig?.properties?.equipment?.forEach((item) => {
      if (item.parentFieldId !== "" && !item.dependentIds.includes(temp?.equipmentType)) {
        delete temp?.[item?.id];
      }
    });

    setValues({ ...temp });
  };

  const moveToNextTab = () => {
    if (tabvalue < 2) {
      setTabValue(tabvalue + 1);
    }
  };
  const moveToPreviousTab = () => {
    if (tabvalue > 0) {
      setTabValue(tabvalue - 1);
    }
  };
  const getButtonText = () => {
    if (loading) {
      return ButtonTitles.LOADING;
    }
    if (tabvalue === 2) {
      return checkEquipmentId ? ButtonTitles.UPDATE : ButtonTitles.PUBLISH;
    }
    return checkEquipmentId ? ButtonTitles.UPDATE_AND_CONTINUE : ButtonTitles.SAVE_AND_CONTINUE;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    switch (tabvalue) {
      case 0:
        if (validate()) {
          setDocumentFormFilled(true);
          moveToNextTab();
        }
        break;
      case 1:
        if (validate()) {
          setWarehouseFormFilled(true);
          moveToNextTab();
        }
        break;
      case 2:
        setLoading(true);
        if (validate()) {
          const body = { ...values, ...equipDocumentData, ...warehouseData };

          const tempBody = { ...values, ...equipDocumentData, ...warehouseData };
          Object.entries(tempBody).forEach(([key]) => {
            if (typeof tempBody[key] === "string") {
              tempBody[key] = tempBody[key].trim();
            }
          });
          try {
            if (checkEquipmentId) {
              const data = {
                body,
                id: checkEquipmentId,
              };
              const res = await dispatch(equipmentUpdateThunk(data));
              if (res.payload.status === 200) {
                await dispatch(
                  openSnackbar({
                    message: Constants.EQUIPMENT_UPDATE_SUCCESS,
                    notificationType: Constants.NOTIFICATION_SUCCESS,
                  })
                );
                navigate("/client/products");
              } else {
                dispatch(
                  openSnackbar({
                    message: Constants.SOMETHING_WENT_WRONG,
                    notificationType: Constants.NOTIFICATION_ERROR,
                  })
                );
              }
            } else {
              const res = await dispatch(CreateNewProduct(body));
              if (res.payload.status === 200) {
                await dispatch(
                  openSnackbar({
                    message: Constants.EQUIPMENT_CREATE_SUCCESS,
                    notificationType: Constants.NOTIFICATION_SUCCESS,
                  })
                );
                navigate("/client/products");
              } else {
                dispatch(
                  openSnackbar({
                    message: Constants.SOMETHING_WENT_WRONG,
                    notificationType: Constants.NOTIFICATION_ERROR,
                  })
                );
              }
            }
          } catch (error) {
            dispatch(
              openSnackbar({
                message: Constants.SOMETHING_WENT_WRONG,
                notificationType: Constants.NOTIFICATION_ERROR,
              })
            );
          }
        }
        setLoading(false);
        break;
      default:
        break;
    }
  };
  // Export excel sample file
  const handleEquipmentSampleFileExport = async () => {
    const fileName = process.env.REACT_APP_EQUIPMENT_IMPORT_SAMPLE_FILE_NAME;
    const currentDate = new Date();
    const filename = `reynard_equipment_import_sample_file_${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.${
      fileName.split(".")[1]
    }`;

    const res = await dispatch(exportImportSampleFileThunk(fileName));
    const url = window.URL.createObjectURL(res.payload);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const checkloader = () => {
    if (checkEquipmentId) {
      return Object.keys(values).length > 0;
    }
    return ConfigData?.equipmentConfig?.properties?.equipment?.length > 0;
  };

  return (
    <DashboardLayout xPadding={0}>
      <MDBox px={3}>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="space-between">
          <PageTitle
            title={checkEquipmentId ? PageTitles.UPDATE_EQUIPMENT : PageTitles.REGISTER_EQUIPMENT}
          />
          {permission && (
            <CustomButton
              key="equipment-sample-file-export"
              title={ButtonTitles.DOWNLOAD_IMPORT_SAMPLE}
              icon={Icons.DOWNLOAD2}
              background={Colors.PRIMARY}
              color={Colors.WHITE}
              openModal={handleEquipmentSampleFileExport}
            />
          )}
        </MDBox>
      </MDBox>
      <Feature name={FeatureTags.SETUP_EQUIPMENT}>
        {checkloader() ? (
          <MDBox>
            {permission ? (
              <>
                <MDBox px={3}>
                  <MDBox
                    sx={{
                      height: "60px",
                      marginTop: 2,
                      width: "100%",
                      display: "flex",
                      flexWrap: "nowrap",
                      justifyContent: "center",
                      border: "1px solid #EAECF0",
                    }}
                  >
                    <Tabs
                      value={tabvalue}
                      onChange={handleTabChange}
                      orientation="horizontal"
                      sx={{
                        margin: "0 auto",
                        flexGrow: 1,
                        flexShrink: 0,
                      }}
                    >
                      <Tab
                        defaultindex={0}
                        label="Equipment Details"
                        icon={
                          <HardwareOutlinedIcon
                            fontSize="medium"
                            sx={{
                              cursor: "pointer",
                              color: `${tabvalue === 0 ? "#FF6600" : "#667085"}`,
                            }}
                          />
                        }
                        iconPosition="start"
                        sx={{
                          width: "100%",
                          padding: "12px 0px",
                          fontSize: pxToRem(18),
                          fontWeight: `${tabvalue === 0 ? "600" : null}`,
                          borderRadius: 0,
                          color: `${tabvalue === 0 ? "red" : "yellow"}`,
                          backgroundColor: "#ffffff",
                          borderBottom: `2px solid ${tabvalue === 0 && "#FF6600"}`,
                          borderRight: "1px solid #EAECF0",
                        }}
                      />
                      <Tab
                        defaultindex={1}
                        label="Images, Specification & Price"
                        icon={
                          <ImageOutlinedIcon
                            fontSize="medium"
                            sx={{
                              cursor: "pointer",
                              color: `${tabvalue === 1 ? "#FF6600" : "#667085"}`,
                            }}
                          />
                        }
                        iconPosition="start"
                        sx={{
                          width: "100%",
                          padding: "12px 0px",
                          fontSize: pxToRem(18),
                          fontWeight: `${tabvalue === 1 ? "600" : null}`,
                          borderRadius: 0,
                          color: `${tabvalue === 1 ? "#344054" : "#667085"}`,
                          backgroundColor: "#ffffff",
                          borderBottom: `2px solid ${tabvalue === 1 && "#FF6600"}`,
                          borderRight: "1px solid #EAECF0",
                        }}
                      />
                      <Tab
                        defaultindex={2}
                        label="Warehouse Info & QR"
                        icon={
                          <MeetingRoomOutlinedIcon
                            fontSize="medium"
                            sx={{
                              cursor: "pointer",
                              color: `${tabvalue === 2 ? "#FF6600" : "#667085"}`,
                            }}
                          />
                        }
                        iconPosition="start"
                        sx={{
                          width: "100%",
                          padding: "12px 0px",
                          fontSize: pxToRem(18),
                          fontWeight: `${tabvalue === 2 ? "600" : null}`,
                          borderRadius: 0,
                          color: `${tabvalue === 2 ? "#344054" : "#667085"}`,
                          backgroundColor: "#ffffff",
                          borderBottom: `2px solid ${tabvalue === 2 && "#FF6600"}`,
                        }}
                      />
                    </Tabs>
                  </MDBox>
                  <StyledMDBox>
                    {tabvalue === 0 && (
                      <MDBox
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: pxToRem(16),
                        }}
                      >
                        <MDBox
                          sx={{
                            width: "100%",
                            gap: pxToRem(16),
                          }}
                        >
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item xs={12}>
                              <MDTypography
                                sx={{
                                  fontSize: pxToRem(24),
                                  fontWeight: 600,
                                  color: "#667085",
                                  padding: "12px 0px",
                                }}
                              >
                                Equipment Information
                              </MDTypography>
                            </Grid>
                            {ConfigData?.equipmentConfig?.properties?.equipment?.length > 0
                              ? ConfigData?.equipmentConfig?.properties?.equipment?.map((item) => {
                                  const fieldValue = values[item.id] || "";
                                  switch (item.type) {
                                    case "text":
                                      return (
                                        <Grid
                                          item
                                          lg={item.id === "name" ? 12 : 6}
                                          sm={12}
                                          key={item.id}
                                        >
                                          <FTextField
                                            label={item?.IsRequired ? `${item.title}*` : item.title}
                                            placeholder={item?.hint}
                                            name={item?.id}
                                            id={item?.id}
                                            type="text"
                                            disabled={item?.parentFieldId !== ""}
                                            error={Boolean(errors[item.id])}
                                            helperText={errors[item.id]}
                                            value={fieldValue}
                                            handleChange={(e) =>
                                              handleConfigChange(item?.id, e.target.value, item?.id)
                                            }
                                          />
                                        </Grid>
                                      );
                                    case "options":
                                      return (
                                        <Grid item lg={6} sm={12} key={item.id}>
                                          {(() => {
                                            const equipvalue =
                                              item.parentFieldId !== ""
                                                ? item.options.find(
                                                    (opt) =>
                                                      opt.isVisibleForOptions.includes(
                                                        values?.[item.parentFieldId]
                                                      ) ||
                                                      opt.isVisibleForOptions.includes(
                                                        values?.[item.parentFieldId]?.id
                                                      )
                                                  )
                                                : {};
                                            return (
                                              <FDropdown
                                                label={
                                                  item?.IsRequired ? `${item.title}*` : item.title
                                                }
                                                menu={item?.options.map((val) => ({
                                                  [Constants.MONGOOSE_ID]: val?.id,
                                                  title: val?.title,
                                                }))}
                                                name={item?.id}
                                                id={item?.id}
                                                disabled={item?.parentFieldId !== ""}
                                                handleChange={(e, value, id) => {
                                                  if (item.parentFieldId === "") {
                                                    handleConfigChange(e, value, id);
                                                  }
                                                }}
                                                value={
                                                  (item.parentFieldId !== "" &&
                                                    (equipvalue?.id || "")) ||
                                                  values?.[item?.id] ||
                                                  fieldValue
                                                }
                                                error={errors && errors[item.id]}
                                                helperText={errors && errors[item.id]}
                                              />
                                            );
                                          })()}
                                        </Grid>
                                      );
                                    case "number":
                                      return (
                                        <Grid item lg={6} sm={12} key={item.id}>
                                          <FTextField
                                            label={item?.IsRequired ? `${item.title}*` : item.title}
                                            placeholder={item?.hint}
                                            name={item?.id}
                                            id={item?.id}
                                            type="number"
                                            error={Boolean(errors[item.id])}
                                            helperText={errors[item.id]}
                                            value={values[item.id] || ""}
                                            handleChange={(e) =>
                                              handleConfigChange(item?.id, e.target.value, item?.id)
                                            }
                                          />
                                        </Grid>
                                      );
                                    case "date":
                                      return (
                                        <Grid item lg={6} sm={12} key={item.id}>
                                          <MDBox
                                            sx={{ minWidth: "100%", mt: 0, mr: 1, zIndex: 9999 }}
                                            display="flex"
                                          >
                                            <ReactDatePicker
                                              selected={
                                                (values?.[item.id] &&
                                                  moment(
                                                    values?.[item.id].split(".")[0]
                                                  ).toDate()) ||
                                                null
                                              }
                                              onChange={(date) =>
                                                handleConfigChange(
                                                  item.id,
                                                  moment(date)
                                                    .format(defaultData.DATABSE_DATE_FORMAT)
                                                    .toString(),
                                                  item.questionId ? item.questionId : item.id
                                                )
                                              }
                                              customInput={
                                                <DateTime
                                                  value={fieldValue}
                                                  item={item}
                                                  label={`${item?.title}${
                                                    item?.IsRequired ? "*" : ""
                                                  }`}
                                                  errors={values.errors?.[item.id]}
                                                  helperText={values.errors?.[item.id]}
                                                  placeholder={item?.hint}
                                                />
                                              }
                                              placeholderText={item?.hint}
                                              dateFormat={
                                                defaultData.REACTDATETIMEPICKER_DATE_FORMAT
                                              }
                                            />
                                          </MDBox>
                                        </Grid>
                                      );
                                    case "options-values":
                                      if (
                                        item.parentFieldId !== "" &&
                                        item.dependentIds.includes(values?.equipmentType)
                                      ) {
                                        return (
                                          <Grid
                                            item
                                            lg={
                                              item.dependentIds.includes(values?.equipmentType)
                                                ? 12
                                                : 6
                                            }
                                            sm={12}
                                            key={item.id}
                                          >
                                            <FTextField
                                              label={
                                                item?.IsRequired ||
                                                item.dependentIds.includes(values?.equipmentType)
                                                  ? `${item.title}*`
                                                  : item.title
                                              }
                                              placeholder={item?.hint}
                                              name={item?.id}
                                              id={item?.id}
                                              type="number"
                                              error={Boolean(errors[item.id])}
                                              helperText={errors[item.id]}
                                              value={values[item.id] || ""}
                                              handleChange={(e) =>
                                                handleConfigChange(
                                                  item?.id,
                                                  e.target.value,
                                                  item?.id
                                                )
                                              }
                                            />
                                          </Grid>
                                        );
                                      }
                                      return null;
                                    default:
                                      return null;
                                  }
                                })
                              : null}
                          </Grid>
                        </MDBox>
                      </MDBox>
                    )}
                    {tabvalue === 1 && (
                      <ProductDocument
                        data={equipDocumentData}
                        setData={setEquipDocumentData}
                        updateEquipment={updateEquipment}
                      />
                    )}
                    {tabvalue === 2 && (
                      <ProductWarehouse
                        warehouseData={warehouseData}
                        setWarehouseData={setWarehouseData}
                        updateEquipment={updateEquipment}
                      />
                    )}
                  </StyledMDBox>
                </MDBox>
                <MDBox
                  sx={{
                    marginTop: 3,
                    backgroundColor: "#fff",
                    height: "71px",
                    padding: "12px 32px 16px 32px",
                    border: "1px solid #E0E6F5",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <MDBox sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    {tabvalue > 0 && ( // Show "Back" button only if not on the first tab
                      <MDButton
                        variant="outlined"
                        color="info"
                        style={{ textTransform: "none", boxShadow: "none" }}
                        onClick={moveToPreviousTab}
                        sx={{ marginRight: "16px" }} // Use the function to move to the previous tab
                      >
                        Back
                      </MDButton>
                    )}
                    <MDButton
                      variant="contained"
                      color="info"
                      style={{ textTransform: "none", boxShadow: "none" }}
                      onClick={handleSubmit}
                    >
                      {getButtonText()}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </>
            ) : (
              <AccessDenied />
            )}
          </MDBox>
        ) : (
          <MDBox
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {Icons.LOADING2}
          </MDBox>
        )}
      </Feature>
    </DashboardLayout>
  );
}

export default configEquipment;
