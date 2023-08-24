/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { forwardRef, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Slider,
  Switch,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import ModalTitle from "examples/NewDesign/ModalTitle";
import { useDispatch, useSelector } from "react-redux";
import style from "assets/style/Modal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { openSnackbar } from "redux/Slice/Notification";
import { createShiftThunk } from "redux/Thunks/DalShift";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Constants, { Icons, defaultData } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import FormControlErrorStyles from "assets/style/Component";
import CustomCheckbox from "components/CustomCheckbox/CustomCheckbox";

function shiftForm({ openShiftModal, setOpenShiftModal, handleFilter, activeUsers }) {
  const [form, setForm] = useState({});
  const [isDefaultShift, setIsDefaultShift] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shiftCard, setShiftCard] = useState({});
  const [errors, setErrors] = useState({});
  const requiredList = [
    "project",
    "location",
    "subject",
    "category",
    "type",
    "time",
    "severity",
    "likelihood",
    "description",
    "actionsTaken",
    "statusUpdate",
    "status",
    "team",
    "startDate",
    "member",
    "defaultProject",
  ];

  const dispatch = useDispatch();
  const ConfigData = useSelector((state) => state.config);

  useEffect(() => {
    (async () => {
      if (openShiftModal) setForm(ConfigData.screens?.[5].screensInfo);
    })();
  }, [ConfigData, openShiftModal]);

  const handleEditClose = () => {
    setShiftCard([]);
    setErrors([]);
    setOpenShiftModal(false);
    setForm({});
  };
  const validate = () => {
    const newErrors = {};

    if (Object.keys(form).length > 0) {
      form.properties.forEach((item) => {
        if (item.IsRequired && !item.questionId && !shiftCard[item.id]) {
          newErrors[item.id] = `required`;
        } else if (
          item.IsRequired &&
          item.questionId &&
          !shiftCard?.dynamicFields?.filter((val) => val?.title.replace(/\s/g, "") === item.id)
            .length > 0
        ) {
          newErrors[item.id] = `required`;
        }
        if (
          item.IsRequired &&
          !item.questionId &&
          typeof shiftCard[item.id] === "string" &&
          shiftCard[item.id]?.trim() === ""
        ) {
          newErrors[item.id] = "Invalid value";
        } else if (
          item.IsRequired &&
          !item.questionId &&
          item.type === "multi-options" &&
          shiftCard[item.id]?.length === 0
        ) {
          newErrors[item.id] = "required";
        }
        if (
          item.IsRequired &&
          item.questionId &&
          shiftCard?.dynamicFields
            ?.filter((val) => val?.title.replace(/\s/g, "") === item.id)?.[0]
            ?.value[0]?.trim() === ""
        ) {
          newErrors[item.id] = "Invalid value";
        }
      });
    }

    setErrors(newErrors);
    return Object.values(newErrors).filter((val) => val !== "").length === 0;
  };

  const handleChange = (name, value, id) => {
    const temp = shiftCard;
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
    setShiftCard({ ...temp });
  };

  const updateFormField = (idArray = []) => {
    if (idArray.length > 0) {
      const temp = JSON.parse(JSON.stringify(form));
      const t = [];
      temp.properties.forEach((item, i) => {
        const index = idArray.findIndex((val) => val === item?.id);
        if (index !== -1) {
          temp.properties[i].isDefaultVisible = true;
          temp.properties[i].IsRequired = true;
          t.push(item);
        }
      });
      setIsDefaultShift(true);
      setForm(temp);
    } else {
      setIsDefaultShift(false);
      setForm(ConfigData.screens?.[5].screensInfo);
    }
  };

  const handleBoolean = (name, id, value) => {
    const temp = shiftCard;
    const index = temp.dynamicFields.findIndex((val) => val.fieldId === id);
    if (index >= 0) {
      temp.dynamicFields[index].value = [value.toString()];
      setShiftCard({ ...temp });
    } else {
      const dynamicFieldValueObject = {
        title: name,
        value: [value.toString()],
        fieldId: id,
      };
      temp.dynamicFields.push(dynamicFieldValueObject);
      setShiftCard({ ...temp });
    }
    temp[name] = value;
    setShiftCard({ ...temp });
  };

  const handleCheckbox = (name, id, value, checked) => {
    const temp = shiftCard;
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
    setShiftCard({ ...temp });
  };

  useEffect(() => {
    if (openShiftModal) {
      const temp = {};
      temp.duration = 0;
      temp.endDate = "";
      setShiftCard({ ...temp });
    }
  }, [openShiftModal]);

  const createShift = async () => {
    setLoading(true);
    const val = validate();
    if (val) {
      const tempBody = { ...shiftCard };
      Object.entries(tempBody).forEach(([key]) => {
        if (typeof tempBody[key] === "string") {
          tempBody[key] = tempBody[key].trim();
        }
      });
      const res = await dispatch(createShiftThunk(shiftCard));
      if (res.payload.status === 200) {
        setOpenShiftModal(false);
        handleFilter();
        await dispatch(
          openSnackbar({
            message: Constants.SHIFT_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else {
        await dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    }
    setLoading(false);
  };

  const dropdownIcon = () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />;

  const ExampleCustomInput = forwardRef(({ value, onClick, item }, ref) => (
    <MDInput
      error={Boolean(errors[item.id])}
      helperText={errors[item.id]}
      id={item.id}
      FormHelperTextProps={{
        sx: { marginLeft: 1, color: "red" },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      placeholder={item?.hint}
      value={value}
      sx={{ ml: 0, width: 400 }}
      onClick={onClick}
      ref={ref}
    />
  ));

  return (
    <Modal
      open={openShiftModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox
          bgColor="info"
          p={3}
          mb={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="lg"
          sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
        >
          <ModalTitle title="Shift Card" color="white" />
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
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {Object.keys(form).length > 0
            ? form.properties
                .filter((item) => item.isDefaultVisible)
                .map((item) => (
                  <MDBox mb={1} mt={2} key={item.title}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography
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
                            mr: 1,
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
                          value={shiftCard[item.id]}
                          formhelpertextprops={{
                            sx: { marginLeft: 0 },
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
                      {item.type === "options" && item.parentFieldId === "" && (
                        <FormControl
                          sx={{
                            mt: 1,
                            mr: 1,
                            minWidth: 120,
                            width: 400,
                            ...FormControlErrorStyles,
                          }}
                          error={Boolean(errors[item.id])}
                          formhelpertextprops={{
                            sx: { marginLeft: 0 },
                          }}
                        >
                          <InputLabel id={item.id}>{item.hint}</InputLabel>
                          <Select
                            width="90%"
                            onChange={(e) => {
                              if (item?.hasChildField) {
                                const val = item.options.findIndex(
                                  (opt) => opt.id === e.target.value
                                );
                                if (val !== -1) {
                                  updateFormField(item?.options[val]?.dependentFieldIds);
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
                            label={item.id}
                            id={item.questionId ? item.questionId : item.id}
                            name={item.id}
                            value={shiftCard[item.id] || ""}
                            sx={{
                              color: "#667085",
                              backgroundColor: "black",
                              paddingY: "0.5rem",
                              paddingX: "0.5rem",
                              fontSize: pxToRem(16),
                              fontWeight: 400,
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
                            <MenuItem disabled value="">
                              {item.hint}
                            </MenuItem>
                            {item.options
                              .filter(
                                (val) =>
                                  item.parentFieldId === "" ||
                                  val.isVisibleForOptions.includes(shiftCard[item.parentFieldId])
                              )
                              .map((val) => (
                                <MenuItem key={val.id} value={val.id}>
                                  <MDTypography
                                    variant="subtitle1"
                                    sx={{
                                      textTransform: "capitalize",
                                      fontSize: pxToRem(16),
                                      fontWeight: 400,
                                      color: "#667085",
                                    }}
                                  >
                                    {val.title}
                                  </MDTypography>
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText sx={{ marginLeft: 0 }}>{errors[item.id]}</FormHelperText>
                        </FormControl>
                      )}

                      {item.type === "options" &&
                        item.parentFieldId !== "" &&
                        (() => {
                          const parentField = form?.properties.find(
                            (val) => val.id === item.parentFieldId
                          );
                          const type = parentField?.options.find(
                            (element) => element.id === shiftCard[item.parentFieldId]
                          )?.isDefault;

                          const selectedValue = item.options.find(
                            (val) => val.id === shiftCard[item.id]
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
                                    val.isVisibleForOptions.includes(shiftCard[item.parentFieldId])
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
                                mr: 1,
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
                            />
                          );
                        })()}

                      {item.type === "multi-options" &&
                        item.parentFieldId !== "" &&
                        (() => {
                          const menu = isDefaultShift
                            ? activeUsers
                            : item.options.filter((val) =>
                                val.isVisibleForOptions.includes(shiftCard[item.parentFieldId])
                              );

                          return (
                            <FormControl
                              sx={{
                                mt: 1,
                                mr: 1,
                                minWidth: 120,
                                width: 400,
                                ...FormControlErrorStyles,
                              }}
                              error={Boolean(errors[item.id])}
                              formhelpertextprops={{
                                sx: { marginLeft: 0 },
                              }}
                            >
                              <InputLabel id={item.id}>{item.id}</InputLabel>
                              <Select
                                width="90%"
                                onChange={(e) => {
                                  handleChange(
                                    item.id,
                                    e.target.value,
                                    item.questionId ? item.questionId : item.id
                                  );
                                }}
                                multiple
                                IconComponent={dropdownIcon}
                                labelId={item.id}
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
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {menu
                                      .filter((val) =>
                                        selected.some(
                                          (option) =>
                                            option === val.id ||
                                            option === val[Constants.MONGOOSE_ID]
                                        )
                                      )
                                      .map((value) => (
                                        <Chip
                                          key={value.id || value[Constants.MONGOOSE_ID]}
                                          label={
                                            value.title || `${value.firstName} ${value.lastName}`
                                          }
                                        />
                                      ))}
                                  </Box>
                                )}
                                value={shiftCard[item.id] || []}
                              >
                                {menu.map((val) => (
                                  <MenuItem
                                    key={val.id || val[Constants.MONGOOSE_ID]}
                                    value={val.id || val[Constants.MONGOOSE_ID]}
                                    sx={{ p: 0 }}
                                  >
                                    <CustomCheckbox
                                      name={val.id}
                                      checked={
                                        shiftCard?.[item.id]
                                          ? shiftCard?.[item.id].includes(
                                              val.id || val[Constants.MONGOOSE_ID]
                                            )
                                          : false
                                      }
                                    />
                                    <MDTypography
                                      variant="subtitle1"
                                      sx={{
                                        ml: 1,
                                        textTransform: "capitalize",
                                        fontSize: pxToRem(16),
                                        fontWeight: 400,
                                        color: "#667085",
                                      }}
                                    >
                                      {val.title || `${val.firstName} ${val.lastName}`}
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

                      {item.type === "boolean" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 1 }}
                          display="flex"
                          justifyContent="start"
                          flexDirection="column"
                        >
                          <Switch
                            error={Boolean(errors[item.id])}
                            onChange={(e) =>
                              handleBoolean(item.title, item.questionId, e.target.checked)
                            }
                          />
                          <FormHelperText sx={{ marginLeft: 0, color: "#9D0202" }}>
                            {errors[item.id]}
                          </FormHelperText>
                        </MDBox>
                      ) : null}
                      {item.type === "checkbox" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 1 }}
                          display="flex"
                          justifyContent="start"
                        >
                          <FormGroup>
                            {item.options.map((val) => (
                              <FormControlLabel
                                error={Boolean(errors[item.id])}
                                formhelpertextprops={{
                                  sx: { marginLeft: 0 },
                                }}
                                sx={{ textTransform: "capitalize" }}
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
                            <FormHelperText sx={{ marginLeft: 0, color: "#9D0202" }}>
                              {errors[item.id]}
                            </FormHelperText>
                          </FormGroup>
                        </MDBox>
                      ) : null}

                      {item.type === "datetime" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 1, zIndex: 9999 }}
                          display="flex"
                          justifyContent="start"
                        >
                          <ReactDatePicker
                            selected={
                              shiftCard?.[item.id] ? moment(shiftCard?.[item.id]).toDate() : ""
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
                            timeIntervals={5}
                          />
                        </MDBox>
                      ) : null}
                      {item.type === "number" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 1 }}
                          display="flex"
                          justifyContent="start"
                        >
                          <MDInput
                            fullWidth
                            type="number"
                            id={item.id}
                            name={item.id}
                            value={shiftCard[item.id]}
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id]}
                            formhelpertextprops={{
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
                      {item.type === "slider" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 1 }}
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
                            error={Boolean(errors[item.id])}
                            step={2}
                            fullWidth
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                e.target.value,
                                item.questionId ? item.questionId : item.id
                              )
                            }
                          />
                          <FormHelperText sx={{ marginLeft: 0, color: "#9D0202" }}>
                            {errors[item.id]}
                          </FormHelperText>
                        </MDBox>
                      ) : null}
                      {item.type === "date" ? (
                        <MDBox
                          sx={{ width: 400, mt: 1, mr: 1 }}
                          display="flex"
                          justifyContent="start"
                        >
                          <MDInput
                            fullWidth
                            label="date"
                            type="date"
                            id={item.id}
                            name={item.id}
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id]}
                            formhelpertextprops={{
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
                    </MDBox>
                    {item.type === "textarea" ? (
                      <MDInput
                        sx={{ width: 660, mt: 1 }}
                        multiline
                        rows={3}
                        id={item.id}
                        name={item.id}
                        error={Boolean(errors[item.id])}
                        helperText={errors[item.id]}
                        formhelpertextprops={{
                          sx: { marginLeft: 0 },
                        }}
                        value={shiftCard[item.id]}
                        placeholder={`Please Enter ${item.title}`}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            e.target.value,
                            item.questionId ? item.questionId : item.id
                          )
                        }
                      />
                    ) : null}
                  </MDBox>
                ))
            : null}
        </MDBox>
        <MDBox px={2} mb={2}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item xs={2}>
              <MDButton
                variant="contained"
                color="info"
                onClick={createShift}
                style={{ textTransform: "none", boxShadow: "none" }}
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

export default shiftForm;
