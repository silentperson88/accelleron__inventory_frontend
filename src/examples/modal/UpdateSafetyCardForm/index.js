/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Icon,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Slider,
  Switch,
  TextField,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ModalTitle from "examples/NewDesign/ModalTitle";

import safetyCardUpdateFormThunk, { updateSafetyCardThunk } from "redux/Thunks/SafetyCard";
import { openSnackbar } from "redux/Slice/Notification";
import { updateSafetyCardData } from "redux/Slice/SafetyCard";
import uploadImageThunk from "redux/Thunks/ImageUpload";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import { Icons, defaultData } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import FullScreenImageComponent from "components/ViewFullImage/ViewImage";
import FormControlErrorStyles from "assets/style/Component";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 0,
};

function updateSafetyCard({ selectedCardId, safetyCardData, openEdit, setOpenEdit }) {
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [safetyCard, setSafetyCard] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const [image, setImage] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const dropdownIcon = () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />;
  const requiredList = [
    "title",
    "project",
    "site",
    "category",
    "location",
    "savingRule",
    "description",
    "severity",
    "likelihood",
    "savingAction",
    "savingRule",
    "type",
    "time",
    "subject",
    "images",
    "actionsTaken",
    "statusUpdate",
    "status",
    "defaultProject",
  ];

  const handleEditClose = () => {
    setOpenEdit(false);
    setForm([]);
    setSafetyCard({});
  };

  useEffect(() => {
    (async () => {
      try {
        if (selectedCardId !== "" && openEdit) {
          const res = await dispatch(
            safetyCardUpdateFormThunk({ id: selectedCardId, cardType: safetyCardData.cardType })
          );
          const tempFields = res.payload.data.sort((a, b) => a.fieldSortOrder - b.fieldSortOrder);
          setForm([...tempFields]);
          setSafetyCard(JSON.parse(JSON.stringify(safetyCardData)));
          setImage(JSON.parse(JSON.stringify(safetyCardData.images)));
          setImageUrls(JSON.parse(JSON.stringify(safetyCardData.images)));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [openEdit, safetyCardData]);

  const handleChange = (name, value, id) => {
    const temp = { ...safetyCard };
    if (!requiredList.includes(name)) {
      const i = temp.dynamicFields.findIndex((val) => val.fieldId === id);
      if (i >= 0) {
        temp.dynamicFields[i].value = [value];
      } else {
        const dynamicFieldValueObject = {
          title: name,
          value: [value],
          fieldId: id,
        };
        temp.dynamicFields.push(dynamicFieldValueObject);
      }
    } else {
      temp[name] = value;
    }

    form?.forEach((item) => {
      // remove child field when parent field is changed
      if (item?.parentFieldId === name) {
        delete temp?.[item?.id];
      }
    });
    setSafetyCard({ ...temp });
  };

  const updateFormField = (prevArray = [], currentArray = []) => {
    const temp = JSON.parse(JSON.stringify(form));
    const t = [];

    if (prevArray.length > 0 && currentArray.length === 0) {
      temp.forEach((item, i) => {
        const index = prevArray.findIndex((val) => val === item?.id);
        if (index !== -1) {
          temp[i].isDefaultVisible = false;
          temp[i].IsRequired = false;
          t.push(item);
        }
      });
      setForm(temp);
    } else if (prevArray.length === 0 && currentArray.length > 0) {
      temp.forEach((item, i) => {
        const index = currentArray.findIndex((val) => val === item?.id);
        if (index !== -1) {
          temp[i].isDefaultVisible = true;
          temp[i].IsRequired = true;
          t.push(item);
        }
      });
      setForm(temp);
    }
  };

  const handleImageChange = (name, value, id) => {
    const temp = { ...safetyCard };
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
    } else {
      temp[name] = value;
    }
    setSafetyCard({ ...temp });
  };

  const handleBooleanField = (name, id, value) => {
    const temp = safetyCard;
    const i = temp.dynamicFields.findIndex((val) => val.fieldId === id);
    if (i >= 0) {
      temp.dynamicFields[i].value = [value.toString()];
      setSafetyCard({ ...temp });
    } else {
      const dynamicFieldValueObject = {
        title: name,
        value: [value.toString()],
        fieldId: id,
      };
      temp.dynamicFields.push(dynamicFieldValueObject);
      setSafetyCard({ ...temp });
    }
  };

  const handleCheckbox = (name, id, value, checked) => {
    const temp = safetyCard;
    const i = temp.dynamicFields.findIndex((val) => val.fieldId === id);
    if (i >= 0 && checked) {
      temp.dynamicFields[i].value.push(value.toString());
    } else if (i >= 0 && !checked) {
      temp.dynamicFields[i].value = temp.dynamicFields[i].value.filter(
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
    setSafetyCard({ ...temp });
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

  const handleFileChange = async (name, e, id) => {
    if (imageUrls.length + e.target.files.length <= 3) {
      const newImages = [];
      for (let i = 0; i < e.target.files.length; i += 1) {
        const file = e.target.files[i];
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

  const validate = () => {
    const newErrors = {};

    form.forEach((item) => {
      if (item.IsRequired && !item.questionId && !safetyCard[item.id]) {
        newErrors[item.id] = item.hint;
      } else if (
        item.IsRequired &&
        item.questionId &&
        !safetyCard?.dynamicFields?.filter((val) => val?.title.replace(/\s/g, "") === item.id)
          .length > 0
      ) {
        newErrors[item.id] = item.hint;
      }
      if (
        item.IsRequired &&
        !item.questionId &&
        (typeof safetyCard[item.id] === "object"
          ? safetyCard[item.id]?.id?.trim() === ""
          : safetyCard[item.id]?.trim() === "")
      ) {
        newErrors[item.id] = item.hint;
      }

      if (
        item.IsRequired &&
        item.questionId &&
        safetyCard?.dynamicFields
          ?.filter((val) => val?.title.replace(/\s/g, "") === item.id)?.[0]
          ?.value[0]?.trim() === ""
      ) {
        newErrors[item.id] = item.hint;
      }
    });

    setErrors(newErrors);
    return Object.values(newErrors).filter((val) => val !== "").length === 0;
  };

  const updateSafetycard = async () => {
    const isValid = validate();
    if (isValid) {
      setLoading(true);
      const tempBody = { ...safetyCard };
      const body = {};
      Object.entries(tempBody).forEach(([key, value]) => {
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          if (trimmedValue !== "") {
            body[key] = trimmedValue;
          }
        } else if (typeof value === "object") {
          body[key] = value.id;
        } else if (value !== null) {
          body[key] = value;
        }
      });

      const b = {
        body,
        id: selectedCardId,
      };
      const res = await dispatch(updateSafetyCardThunk(b));
      if (res.error === undefined) {
        setOpenEdit(false);
        await dispatch(updateSafetyCardData(res.payload.data));
        await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      }
      setLoading(false);
    }
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <MDInput
      FormHelperTextProps={{
        sx: { marginLeft: 1 },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      placeholder="Date Time"
      value={value}
      sx={{ ml: 0, width: 400, mt: 1 }}
      onClick={onClick}
      ref={ref}
    />
  ));

  const handleImage = (id) => {
    document.getElementById(id).click();
  };

  return (
    <>
      <Modal
        open={openEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <MDBox
            bgColor="info"
            p={3}
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="lg"
            sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
          >
            <ModalTitle
              title={`Update ${
                safetyCard?.cardType
                  ? `${safetyCard?.cardType.charAt(0).toUpperCase()}${safetyCard?.cardType.slice(
                      1
                    )}`
                  : ""
              } Card`}
              color="white"
            />
            <Icon
              sx={{ cursor: "pointer", color: "beige" }}
              fontSize="medium"
              onClick={handleEditClose}
            >
              {Icons.CROSS}
            </Icon>
          </MDBox>
          {form.length > 0 && Object.keys(safetyCard).length > 0 ? (
            <MDBox>
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
                {form
                  .filter((item) => item.isDefaultVisible)
                  .map((item, index) => (
                    <MDBox mb={1} key={item?.id}>
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
                          }}
                        >
                          {item.IsRequired ? `${item.title}*` : item.title}
                        </MDTypography>

                        {item.type === "text" ? (
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
                            disabled={!item.isActive}
                            value={
                              safetyCard?.[item.id] ||
                              safetyCard?.dynamicFields.filter(
                                (val) => val?.fieldId === item?.questionId
                              )[0]?.value
                            }
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                e.target.value,
                                item.questionId ? item.questionId : item.id
                              )
                            }
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id]}
                            FormHelperTextProps={{
                              sx: { marginLeft: 0, marginTop: 1, color: "red" },
                            }}
                          />
                        ) : null}

                        {item.type === "options" &&
                          item.parentFieldId === "" &&
                          (() => {
                            const value =
                              (typeof safetyCard?.[item.id] === "object"
                                ? safetyCard?.[item.id].title
                                : safetyCard?.[item.id]) ||
                              safetyCard?.dynamicFields.filter(
                                (val) => val?.fieldId === item?.questionId
                              )[0]?.value;

                            return (
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
                                <InputLabel id="demo-select-small">{item.hint}</InputLabel>
                                <Select
                                  width="90%"
                                  value={value || ""}
                                  onChange={(e) => {
                                    if (item?.hasChildField) {
                                      const prevVal = item.options.find(
                                        (opt) =>
                                          opt.id === safetyCard[item.id].id ||
                                          opt.id === safetyCard[item.id]
                                      );
                                      const currentVal = item.options.find(
                                        (opt) => opt.id === e.target.value
                                      );
                                      updateFormField(
                                        prevVal.dependentFieldIds,
                                        currentVal.dependentFieldIds
                                      );
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
                                  disabled={!item.isActive}
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
                                          {val?.title || selected}
                                        </MDTypography>
                                      </MDBox>
                                    );
                                  }}
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
                                  {item.options.map((val) => (
                                    <MenuItem
                                      value={val.id}
                                      id={val.id}
                                      sx={{ display: "flex" }}
                                      key={val.id}
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
                                        id={val.id}
                                        variant="caption"
                                        sx={{
                                          textTransform: "capitalize",
                                          fontSize: pxToRem(16),
                                          fontWeight: 400,
                                          color: "#667085",
                                          display: "flex",
                                        }}
                                      >
                                        {val.title}
                                      </MDTypography>
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText sx={{ marginLeft: 0 }}>
                                  {errors[item.id]}
                                </FormHelperText>
                              </FormControl>
                            );
                          })()}

                        {(item.type === "options" || item.type === "autocomplete") &&
                          item.parentFieldId !== "" &&
                          (() => {
                            const parentField = form?.find((val) => val.id === item.parentFieldId);
                            const type = parentField?.options.find(
                              (element) =>
                                element.id === safetyCard[item.parentFieldId] ||
                                element.id === safetyCard[item.parentFieldId]?.id
                            )?.isDefault;
                            const selectedValue = item.options.find(
                              (val) =>
                                val.id === safetyCard[item.id] || val.id === safetyCard[item.id]?.id
                            );
                            const currentValue =
                              typeof selectedValue === "object"
                                ? selectedValue?.title || selectedValue
                                : selectedValue || "";
                            const options = type
                              ? item.options
                                  .filter((val) => val?.isDefault)
                                  .map((val) => val?.title || "")
                              : item.options
                                  .filter((val) =>
                                    val.isVisibleForOptions.includes(
                                      safetyCard[item.parentFieldId].id ||
                                        safetyCard[item.parentFieldId]
                                    )
                                  )
                                  .map((val) => val?.title || "");

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
                                value={currentValue || safetyCard[item.id]?.title || ""}
                                freeSolo={type}
                                options={options || item.options}
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
                                disabled={!item.isActive}
                                renderInput={(params) => (
                                  <MDInput
                                    {...params}
                                    label={item.hint}
                                    error={Boolean(errors[item.id])}
                                    helperText={errors[item.id]}
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
                              />
                            );
                          })()}

                        {item.type === "boolean" ? (
                          <MDBox
                            sx={{ width: 400, mt: 1, mr: 3.2 }}
                            display="flex"
                            justifyContent="start"
                          >
                            <Switch
                              defaultChecked={
                                safetyCard?.[item.id] ||
                                safetyCard.dynamicFields.filter(
                                  (val) => val.fieldId === item?.questionId
                                )[0]?.value[0] === "true"
                              }
                              disabled={item.isActive === false}
                              onChange={(e) =>
                                handleBooleanField(item.title, item.questionId, e.target.checked)
                              }
                            />
                          </MDBox>
                        ) : null}
                        {item.type === "checkbox" ? (
                          <MDBox sx={{ width: 400, mr: 2 }} display="flex" justifyContent="start">
                            <FormGroup>
                              {item.options.map((val) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      defaultChecked={
                                        safetyCard?.[item.id] ||
                                        safetyCard.dynamicFields
                                          .filter(
                                            (element) => element.fieldId === item?.questionId
                                          )[0]
                                          ?.value?.includes(val.title)
                                      }
                                      disabled={item.isActive === false}
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
                                  label={val?.title}
                                  key={val?.title}
                                />
                              ))}
                            </FormGroup>
                          </MDBox>
                        ) : null}
                        {item.type === "datetime" ? (
                          <MDBox
                            sx={{ width: 400, mr: 2, zIndex: 9999 }}
                            display="flex"
                            justifyContent="start"
                          >
                            <ReactDatePicker
                              selected={
                                (safetyCard?.[item.id] &&
                                  moment(safetyCard?.[item.id]?.split(".")[0]).toDate()) ||
                                (safetyCard?.dynamicFields?.filter(
                                  (val) => val?.fieldId === item?.questionId
                                ).length > 0 &&
                                  moment(
                                    safetyCard?.dynamicFields?.filter(
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
                              customInput={<ExampleCustomInput item={item} />}
                              showTimeSelect
                              dateFormat={defaultData.REACTDATETIMEPICKER_24_HOURS_FORMAT}
                              timeFormat="HH:mm"
                            />
                          </MDBox>
                        ) : null}
                        {item.type === "number" ? (
                          <MDBox
                            sx={{ width: 400, mt: 1, mr: 2 }}
                            display="flex"
                            justifyContent="start"
                          >
                            <MDInput
                              sx={{
                                width: 400,
                              }}
                              type="number"
                              placeholder={item.hint}
                              id={item.id}
                              name={item.id}
                              disabled={item.isActive === false}
                              value={safetyCard[item.id]}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              defaultValue={
                                safetyCard[item.id] ||
                                safetyCard.dynamicFields.filter(
                                  (val) => val.fieldId === item?.questionId
                                )[0]?.value
                              }
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
                        {item.type === "slider" ? (
                          <MDBox
                            sx={{ width: 400, mt: 1, mr: 2 }}
                            display="flex"
                            justifyContent="start"
                          >
                            <Slider
                              id={item.id}
                              name={item.id}
                              aria-label="Default"
                              value={
                                safetyCard[item.id] ||
                                safetyCard.dynamicFields.filter(
                                  (val) => val.fieldId === item?.questionId
                                )[0]?.value[0]
                              }
                              valueLabelDisplay="auto"
                              min={item?.range?.min}
                              disabled={item.isActive === false}
                              max={item?.range?.max}
                              step={item.range.max / 10}
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
                        {item.type === "date" ? (
                          <MDBox
                            sx={{ width: 400, mr: 2, zIndex: 9999 - index }}
                            display="flex"
                            justifyContent="start"
                          >
                            <ReactDatePicker
                              selected={
                                (safetyCard?.[item.id] && moment(safetyCard?.[item.id]).toDate()) ||
                                (safetyCard?.dynamicFields?.filter(
                                  (val) => val?.fieldId === item?.questionId
                                ).length > 0 &&
                                  moment(
                                    safetyCard?.dynamicFields?.filter(
                                      (val) => val?.fieldId === item?.questionId
                                    )?.[0]?.value[0]
                                  ).toDate()) ||
                                ""
                              }
                              onChange={(date) =>
                                handleChange(
                                  item.id,
                                  moment(date).format(defaultData.DATABSE_DATE_FORMAT),
                                  item.questionId ? item.questionId : item.id
                                )
                              }
                              customInput={<ExampleCustomInput item={item} />}
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
                              width: 642,
                              mb: 1,
                              mt: 1,
                              ml: 1,
                              backgroundColor: "#f9f9fa",
                              "& .MuiInputBase-input": {
                                fontSize: "16px",
                              },
                            }}
                            multiline
                            autoComplete="off"
                            inputProps={{
                              style: { textTransform: "capitalize", flex: "1", minHeight: "4em" },
                            }}
                            id={item.id}
                            name={item.id}
                            value={safetyCard[item.id]}
                            placeholder={`Please Enter ${item.title}`}
                            disabled={item.isActive === false}
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
                              mr: "15px",
                            }}
                          >
                            {safetyCard?.[item.id]
                              ? `${safetyCard?.[item.id].length}/3000`
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
                                key={img?.preview || img}
                                src={img?.preview || img}
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
                                  onClick={() => {
                                    handleImageFullView(img?.preview || img, i);
                                  }}
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
                                  {/* {Icons.CROSS} */}
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
                    color="info"
                    onClick={updateSafetycard}
                    style={{ textTransform: "none", boxShadow: "none" }}
                  >
                    {loading ? "Updating..." : "Update"}
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox py={5} display="flex" justifyContent="center" alignItems="center">
              <CircularProgress color="info" />
            </MDBox>
          )}
        </MDBox>
      </Modal>
      <FullScreenImageComponent
        fullScreenImage={fullScreenImage}
        handleCloseFullView={handleCloseFullView}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        image={image}
        src={image[fullScreenImageIndex]}
      />
    </>
  );
}

export default updateSafetyCard;
