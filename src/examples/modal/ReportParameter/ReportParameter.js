import React, { useEffect, useState } from "react";
import style from "assets/style/Modal";

import {
  Icon,
  Modal,
  FormControl,
  MenuItem,
  Select,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import MDButton from "components/MDButton";
import { useDispatch } from "react-redux";
import ModalTitle from "examples/NewDesign/ModalTitle";
import pxToRem from "assets/theme/functions/pxToRem";
import { openSnackbar } from "redux/Slice/Notification";
import MDBox from "components/MDBox";
import Constants, { Icons, Colors, ButtonTitles, FormFields } from "utils/Constants";
import { useParams } from "react-router-dom";
import { createParamter, updateParamter } from "redux/Thunks/Report";
import MDTypography from "components/MDTypography";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import Validator from "utils/Validations";

function parameterModal({ open, handleClose, title, fetchReportTypeById, parameterData }) {
  const dispatch = useDispatch();
  const parameterType = [
    { value: FormFields.DROPDOWN_VALUE, label: FormFields.DROPDOWN_LABEL },
    { value: FormFields.SHORT_ANSWER_VALUE, label: FormFields.SHORT_ANSWER_LABEL },
    { value: FormFields.DATE_VALUE, label: FormFields.DATE_LABEL },
    { value: FormFields.DATE_TIME_VALUE, label: FormFields.DATE_TIME_LABEL },
    { value: FormFields.NUMBER_VALUE, label: FormFields.NUMBER_LABEL },
    { value: FormFields.SLIDER_VALUE, label: FormFields.SLIDER_LABEL },
    { value: FormFields.CHECKBOX_VALUE, label: FormFields.CHECKBOX_LABEL },
    { value: FormFields.IMAGE_VALUE, label: FormFields.IMAGE_LABEL },
    { value: FormFields.SIGNATURE_VALUE, label: FormFields.SIGNATURE_LABEL },
    { value: FormFields.BOOLEAN_VALUE, label: FormFields.BOOLEAN_LABEL },
  ];
  const [parameters, setParameters] = useState([
    {
      questionHeader: "",
      questionType: "",
      sortOrder: 0,
      duration: 0,
      measurement: "",
      description: "",
      l1: "",
      l2: "",
      l3: "",
      hasThreePhase: false,
      optionValue: [],
      isRequired: false,
      range: { min: 0, max: 1 },
      error: {},
    },
  ]);
  const [loading, setLoading] = useState({
    questionIndex: 0,
    isSubmitting: false,
  });

  const { reportType } = useParams();

  const handleParameterName = (text, i) => {
    const questionsArr = [...parameters];
    questionsArr[i].questionHeader = text;
    setParameters(questionsArr);
  };

  const handleParameterType = (value, i) => {
    const questionsArr = [...parameters];
    let questionTypeObj = {};

    switch (value) {
      case "options":
        questionTypeObj = {
          questionType: value,
          optionValue: [{ optionText: "", error: "" }],
        };
        break;
      case "text":
        questionTypeObj = { questionType: value };
        break;
      case "date":
        questionTypeObj = { questionType: value };
        break;
      case "datetime":
        questionTypeObj = { questionType: value };
        break;
      case "number":
        questionTypeObj = { questionType: value };
        break;
      case "slider":
        questionTypeObj = {
          questionType: value,
          range: { min: 0, max: 1 },
        };
        break;
      case "checkbox":
        questionTypeObj = {
          questionType: value,
          optionValue: [{ optionText: "", error: "" }],
        };
        break;
      case "boolean":
        questionTypeObj = { questionType: value };
        break;
      case "image":
      case "signature":
        questionTypeObj = { questionType: value };
        break;
      default:
        break;
    }

    questionsArr[i] = { ...questionsArr[i], ...questionTypeObj, isRequired: false };
    setParameters(questionsArr);
  };

  useEffect(() => {
    if (parameterData.type === "update") {
      const questionsArr = JSON.parse(JSON.stringify(parameters));
      const optionValueCopy = JSON.parse(JSON.stringify(parameterData?.body?.optionValue));
      questionsArr[0] = {
        questionHeader: parameterData?.body?.name,
        questionType: parameterData?.body?.type,
        sortOrder: parameterData?.body?.sortOrder,
        duration: parameterData?.body?.duration,
        measurement: parameterData?.body?.measurement,
        description: parameterData?.body?.description,
        l1: parameterData?.body?.l1,
        l2: parameterData?.body?.l2,
        l3: parameterData?.body?.l3,
        hasThreePhase: parameterData?.body?.hasThreePhase,
        optionValue: optionValueCopy,
        isRequired: parameterData?.body?.isRequired,
        range: parameterData?.body?.range,
        error: {},
      };
      questionsArr[0].optionValue.forEach((_, j) => {
        questionsArr[0].optionValue[j].error = "";
      });
      setParameters(questionsArr);
    }
  }, [parameterData]);

  const handleSortOrder = (value, i) => {
    const questionsArr = [...parameters];
    questionsArr[i].sortOrder = value;
    setParameters(questionsArr);
  };

  const handleDuration = (value, i) => {
    if (value < 0) return;
    const questionsArr = [...parameters];
    questionsArr[i].duration = value;
    setParameters(questionsArr);
  };

  const handleMeasurement = (value, i) => {
    const questionsArr = [...parameters];
    questionsArr[i].measurement = value;
    setParameters(questionsArr);
  };

  const handleFigure = (event, i) => {
    const questionsArr = [...parameters];
    const { name, value } = event.target;
    questionsArr[i][name] = value;
    setParameters(questionsArr);
  };

  const handleHasThreePhase = (checked, i) => {
    const questionsArr = [...parameters];
    questionsArr[i].hasThreePhase = checked;
    setParameters(questionsArr);
  };

  const handleResetParameter = () => {
    const questionsArr = [...parameters];
    questionsArr[0] = {
      questionHeader: "",
      questionType: "",
      sortOrder: 0,

      weightage: 1,
      measurement: "",
      description: "",
      l1: "",
      l2: "",
      l3: "",
      hasThreePhase: false,
      optionValue: [],
      error: {},
    };
    setParameters(questionsArr);
  };

  const handleParameterValidation = (i) => {
    const questionsArr = [...parameters];
    const error = {};
    if (Validator.validate("basic", questionsArr[i].questionHeader) !== "") {
      error.questionHeader = Validator.validate("basic", questionsArr[i].questionHeader);
    }
    if (Validator.validate("basic", questionsArr[i].questionType) !== "") {
      error.questionType = Validator.validate("basic", questionsArr[i].questionType);
    }
    if (questionsArr[i].questionType === "options" || questionsArr[i].questionType === "checkbox") {
      questionsArr[i].optionValue.forEach((item, j) => {
        if (Validator.validate("basic2", item.optionText) !== "") {
          questionsArr[i].optionValue[j].error = Validator.validate("basic", item.optionText);
        }
      });
    }
    if (questionsArr[i].sortOrder === 0) {
      error.sortOrder = Constants.REQUIRED;
    }
    if (questionsArr[i].duration === 0) {
      error.duration = Constants.REQUIRED;
    }
    if (questionsArr[i].questionType === "image" || questionsArr[i].questionType === "signature") {
      if (questionsArr[i].l1 !== "" && !Validator.validate("url", questionsArr[i].l1)) {
        error.l1 = Constants.INVALID_URL;
      }
      if (questionsArr[i].l2 !== "" && !Validator.validate("url", questionsArr[i].l2)) {
        error.l2 = Constants.INVALID_URL;
      }
      if (questionsArr[i].l3 !== "" && !Validator.validate("url", questionsArr[i].l3)) {
        error.l3 = Constants.INVALID_URL;
      }
      if (Validator.validate("basic2", questionsArr[i].description) !== "") {
        error.description = Constants.REQUIRED;
      }
    }
    if (questionsArr[i].questionType === "slider") {
      if (
        questionsArr[i].range.min < 0 ||
        questionsArr[i].range.min === questionsArr[i].range.max ||
        questionsArr[i].range.min > questionsArr[i].range.max
      ) {
        questionsArr[i].error.range.min = Constants.INVALID_RANGE;
      }
      if (
        questionsArr[i].range.max < 0 ||
        questionsArr[i].range.max === questionsArr[i].range.min ||
        questionsArr[i].range.max < questionsArr[i].range.min
      ) {
        questionsArr[i].error.range.max = Constants.INVALID_RANGE;
      }
    }

    questionsArr[i].error = error;
    return questionsArr;
  };

  const handleSave = async (i) => {
    const questionsArr = handleParameterValidation(i);
    const optionsError = questionsArr[i].optionValue.filter((item) => item?.error !== "");

    if (Object.keys(questionsArr[i].error).length === 0 && optionsError.length === 0) {
      const body = {
        name: parameters[i].questionHeader.trim(),
        type: parameters[i].questionType,
        optionValue: questionsArr[i].optionValue.map((item) => {
          const temp = {
            optionText: item.optionText.trim(),
          };
          return temp;
        }),
        isRequired: parameters[i].isRequired,
        range: parameters[i].range,
        sortOrder: parseInt(parameters[i].sortOrder, 10),
        duration: parseInt(parameters[i].duration, 10),
        weightage: 1,
        measurement: parameters[i].measurement,
        description: parameters[i].description,
        l1: parameters[i].l1,
        l2: parameters[i].l2,
        l3: parameters[i].l3,
        hasThreePhase: parameters[i].hasThreePhase,
      };
      setLoading({ questionIndex: i, isSubmitting: true });
      if (parameterData.type === "new") {
        const res = await dispatch(createParamter({ reportType, body }));
        if (res.payload.status === 200) {
          dispatch(
            openSnackbar({
              message: Constants.PARAMETER_CREATE_SUCCESS,
              notificationType: "success",
            })
          );
          handleClose();
          handleResetParameter();
          fetchReportTypeById();
        } else if (res.payload.status === 400) {
          parameters[i].error = res.payload.data.message;
        }
      } else {
        const res = await dispatch(
          updateParamter({
            reportType,
            parameterId: parameterData.body?.[Constants.MONGOOSE_ID],
            body,
          })
        );
        if (res.payload.status === 200) {
          dispatch(
            openSnackbar({
              message: Constants.PARAMETER_UPDATE_SUCCESS,
              notificationType: "success",
            })
          );
          handleClose();
          handleResetParameter();
          fetchReportTypeById();
        } else if (res.payload.status === 400) {
          parameters[i].error = res.payload.data.message;
        }
      }
    } else {
      setParameters(questionsArr);
    }
    setLoading({ questionIndex: i, isSubmitting: false });
  };

  const handleAddOptions = (i) => {
    const questionsArr = [...parameters];
    questionsArr[i].optionValue.push({ optionText: "" });
    setParameters(questionsArr);
  };

  const handleDeleteOptions = (i, j) => {
    const questionsArr = [...parameters];

    questionsArr[i].optionValue.splice(j, 1);
    setParameters(questionsArr);
  };

  const handleRequired = (required, i) => {
    const questionsArr = [...parameters];

    questionsArr[i].isRequired = required;

    setParameters(questionsArr);
  };

  const handleOptionTextChange = (text, i, j) => {
    const questionsArr = [...parameters];

    questionsArr[i].optionValue[j].optionText = text;
    questionsArr[i].optionValue[j].error = "";

    setParameters(questionsArr);
  };

  const handleRangeChange = (val, i, j) => {
    const questionsArr = [...parameters];

    questionsArr[i].range[j] = parseFloat(val);

    setParameters(questionsArr);
  };

  const handleCloseFormBuilder = () => {
    handleClose();
    handleResetParameter();
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
            <ModalTitle title={title} color="white" />

            <Icon
              sx={{ cursor: "pointer", color: "beige" }}
              fontSize="medium"
              onClick={handleCloseFormBuilder}
            >
              {Icons.CROSS}
            </Icon>
          </MDBox>
          <MDBox
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            px={pxToRem(24)}
            py={pxToRem(28)}
            sx={{
              maxHeight: 500,
              overflowY: "scroll",
              "::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {parameters.map((question, i) => (
                <>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    key={question.fieldName}
                  >
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      sx={{ width: pxToRem(652), mb: pxToRem(20) }}
                    >
                      <MDTypography
                        variant="caption"
                        mb={pxToRem(6)}
                        sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                      >
                        Field Name*
                      </MDTypography>
                      <TextField
                        placeholder="Enter Field Name"
                        value={question.questionHeader}
                        error={Boolean(question.error?.questionHeader)}
                        helpertext={question.error?.questionHeader}
                        onChange={(e) => handleParameterName(e.target.value, i)}
                        InputProps={{
                          inputProps: {
                            style: { textTransform: "capitalize" },
                          },
                        }}
                        sx={{
                          "& input": {
                            fontSize: "16px",
                          },
                        }}
                      />
                    </MDBox>
                    <MDBox
                      sx={{ width: 650, mb: pxToRem(20) }}
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <FormControl
                        sx={{ minWidth: 120, width: 150, maxHeight: 200 }}
                        error={Boolean(question.error?.questionType)}
                        helpertext={question.error?.questionType}
                      >
                        <MDTypography
                          variant="caption"
                          mb={pxToRem(6)}
                          sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                        >
                          Type*
                        </MDTypography>
                        <Select
                          placeholder="Select Type"
                          sx={{ p: "0.75rem" }}
                          disabled={parameterData?.type === "update"}
                          displayEmpty
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 220,
                                opacity: 1,
                                transform: "none",
                                top: 183,
                                left: 442,
                              },
                            },
                          }}
                          IconComponent={Icons.DROPDOWN}
                          value={question.questionType || ""}
                          onChange={(e) => handleParameterType(e.target.value, i)}
                        >
                          <MenuItem disabled value="">
                            Select Type
                          </MenuItem>
                          {parameterType.map((type) => (
                            <MenuItem value={type.value} key={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{question.error?.questionType}</FormHelperText>
                      </FormControl>
                      <MDBox display="flex" flexDirection="column" sx={{ width: 150, mt: 0 }}>
                        <MDTypography
                          variant="caption"
                          mb={pxToRem(6)}
                          mt={0}
                          sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                        >
                          Sort Order*
                        </MDTypography>
                        <TextField
                          sx={{
                            "& input": {
                              fontSize: "16px",
                            },
                          }}
                          type="number"
                          value={question.sortOrder}
                          error={Boolean(question.error?.sortOrder)}
                          helpertext={question.error?.sortOrder}
                          onChange={(e) => handleSortOrder(e.target.value, i)}
                        />
                      </MDBox>
                      <MDBox display="flex" flexDirection="column" sx={{ width: 150 }}>
                        <MDTypography
                          variant="caption"
                          mb={pxToRem(6)}
                          sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                        >
                          Duration*
                        </MDTypography>
                        <TextField
                          sx={{
                            width: 150,
                            "& input": {
                              fontSize: "16px",
                            },
                          }}
                          type="number"
                          value={question.duration}
                          error={Boolean(question.error?.duration)}
                          helpertext={question.error?.duration}
                          onChange={(e) => handleDuration(e.target.value, i)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start" fontSize="medium">
                                hr
                              </InputAdornment>
                            ),
                          }}
                        />
                      </MDBox>
                      <MDBox display="flex" flexDirection="column" sx={{ width: 150 }}>
                        <MDTypography
                          variant="caption"
                          mb={pxToRem(6)}
                          sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                        >
                          Mesurement Code
                        </MDTypography>
                        <TextField
                          sx={{
                            width: 150,
                            "& input": {
                              fontSize: "16px",
                            },
                          }}
                          value={question.measurement}
                          error={Boolean(question.error?.measurement)}
                          helpertext={question.error?.measurement}
                          onChange={(e) => handleMeasurement(e.target.value, i)}
                        />
                      </MDBox>
                    </MDBox>

                    {(question.questionType === "image" ||
                      question.questionType === "signature") && (
                      <MDBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <MDBox
                          display="flex"
                          flexDirection="column"
                          sx={{ width: 652, mb: pxToRem(24) }}
                        >
                          <MDTypography
                            variant="caption"
                            mb={pxToRem(6)}
                            sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                          >
                            Description*
                          </MDTypography>
                          <TextField
                            multiline
                            rows={3}
                            name="description"
                            value={question.description}
                            error={Boolean(question.error?.description)}
                            helpertext={question.error?.description}
                            onChange={(e) => handleFigure(e, i)}
                            InputProps={{
                              inputProps: {
                                style: { textTransform: "capitalize" },
                              },
                            }}
                            placeholder="Enter description"
                          />
                        </MDBox>

                        <MDBox display="flex" justifyContent="space-between" sx={{ width: 652 }}>
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            sx={{ width: 200, mb: pxToRem(24) }}
                          >
                            <MDTypography
                              variant="caption"
                              mb={pxToRem(6)}
                              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                            >
                              L1
                            </MDTypography>

                            <TextField
                              sx={{
                                "& input": {
                                  fontSize: "16px",
                                },
                              }}
                              name="l1"
                              value={question.l1}
                              error={Boolean(question.error?.l1)}
                              helpertext={question.error?.l1}
                              onChange={(e) => handleFigure(e, i)}
                              placeholder="Enter L1"
                            />
                          </MDBox>
                          <MDBox
                            display="flex"
                            flexDirection="column"
                            sx={{ width: 200, mb: pxToRem(24) }}
                          >
                            <MDTypography
                              variant="caption"
                              mb={pxToRem(6)}
                              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                            >
                              L2
                            </MDTypography>
                            <TextField
                              sx={{
                                "& input": {
                                  fontSize: "16px",
                                },
                              }}
                              name="l2"
                              value={question.l2}
                              error={Boolean(question.error?.l2)}
                              helpertext={question.error?.l2}
                              onChange={(e) => handleFigure(e, i)}
                              placeholder="Enter L2"
                            />
                          </MDBox>

                          <MDBox
                            display="flex"
                            flexDirection="column"
                            sx={{ width: 200, mb: pxToRem(24) }}
                          >
                            <MDTypography
                              variant="caption"
                              mb={pxToRem(6)}
                              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                            >
                              L3
                            </MDTypography>
                            <TextField
                              sx={{
                                "& input": {
                                  fontSize: "16px",
                                },
                              }}
                              name="l3"
                              value={question.l3}
                              error={Boolean(question.error?.l3)}
                              helpertext={question.error?.l3}
                              onChange={(e) => handleFigure(e, i)}
                              placeholder="Enter L3"
                            />
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    )}
                  </MDBox>

                  {question.questionType === "options" || question.questionType === "checkbox"
                    ? question.optionValue.map((item, j) => (
                        <MDBox mb={pxToRem(20)} key={`${item?.type}`}>
                          <MDTypography
                            variant="caption"
                            mb={pxToRem(6)}
                            sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                          >
                            Option {j + 1}*
                          </MDTypography>
                          <MDBox>
                            <TextField
                              sx={{
                                width: 580,
                                "& input": {
                                  fontSize: "16px",
                                },
                              }}
                              placeholder={`Enter Option ${j + 1}`}
                              value={item.optionText}
                              error={Boolean(question.optionValue[j].error)}
                              helpertext={question.optionValue[j].error}
                              InputProps={{
                                inputProps: {
                                  style: { textTransform: "capitalize" },
                                },
                              }}
                              onChange={(e) => handleOptionTextChange(e.target.value, i, j)}
                            />
                            <MDButton
                              variant="text"
                              color="error"
                              onClick={() => handleDeleteOptions(i, j)}
                              disabled={question.optionValue.length === 1}
                            >
                              {Icons.DELETE}
                            </MDButton>
                          </MDBox>
                        </MDBox>
                      ))
                    : null}

                  {question.questionType === "slider" ? (
                    <MDBox
                      sx={{ width: 650, mb: pxToRem(20) }}
                      display="flex"
                      flexDirection="row"
                      alignItems="start"
                    >
                      <MDBox display="flex" flexDirection="column" sx={{ width: 150, mr: 2 }}>
                        <MDTypography
                          variant="caption"
                          mb={pxToRem(6)}
                          sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                        >
                          Min*
                        </MDTypography>
                        <TextField
                          sx={{
                            "& input": {
                              fontSize: "16px",
                            },
                          }}
                          placeholder="Enter min value"
                          type="number"
                          error={Boolean(parameters[i].error?.range?.min)}
                          helpertext={parameters[i].error?.range?.min}
                          defaultValue={question.range?.min}
                          value={question.range?.min}
                          onChange={(e) => handleRangeChange(e.target.value, i, "min")}
                        />
                      </MDBox>
                      <MDBox display="flex" flexDirection="column" sx={{ width: 150 }}>
                        <MDTypography
                          variant="caption"
                          mb={pxToRem(6)}
                          sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
                        >
                          Max*
                        </MDTypography>
                        <TextField
                          sx={{
                            "& input": {
                              fontSize: "16px",
                            },
                          }}
                          placeholder="Enter max value"
                          type="number"
                          error={Boolean(parameters[i].error?.range?.max)}
                          helpertext={parameters[i].error?.range?.max}
                          value={question.range?.max}
                          onChange={(e) => handleRangeChange(e.target.value, i, "max")}
                        />
                      </MDBox>
                    </MDBox>
                  ) : null}

                  <MDBox sx={{ width: 650 }} display="flex" flexDirection="column">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={parameters[i]?.hasThreePhase}
                            onChange={(e) => handleHasThreePhase(e.target.checked, i)}
                          />
                        }
                        label="has Three Phase"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        checked={parameters[i]?.isRequired}
                        control={<Checkbox onChange={(e) => handleRequired(e.target.checked, i)} />}
                        label="Required"
                      />
                    </FormGroup>
                  </MDBox>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <MDBox display="flex" flexDirection="row" justifyContent="space-evenly">
                      {(question.questionType === "options" ||
                        question.questionType === "checkbox") && (
                        <BasicButton
                          title={ButtonTitles.ADD_OPTIONS}
                          icon={Icons.NEW}
                          background={Colors.WHITE}
                          color={Colors.BLACK}
                          border
                          action={() => handleAddOptions(i)}
                        />
                      )}
                      <BasicButton
                        title={
                          (loading.questionIndex === i &&
                            loading.isSubmitting &&
                            parameterData.type === "new" &&
                            ButtonTitles.CREATE_FIELD_LOADING) ||
                          (loading.questionIndex === i &&
                            !loading.isSubmitting &&
                            parameterData.type === "new" &&
                            ButtonTitles.CREATE_FIELD) ||
                          (loading.questionIndex === i &&
                            loading.isSubmitting &&
                            parameterData.type === "update" &&
                            ButtonTitles.UPDATE_FIELD_LOADING) ||
                          (loading.questionIndex === i &&
                            !loading.isSubmitting &&
                            parameterData.type === "update" &&
                            ButtonTitles.UPDATE_FIELD)
                        }
                        icon={parameterData.type === "new" ? Icons.NEW : Icons.EDIT2}
                        background={Colors.PRIMARY}
                        color={Colors.WHITE}
                        action={() => handleSave(i)}
                      />
                    </MDBox>
                  </MDBox>
                </>
              ))}
            </MDBox>
          </MDBox>
        </MDBox>
      </Modal>
    </MDBox>
  );
}
export default parameterModal;
