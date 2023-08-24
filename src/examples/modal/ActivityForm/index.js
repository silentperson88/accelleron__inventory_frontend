/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Grid, Icon, Modal } from "@mui/material";
import ReactDatePicker from "react-datepicker";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ModalTitle from "examples/NewDesign/ModalTitle";

import Constants, { Icons, defaultData } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import style from "assets/style/Modal";

import {
  createShiftActivityThunk,
  updateShiftActivityThunk,
  shiftActivityListThunk,
} from "redux/Thunks/DalShift";
import { openSnackbar } from "redux/Slice/Notification";
import ConfigDropdown from "components/Dropdown/ConfigDropdown";
import FormTextArea from "components/Form/FTextArea";
import DateTime from "components/DateTime/DateTime";
import FTextField from "components/Form/FTextField";

function activityForm({
  open,
  setOpen,
  currentShift,
  title,
  selectedCardId,
  activityCardData,
  setActivityDatas,
  isDefaultShift,
}) {
  const requiredList = [
    "project",
    "location",
    "subject",
    "category",
    "type",
    "time",
    "severity",
    "likelihood",
    "actionsTaken",
    "statusUpdate",
    "comments",
    "cable",
    "endTime",
    "activity",
  ];
  const [activity, setActivity] = useState({
    dynamicFields: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const ConfigData = useSelector((state) => state.config);

  const handleActivityClose = () => {
    setOpen(false);
    setErrors("");
  };
  useEffect(() => {
    if (open) {
      setActivity({ ...activityCardData });
    }
  }, [open, activityCardData]);

  const validate = () => {
    const newErrors = {};

    if (ConfigData?.screens?.[7]?.screensInfo?.properties) {
      ConfigData.screens[7].screensInfo.properties.forEach((item) => {
        if (item.IsRequired) {
          const itemValue = activity?.[item.id];
          const dynamicField = activity?.dynamicFields?.find(
            (val) => val?.title.replace(/\s/g, "") === item.id
          );

          if (!item.questionId && !itemValue) {
            newErrors[item.id] = "Required";
          } else if (item.questionId && !dynamicField) {
            newErrors[item.id] = "Required";
          } else if (
            !item.questionId &&
            typeof itemValue === "string" &&
            itemValue.trimStart() === ""
          ) {
            newErrors[item.id] = "Invalid value";
          } else if (
            !item.questionId &&
            item.type === "options" &&
            (!itemValue || itemValue.length === 0)
          ) {
            newErrors[item.id] = "Required";
          } else if (item.questionId && dynamicField?.value[0]?.trimStart() === "") {
            newErrors[item.id] = "Invalid value";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.values(newErrors).filter((val) => val !== "").length === 0;
  };

  const handleChange = (name, value, id) => {
    const temp = activity;
    if (!isDefaultShift && !requiredList.includes(name)) {
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
    } else if (!isDefaultShift && name in temp && value === "") {
      delete temp[name];
    } else {
      temp[name] = value;
    }

    ConfigData.screens?.[7].screensInfo?.properties.forEach((item) => {
      // remove child field when parent field is changed
      if (item?.parentFieldId === name) {
        delete temp?.[item?.id];
      }
    });

    setActivity({ ...temp });
  };

  const createActivity = async () => {
    setLoading(true);

    const val = validate();
    if (val) {
      const body = { ...activity, shift: currentShift[Constants.MONGOOSE_ID] };
      const tempBody = { ...activity };
      Object.entries(tempBody).forEach(([key]) => {
        if (typeof tempBody[key] === "string") {
          tempBody[key] = tempBody[key].trim();
        }
      });
      const res = await dispatch(createShiftActivityThunk(body));
      if (res.payload.status === 201) {
        setOpen(false);
        const tempList = await dispatch(
          shiftActivityListThunk(currentShift[Constants.MONGOOSE_ID])
        );
        setActivityDatas((prevState) => ({
          ...prevState,
          activityList: tempList.payload.data.data,
        }));
        await dispatch(
          openSnackbar({ message: res.payload.data.message, notificationType: "success" })
        );
      } else {
        dispatch(
          openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
        );
        setOpen(false);
      }
    }
    setLoading(false);
  };

  const updateActivity = async () => {
    const isValid = validate();
    if (isValid) {
      setLoading(true);
      const tempBody = { ...activity };
      const body = {};
      Object.entries(tempBody).forEach(([key, value]) => {
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          body[key] = trimmedValue;
        } else if (typeof value === "object") {
          body[key] = value.id;
        } else if (value !== null) {
          body[key] = value;
        }
      });

      const data = {
        body,
        actvityId: selectedCardId,
      };
      const res = await dispatch(updateShiftActivityThunk(data));
      if (res.payload.status === 200) {
        setOpen(false);
        const tempList = await dispatch(
          shiftActivityListThunk(currentShift[Constants.MONGOOSE_ID])
        );
        setActivityDatas((prevState) => ({
          ...prevState,
          activityList: tempList.payload.data.data,
        }));
        await dispatch(
          openSnackbar({ message: res.payload.data.message, notificationType: "success" })
        );
      } else {
        dispatch(
          openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
        );
      }
      setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style} key="main">
        <MDBox
          key="box"
          bgColor="info"
          p={3}
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
            onClick={handleActivityClose}
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
            {Object.keys(ConfigData.screens?.[7].screensInfo).length > 0
              ? ConfigData.screens?.[7].screensInfo.properties.map((item) => {
                  switch (item.type) {
                    case "options":
                      return (
                        <Grid item xs={6} key={item.id}>
                          {isDefaultShift ? (
                            <FTextField
                              label={item?.IsRequired ? `${item.title}*` : item.title}
                              placeholder="Enter Functions"
                              name={item?.id}
                              id={item?.id}
                              type="text"
                              error={Boolean(errors[item.id])}
                              helperText={errors[item.id]}
                              value={activity[item.id] || ""}
                              handleChange={(e) => handleChange(item?.id, e.target.value, item?.id)}
                            />
                          ) : (
                            (() => {
                              const menu = item.options
                                .filter(
                                  (val) =>
                                    val?.isVisibleForOptions?.includes(
                                      activity?.[item.parentFieldId]?.id ||
                                        activity?.[item.parentFieldId]
                                    ) ||
                                    val?.isVisibleForOptions?.includes(
                                      currentShift?.projects?.[0]?.[Constants.MONGOOSE_ID]
                                    )
                                )
                                .map((val) => ({
                                  [Constants.MONGOOSE_ID]: val?.id,
                                  title: val?.title,
                                }));

                              const defaultValue =
                                selectedCardId &&
                                menu.filter(
                                  (val) =>
                                    val[Constants.MONGOOSE_ID] === activity?.[item.id]?.id ||
                                    val[Constants.MONGOOSE_ID] === activity?.[item.id]
                                ).length;

                              let tempValue = activity?.[item.id];
                              if (
                                selectedCardId &&
                                defaultValue > 0 &&
                                typeof activity?.[item.id] === "object"
                              ) {
                                tempValue = activity?.[item.id]?.id;
                              } else if (
                                selectedCardId &&
                                defaultValue > 0 &&
                                typeof activity?.[item.id] === "string"
                              ) {
                                tempValue = activity?.[item.id];
                              } else if (selectedCardId && defaultValue === 0) {
                                tempValue = activity?.[item.id]?.title;
                              }

                              return (
                                <ConfigDropdown
                                  label={item?.IsRequired ? `${item.title}*` : item.title}
                                  name={item?.id}
                                  id={item?.id}
                                  value={tempValue || ""}
                                  handleChange={handleChange}
                                  menu={menu}
                                  error={errors && errors[item.id]}
                                  helperText={errors && errors[item.id]}
                                  minWidth={pxToRem(317)}
                                />
                              );
                            })()
                          )}
                        </Grid>
                      );
                    case "datetime":
                      return (
                        <Grid item xs={6} key={item.id}>
                          <MDBox
                            sx={{ minWidth: "100%", mt: 0, mr: 1, zIndex: 9999 }}
                            display="flex"
                          >
                            <ReactDatePicker
                              selected={
                                (activity?.[item.id] &&
                                  moment(activity?.[item.id]?.split(".")[0]).toDate()) ||
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
                              customInput={
                                <DateTime
                                  item={item}
                                  errors={errors[item.id]}
                                  label={`${item?.title}${item?.IsRequired ? "*" : ""}`}
                                  width={344}
                                />
                              }
                              minDate={moment(currentShift?.startDate).toDate()}
                              minTime={
                                activity?.[item.id] &&
                                moment(activity?.[item.id]?.split(".")[0]).isSame(
                                  moment(currentShift?.startDate),
                                  "date"
                                )
                                  ? moment(currentShift?.startDate).add(1, "minute").toDate()
                                  : new Date().setHours(0, 0, 0)
                              }
                              maxTime={new Date().setHours(23, 59, 0)}
                              showTimeSelect
                              dateFormat={defaultData.REACTDATETIMEPICKER_24_HOURS_FORMAT}
                              timeIntervals={5}
                              timeFormat="HH:mm"
                            />
                          </MDBox>
                        </Grid>
                      );
                    case "textarea":
                      return (
                        <Grid item xs={12} key={item.id}>
                          <FormTextArea
                            title={item?.title}
                            id={item.id}
                            name={item.id}
                            placeholder={`Please Enter ${item.title}`}
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id]}
                            defaultValue={selectedCardId ? activityCardData.comments : null}
                            handleChange={(e) =>
                              handleChange(
                                item.id,
                                e.target.value,
                                item.questionId ? item.questionId : item.id
                              )
                            }
                          />
                        </Grid>
                      );
                    default:
                      return null;
                  }
                })
              : null}
          </Grid>
        </MDBox>
        <MDBox px={2} mb={2} mr={1}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item xs={0}>
              {selectedCardId ? (
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={updateActivity}
                  style={{ textTransform: "none", boxShadow: "none" }}
                >
                  {loading ? "Updating..." : "Update"}
                </MDButton>
              ) : (
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={createActivity}
                  style={{ textTransform: "none", boxShadow: "none" }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </MDButton>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default activityForm;
