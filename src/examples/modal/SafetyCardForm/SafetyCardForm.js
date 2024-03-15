/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { forwardRef, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Slider,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import ModalTitle from "examples/NewDesign/ModalTitle";
import { useDispatch, useSelector } from "react-redux";
import style from "assets/style/Modal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import uploadImageThunk from "redux/Thunks/ImageUpload";
import { openSnackbar } from "redux/Slice/Notification";
import moment from "moment";
import ReactDatePicker from "react-datepicker";
import pxToRem from "assets/theme/functions/pxToRem";
import Constants, { Icons, ButtonTitles, defaultData } from "utils/Constants";
import FormControlErrorStyles from "assets/style/Component";
import MDInput from "components/MDInput";
import FullScreenImageComponent from "components/ViewFullImage/ViewImage";
import configThunk from "redux/Thunks/Config";
import { submitLoanFormThunk } from "redux/Thunks/LoanFormConfig";
import "react-datepicker/dist/react-datepicker.css";

function safetyCardForm({
  screenIndex,
  cardType,
  openSafetyModal,
  setOpenSafetyModal,
  bgColor,
  handleReset,
}) {
  const [form, setForm] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [safetyCardBody, setSafetyCardBody] = useState({});
  const [requiredList, setRequiredList] = useState([]);
  const ConfigData = useSelector((state) => state.loan);
  const dispatch = useDispatch();

  useEffect(() => {
    setForm(ConfigData.screens?.[screenIndex].screensInfo);
  }, [ConfigData]);

  useEffect(() => {
    if (Object.keys(form).length > 0) {
      form.properties.forEach((item) => {
        if (item.IsRequired) {
          setRequiredList((prev) => [...prev, item.id]);
        }
      });
    }
  }, [form]);

  const handleEditClose = () => {
    setSafetyCardBody([]);
    setErrors([]);
    setImageUrls([]);
    setImage([]);
    setOpenSafetyModal(false);
  };
  const validate = () => {
    const newErrors = {};

    if (Object.keys(form).length > 0) {
      form.properties.forEach((item) => {
        if (item.IsRequired && !item.questionId && !safetyCardBody[item.id]) {
          newErrors[item.id] = `This field is required`;
        } else if (
          item.IsRequired &&
          item.questionId &&
          !safetyCardBody?.dynamicFields?.filter((val) => val?.title.replace(/\s/g, "") === item.id)
            .length > 0
        ) {
          newErrors[item.id] = `This field is required`;
        }
        if (
          item.IsRequired &&
          !item.questionId &&
          typeof safetyCardBody[item.id] === "string" &&
          safetyCardBody[item.id]?.trim() === ""
        ) {
          newErrors[item.id] = "Empty Space is not allowed";
        }
        if (item.IsRequired && item.questionId) {
          const index = safetyCardBody?.dynamicFields?.findIndex(
            (val) => val?.title.replace(/\s/g, "") === item.id
          );
          if (
            typeof safetyCardBody?.dynamicFields?.[index]?.value[0] === "string" &&
            safetyCardBody?.dynamicFields?.[index]?.value[0]?.trim() === ""
          ) {
            newErrors[item.id] = "Empty Space is not allowed";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.values(newErrors).filter((val) => val !== "").length === 0;
  };

  const updateFormField = (idArray = [], parentId) => {
    if (idArray.length > 0) {
      const temp = JSON.parse(JSON.stringify(form));
      const t = [];
      temp.properties.forEach((item, i) => {
        if (item.parentFieldId === parentId) {
          const index = idArray.findIndex((val) => val === item?.id);
          if (index !== -1) {
            temp.properties[i].isDefaultVisible = true;
            temp.properties[i].IsRequired = true;
            t.push(item);
          } else {
            temp.properties[i].isDefaultVisible = false;
            temp.properties[i].IsRequired = false;
          }
        }
      });
      setForm(temp);
    } else {
      setForm(ConfigData.screens?.[screenIndex].screensInfo);
    }
  };

  const handleChange = (name, value, id) => {
    const temp = safetyCardBody;
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
    form?.properties.forEach((item) => {
      // remove child field when parent field is changed
      if (item?.parentFieldId === name) {
        delete temp?.[item?.id];
      }
    });

    setSafetyCardBody({ ...temp });
  };

  const handleImageChange = (name, value, id) => {
    const temp = safetyCardBody;
    const index = temp.dynamicFields.findIndex((val) => val.fieldId === id);
    if (!requiredList.includes(name)) {
      if (index >= 0 && value.length > 0) {
        temp.dynamicFields[index].value = value;
      } else if (index >= 0 && value.length === 0) {
        temp.dynamicFields.splice(index, 1);
      } else {
        const dynamicFieldValueObject = {
          title: name,
          value,
          fieldId: id,
        };
        temp.dynamicFields.push(dynamicFieldValueObject);
      }
    } else if (name in temp && value.length === 0) {
      delete temp[name];
    } else {
      temp[name] = value;
    }
    setSafetyCardBody({ ...temp });
  };

  const handleBoolean = (name, id, value) => {
    const temp = safetyCardBody;

    temp[name] = value;
    setSafetyCardBody({ ...temp });
  };

  const handleCheckbox = (name, id, value, checked) => {
    const temp = safetyCardBody;
    const index = temp.dynamicFields.findIndex((val) => val.fieldId === id);
    if (index >= 0 && checked) {
      temp.dynamicFields[index].value.push(value.toString());
    } else if (index >= 0 && !checked) {
      temp.dynamicFields[index].value = temp.dynamicFields[index].value.filter(
        (val) => val !== value.toString()
      );
    } else {
      const dynamicFieldValueObject = {
        title: name,
        value: [value.toString()],
        fieldId: id,
      };
      temp.dynamicFields.push(dynamicFieldValueObject);
    }
    temp[name] = value;
    setSafetyCardBody({ ...temp });
  };

  useEffect(() => {
    if (openSafetyModal) {
      const temp = {};
      temp.dynamicFields = [];
      setSafetyCardBody({ ...temp });
    } else {
      setImage([]);
    }
  }, [openSafetyModal]);

  const createUnsafecard = async () => {
    setLoading(true);
    const val = validate();
    if (val) {
      const tempBody = { ...safetyCardBody };
      Object.entries(tempBody).forEach(([key]) => {
        if (typeof tempBody[key] === "string") {
          tempBody[key] = tempBody[key].trim();
        }
      });
      const res = await dispatch(submitLoanFormThunk({ type: form.configType, body: tempBody }));
      if (res.payload.status === 200) {
        setOpenSafetyModal(false);
        setImageUrls([]);
        setImage([]);
        handleReset();
        dispatch(
          openSnackbar({
            message: Constants.LOAN_FORM_SUBMIT_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        await dispatch(configThunk());
      } else if (res.payload.status === 422) {
        const newErrors = {};
        res.payload.data.data.error.forEach((item) => {
          const [keys, values] = Object.entries(item)[0];
          newErrors[keys] = values;
        });
        setErrors(newErrors);
        dispatch(
          openSnackbar({
            message: res.payload.data.message,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    }
    setLoading(false);
  };
  const handleCancelClick = (index, name, id) => {
    const newImageArray = [...image];
    newImageArray.splice(index, 1);
    setImage(newImageArray);

    const newImageUrlArray = [...imageUrls];
    newImageUrlArray.splice(index, 1);
    setImageUrls(newImageUrlArray);
    handleImageChange(name, newImageUrlArray, id);
  };
  const handleFileChange = async (name, e, id) => {
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
    if (imageUrls.length + e.target.files.length <= 3) {
      const newImages = [];
      for (let i = 0; i < e.target.files.length; i += 1) {
        const file = e.target.files[i];
        if (!allowedFormats.includes(file.type)) {
          dispatch(
            openSnackbar({
              message: "Only JPG, JPEG, and PNG formats are allowed.",
              notificationType: "error",
            })
          );
          return;
        }
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview });
      }

      const type = "SafetyCard";
      const uploadPromises = newImages.map((img) =>
        dispatch(uploadImageThunk({ file: img.file, type }))
      );
      const responses = await Promise.all(uploadPromises);
      const newImageUrlArray = responses.map((response) => response.payload.data.iconUrl);
      setImageUrls([...imageUrls, ...newImageUrlArray]);
      handleImageChange(name, [...imageUrls, ...newImageUrlArray], id);
      setImage([...image, ...newImages]);
    } else {
      dispatch(
        openSnackbar({ message: "You can only upload up to 3 images.", notificationType: "error" })
      );
    }
  };
  const dropdownIcon = () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />;

  const CustomDateTimeInput = forwardRef(({ value, onClick, item }, ref) => (
    <MDInput
      error={Boolean(errors[item.id])}
      helperText={errors[item.id]}
      FormHelperTextProps={{
        sx: { marginLeft: 1, color: "red" },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      placeholder={item.hint}
      value={value}
      sx={{ ml: 0, width: 400, mt: 1 }}
      onClick={onClick}
      ref={ref}
    />
  ));

  const handleImage = (id) => {
    document.getElementById(id).click();
  };

  const handleImageFullView = (imageUrl, i) => {
    setFullScreenImageIndex(i);
    setFullScreenImage(imageUrl);
  };
  const handleCloseFullView = () => {
    setFullScreenImage(null);
  };
  const handleNextImage = () => {
    setFullScreenImageIndex((prevIndex) => (prevIndex + 1) % image.length);
  };

  const handlePreviousImage = () => {
    setFullScreenImageIndex((prevIndex) => (prevIndex - 1 + image.length) % image.length);
  };
  return (
    <>
      <Modal
        open={openSafetyModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <MDBox
            bgColor={bgColor}
            p={3}
            mb={3}
            display="flex"
            borderRadius="lg"
            alignItems="center"
            justifyContent="space-between"
            sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
          >
            <ModalTitle title={form.title} color="white" />

            <Icon
              sx={{ cursor: "pointer", color: "beige" }}
              fontSize="medium"
              onClick={handleEditClose}
            >
              {Icons.CROSS}
            </Icon>
          </MDBox>
          <MDBox
            px={2}
            py={0}
            sx={{
              maxHeight: 500,
              overflowY: "scroll",
              "::-webkit-scrollbar": {
                width: "5px",
              },
              "::-webkit-scrollbar-thumb": {
                background: "gray",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "gray transparent",
            }}
          >
            {Object.keys(form).length > 0 &&
              form?.properties
                .slice()
                .filter((item) => item.isDefaultVisible)
                .sort((a, b) => a.fieldSortOrder - b.fieldSortOrder)
                .map((item, index) => (
                  <MDBox mb={1} mt={0} key={item?.id}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="start">
                      <MDTypography
                        mt={2}
                        ml={1}
                        id="modal-modal-description"
                        display="flex"
                        alignItems="center"
                        sx={{
                          textTransform: "capitalize",
                          fontSize: pxToRem(14),
                          fontWeight: 500,
                          color: "#344054",
                          width: "220px",
                        }}
                      >
                        {item.type !== "termsAndConditions" ? (
                          `${item.title} ${item.IsRequired ? "*" : ""}`
                        ) : (
                          <MDBox>
                            <MDTypography
                              variant="caption"
                              sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                            >
                              I have read and agree to the terms and conditions
                            </MDTypography>
                            <Tooltip title={item.title}>
                              <IconButton
                                sx={{ padding: 0, marginLeft: 0, marginTop: 1 }}
                                onClick={() => handleImage(item.id)}
                              >
                                {Icons.INFO}
                              </IconButton>
                            </Tooltip>
                          </MDBox>
                        )}
                      </MDTypography>

                      {item.type === "text" || item.type === "email" ? (
                        <MDInput
                          sx={{
                            width: 400,
                            mt: 1,
                            mr: 2,
                            "& input": {
                              fontSize: "16px",
                              color: "#667085",
                            },
                          }}
                          size="small"
                          variant="outlined"
                          placeholder={`Please Enter ${item.title}`}
                          id={item.id}
                          name={item.id}
                          error={Boolean(errors[item.id])}
                          helperText={errors[item.id]}
                          value={
                            safetyCardBody?.[item.id] ||
                            safetyCardBody?.dynamicFields.filter(
                              (val) => val?.fieldId === item?.questionId
                            )[0]?.value ||
                            ""
                          }
                          FormHelperTextProps={{
                            sx: { marginLeft: 0, marginTop: 1, color: "red" },
                          }}
                          onChange={(e) =>
                            handleChange(
                              item.id,
                              e.target.value,
                              item.questionId ? item.questionId : item.id
                            )
                          }
                        />
                      ) : null}

                      {item.type === "dropdown" && item.parentFieldId === "" ? (
                        <FormControl
                          sx={{
                            mr: 2,
                            mt: 1,
                            minWidth: 120,
                            width: 400,
                            ...FormControlErrorStyles,
                          }}
                          error={Boolean(errors[item.id])}
                        >
                          <InputLabel id={item.id}>{item.hint}</InputLabel>
                          <Select
                            width="90%"
                            onChange={(e) => {
                              if (item.hasChildField) {
                                const val = item.options.findIndex(
                                  (opt) => opt.id === e.target.value
                                );
                                if (val !== -1) {
                                  updateFormField(item?.options[val]?.dependentFieldIds, item.id);
                                }
                              }
                              handleChange(
                                item.id,
                                e.target.value,
                                item.questionId ? item.questionId : item.id
                              );
                            }}
                            IconComponent={dropdownIcon}
                            labelId={item.id}
                            label={item.hint}
                            id={item.questionId ? item.questionId : item.id}
                            name={item.id}
                            sx={{
                              color: "#667085",
                              backgroundColor: "black",
                              paddingY: "0.5rem",
                              paddingX: "0.5rem",
                              fontSize: pxToRem(16),
                              fontWeight: 400,
                            }}
                            renderValue={(selected) => {
                              const val = item.options.filter(
                                (opt) => opt.id === selected || opt.id === selected[0]
                              )[0];
                              return (
                                <MDBox sx={{ display: "flex", alignItems: "center" }}>
                                  {val?.color && val?.color !== "" ? (
                                    <Box
                                      component="span"
                                      sx={{
                                        backgroundColor: `#${val?.color}`,
                                        borderRadius: "50%",
                                        width: "10px",
                                        height: "10px",
                                        mr: 1,
                                      }}
                                    />
                                  ) : null}
                                  <MDTypography
                                    variant="caption"
                                    sx={{ textTransform: "capitalize" }}
                                  >
                                    {val?.title}
                                  </MDTypography>
                                </MDBox>
                              );
                            }}
                            value={
                              safetyCardBody[item.id] ||
                              safetyCardBody?.dynamicFields.filter(
                                (val) => val?.fieldId === item?.questionId
                              )[0]?.value ||
                              ""
                            }
                            MenuProps={{
                              anchorOrigin: {
                                vertical: 32,
                                horizontal: -8,
                              },
                              transformOrigin: {
                                vertical: "top",
                                horizontal: "left",
                              },
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  opacity: 1,
                                  transform: "none",
                                  minWidth: "400px",
                                },
                              },
                            }}
                          >
                            <MenuItem disabled value="">
                              {item.hint}
                            </MenuItem>
                            {item.options.map((val) => (
                              <MenuItem
                                value={val?.id}
                                id={val?.id}
                                sx={{ display: "flex" }}
                                key={val?.id}
                              >
                                {val?.color && val?.color !== "" ? (
                                  <Box
                                    component="span"
                                    sx={{
                                      backgroundColor: `#${val?.color}`,
                                      borderRadius: "50%",
                                      width: "10px",
                                      height: "10px",
                                      mr: 1,
                                    }}
                                  />
                                ) : null}
                                <MDTypography
                                  id={val?.id}
                                  variant="caption"
                                  sx={{
                                    textTransform: "capitalize",
                                    fontSize: pxToRem(16),
                                    fontWeight: 400,
                                    color: "#667085",
                                    display: "flex",
                                  }}
                                >
                                  {val?.title}
                                </MDTypography>
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText sx={{ marginLeft: 0 }}>{errors[item.id]}</FormHelperText>
                        </FormControl>
                      ) : null}

                      {(item.type === "dropdown" || item.type === "autocomplete") &&
                        item.parentFieldId !== "" &&
                        (() => {
                          const parentField = form?.properties.find(
                            (val) => val.id === item.parentFieldId
                          );
                          const type = parentField?.options.find(
                            (element) => element.id === safetyCardBody[item.parentFieldId]
                          )?.isDefault;

                          const selectedValue = item.options.find(
                            (val) => val.id === safetyCardBody[item.id]
                          );
                          const currentValue =
                            typeof selectedValue === "object"
                              ? selectedValue?.title || selectedValue
                              : selectedValue || "";
                          const options =
                            (type
                              ? item.options
                                  .filter((val) => val?.isDefault)
                                  .map((val) => val?.title || "")
                              : item.options
                                  .filter((val) =>
                                    val.isVisibleForOptions.includes(
                                      safetyCardBody[item.parentFieldId]
                                    )
                                  )
                                  .map((val) => val?.title || "")) || [];

                          return (
                            <Autocomplete
                              onChange={(e, value) => {
                                const selectecteValue = item.options.filter(
                                  (val) => val?.title === value
                                );
                                handleChange(
                                  item.id,
                                  selectecteValue.length > 0 ? selectecteValue[0]?.id : value,
                                  item.questionId || item.id
                                );
                              }}
                              freeSolo={type}
                              value={currentValue}
                              options={options}
                              sx={{
                                width: 400,
                                mt: 1,
                                mr: 2,
                                "& .MuiAutocomplete-inputRoot": {
                                  padding: "4px",
                                },
                              }}
                              popupIcon={
                                <KeyboardArrowDownIcon
                                  fontSize="medium"
                                  sx={{ color: "#667085" }}
                                />
                              }
                              renderInput={(params) => (
                                <MDInput
                                  {...params}
                                  label={item.hint}
                                  error={Boolean(errors[item.id])}
                                  helperText={errors[item.id]}
                                  FormHelperTextProps={{
                                    sx: { marginLeft: 0, marginTop: 1, color: "red" },
                                  }}
                                  onChange={(e) =>
                                    handleChange(
                                      item.id,
                                      e.target.value,
                                      item.questionId || item.id
                                    )
                                  }
                                  sx={{
                                    minWidth: 120,
                                    width: 400,
                                    ...FormControlErrorStyles,
                                  }}
                                />
                              )}
                              PaperProps={{
                                style: {
                                  maxHeight: 200,
                                },
                              }}
                            />
                          );
                        })()}
                      {item.type === "boolean" || item.type === "termsAndConditions" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 3.2 }}
                          display="flex"
                          justifyContent="start"
                          flexDirection="column"
                        >
                          <Switch
                            color="warning"
                            sx={{
                              "&.Mui-checked": {
                                color: "#fff",
                                backgroundColor: "#FF8E53",
                              },
                            }}
                            onChange={(e) =>
                              handleBoolean(item.id, item.questionId, e.target.checked)
                            }
                            error={Boolean(errors[item.id])}
                          />
                          <FormHelperText sx={{ marginLeft: 0, color: "#FF2E2E" }}>
                            {errors[item.id]}
                          </FormHelperText>
                        </MDBox>
                      ) : null}

                      {item.type === "checkbox" ? (
                        <MDBox sx={{ width: 400, mr: 2 }} display="flex" justifyContent="start">
                          <FormGroup error={Boolean(errors[item.id])}>
                            {item.options.map((val) => (
                              <FormControlLabel
                                key={val.id}
                                control={
                                  <Checkbox
                                    onChange={(e) =>
                                      handleCheckbox(
                                        item.title,
                                        item.questionId,
                                        val.title,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={val.title}
                              />
                            ))}
                            <FormHelperText sx={{ marginLeft: 0, color: "#FF2E2E" }}>
                              {errors[item.id]}
                            </FormHelperText>
                          </FormGroup>
                        </MDBox>
                      ) : null}

                      {item.type === "datetime" ? (
                        <MDBox
                          sx={{ width: 400, mr: 2, zIndex: 1000 - index }}
                          display="flex"
                          justifyContent="start"
                        >
                          <ReactDatePicker
                            selected={
                              (safetyCardBody?.[item.id] &&
                                moment(safetyCardBody?.[item.id]?.split(".")[0]).toDate()) ||
                              (safetyCardBody?.dynamicFields?.filter(
                                (val) => val?.fieldId === item?.questionId
                              ).length > 0 &&
                                moment(
                                  safetyCardBody?.dynamicFields?.filter(
                                    (val) => val?.fieldId === item?.questionId
                                  )?.[0]?.value[0]
                                ).toDate()) ||
                              ""
                            }
                            onChange={(date) =>
                              handleChange(
                                item.id,
                                moment(date)
                                  .format(defaultData.DATABASE_24_HOURS_FORMAT)
                                  .toString(),
                                item.questionId ? item.questionId : item.id
                              )
                            }
                            customInput={<CustomDateTimeInput item={item} />}
                            showTimeSelect
                            dateFormat={defaultData.REACTDATETIMEPICKER_24_HOURS_FORMAT}
                            timeIntervals={5}
                            timeFormat="HH:mm"
                          />
                        </MDBox>
                      ) : null}
                      {item.type === "number" ? (
                        <MDBox
                          sx={{ width: 400, mr: 2, mt: 1 }}
                          display="flex"
                          justifyContent="start"
                        >
                          <MDInput
                            sx={{
                              width: 400,
                            }}
                            type="number"
                            placeholder={`Please Enter ${item.title.toUpperCase()}`}
                            id={item.id}
                            name={item.id}
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id]}
                            value={safetyCardBody[item.id]}
                            FormHelperTextProps={{
                              sx: { marginLeft: 0 },
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                e.target.value,
                                item.questionId ? item.questionId : item.id
                              )
                            }
                          />
                        </MDBox>
                      ) : null}

                      {item.type === "mobile" ? (
                        <MDBox
                          sx={{ width: 400, mr: 2, mt: 1 }}
                          display="flex"
                          justifyContent="start"
                        >
                          <MDInput
                            sx={{
                              width: 400,
                            }}
                            type="number"
                            placeholder={`Please Enter ${item.title.toUpperCase()}`}
                            id={item.id}
                            name={item.id}
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id]}
                            value={
                              safetyCardBody[item.id] && safetyCardBody[item.id].split("+91")[1]
                            }
                            FormHelperTextProps={{
                              sx: { marginLeft: 0 },
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            onChange={(e) => {
                              if (
                                safetyCardBody[item.id] &&
                                safetyCardBody[item.id].split("")[0] === "+"
                              )
                                handleChange(
                                  item.id,
                                  // `+91${safetyCardBody[item.id] ?? ""}${e.target.value}`,
                                  e.target.value,
                                  item.questionId ? item.questionId : item.id
                                );
                              else {
                                handleChange(
                                  item.id,
                                  `+91${e.target.value}`,
                                  item.questionId ? item.questionId : item.id
                                );
                              }
                            }}
                          />
                        </MDBox>
                      ) : null}

                      {item.type === "slider" ? (
                        <MDBox
                          sx={{ width: 400, mr: 2, mt: 1 }}
                          display="flex"
                          justifyContent="start"
                          flexDirection="column"
                        >
                          <Slider
                            id={item.id}
                            name={item.id}
                            aria-label="Default"
                            valueLabelDisplay="auto"
                            min={item?.range?.min}
                            max={item?.range?.max}
                            step={2}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                e.target.value,
                                item.questionId ? item.questionId : item.id
                              )
                            }
                          />
                          <FormHelperText sx={{ marginLeft: 0, color: "#FF2E2E" }}>
                            {errors[item.id]}
                          </FormHelperText>
                        </MDBox>
                      ) : null}
                      {item.type === "date" ? (
                        <MDBox
                          sx={{ width: 400, mr: 2, zIndex: 1000 - index }}
                          display="flex"
                          justifyContent="start"
                        >
                          <ReactDatePicker
                            selected={
                              (safetyCardBody?.[item.id] &&
                                moment(safetyCardBody?.[item.id]).toDate()) ||
                              (safetyCardBody?.dynamicFields?.filter(
                                (val) => val?.fieldId === item?.questionId
                              ).length > 0 &&
                                moment(
                                  safetyCardBody?.dynamicFields?.filter(
                                    (val) => val?.fieldId === item?.questionId
                                  )?.[0]?.value[0]
                                ).toDate()) ||
                              ""
                            }
                            onChange={(date) =>
                              handleChange(
                                item.id,
                                moment(date).format(defaultData.DATABSE_DATE_FORMAT).toString(),
                                item.questionId ? item.questionId : item.id
                              )
                            }
                            customInput={<CustomDateTimeInput item={item} />}
                            dateFormat={defaultData.REACTDATETIMEPICKER_DATE_FORMAT}
                            timeIntervals={5}
                          />
                        </MDBox>
                      ) : null}
                    </MDBox>
                    {item.type === "textarea" ? (
                      <MDBox>
                        <MDInput
                          sx={{
                            mt: 0,
                            width: 642,
                            ml: 1,
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
                          id={item.id}
                          name={item.id}
                          error={Boolean(errors[item.id])}
                          helperText={errors[item.id]}
                          FormHelperTextProps={{
                            sx: { marginLeft: 0 },
                          }}
                          value={safetyCardBody[item.id]}
                          placeholder={`Please Enter ${item.title}`}
                          onChange={(e) =>
                            handleChange(
                              item.id,
                              e.target.value.substring(0, 3000),
                              item.questionId ? item.questionId : item.id
                            )
                          }
                        />
                        <MDTypography
                          sx={{
                            color: "#667085",
                            fontSize: "10px",
                            display: "flex",
                            justifyContent: "end",
                            mr: "25px",
                          }}
                        >
                          {safetyCardBody?.[item.id]
                            ? `${safetyCardBody?.[item.id].length}/3000`
                            : `0/3000`}
                        </MDTypography>
                      </MDBox>
                    ) : null}
                    {item.type === "images" ? (
                      <MDBox
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        my={1}
                        mr={2}
                        ml={1}
                        sx={{ width: 642 }}
                      >
                        {image.map((img, i) => (
                          <MDBox
                            display="flex"
                            borderRadius="8px"
                            position="relative"
                            key={img.preview}
                            mr={2}
                            sx={{ "&:hover .overlay": { display: "flex", borderRadius: "8px" } }}
                          >
                            <img
                              src={img.preview}
                              alt="Preview"
                              width={70}
                              height={70}
                              style={{ borderRadius: "8px" }}
                            />
                            <Box
                              display="none"
                              position="absolute"
                              top={0}
                              right={0}
                              bottom={0}
                              left={0}
                              alignItems="center"
                              justifyContent="center"
                              bgcolor="rgba(0, 0, 0, 0.5)"
                              className="overlay"
                            >
                              <Icon
                                sx={{ color: "white", width: 30, height: 30, cursor: "pointer" }}
                                onClick={() => handleImageFullView(img?.preview || img, i)}
                              >
                                {Icons.VIEW2}
                              </Icon>
                            </Box>
                            <Box
                              display="none"
                              position="absolute"
                              top={0}
                              right={0}
                              bottom={60}
                              left={70}
                              alignItems="center"
                              justifyContent="center"
                              bgcolor="rgba(0, 0, 0, 0.5)"
                              className="overlay"
                            >
                              <Icon
                                sx={{ color: "white", width: 30, height: 30, cursor: "pointer" }}
                                onClick={() =>
                                  handleCancelClick(
                                    i,
                                    item.id,
                                    item.questionId ? item.questionId : item.id
                                  )
                                }
                              >
                                {Icons.CROSS2}
                              </Icon>
                            </Box>
                          </MDBox>
                        ))}
                        <MDBox
                          width={pxToRem(70)}
                          height={70}
                          borderRadius="lg"
                          sx={{
                            border: "2px dashed #D0D5DD",
                            borderRadius: "8px",
                            cursor: "pointer",
                            justifyContent: "center",
                            alignItems: "center",
                            display: image.length < 3 ? "flex" : "none",
                          }}
                          onClick={() => handleImage(item.id)}
                        >
                          {Icons.ADD}
                        </MDBox>
                        <TextField
                          id={item.id}
                          sx={{
                            display: "none",
                          }}
                          size="small"
                          variant="outlined"
                          placeholder="Please Enter"
                          type="file"
                          inputProps={{
                            multiple: true,
                            accept: "image/*",
                          }}
                          onChange={(e) =>
                            handleFileChange(
                              item.id,
                              e,
                              item.questionId ? item.questionId : item.id
                            )
                          }
                        />
                      </MDBox>
                    ) : null}
                  </MDBox>
                ))}

            <MDBox px={1} mb={2} mt={1} sx={{ float: "right" }}>
              <MDButton
                variant="contained"
                color={
                  (cardType === "Safe" && "success") ||
                  (cardType === "Unsafe" && "unsafe") ||
                  ((cardType === "Ncr" || cardType === "Incident") && "info")
                }
                onClick={createUnsafecard}
                style={{ textTransform: "none", boxShadow: "none" }}
              >
                {loading ? ButtonTitles.SUBMIT_LOADING : ButtonTitles.SUBMIT}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Modal>
      <FullScreenImageComponent
        fullScreenImage={fullScreenImage}
        handleCloseFullView={handleCloseFullView}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        image={image}
        src={image[fullScreenImageIndex]?.preview}
      />
    </>
  );
}

export default safetyCardForm;
