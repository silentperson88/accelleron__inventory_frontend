import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import MDInput from "components/MDInput";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import configThunk from "redux/Thunks/Config";
import createFieldThunk, {
  getAllFieldsThunk,
  deleteFieldsThunk,
  updateFieldThunk,
} from "redux/Thunks/Configuration";
import PageTitle from "examples/NewDesign/PageTitle";
import DynamicFieldTableData from "layouts/wfmwizard/HealthandSafety/data/QhseFields";
import DataTable from "examples/Tables/DataTable";
import { openSnackbar } from "redux/Slice/Notification";
import { useLocation } from "react-router-dom";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import TextMessage, { Icons, PageTitles } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";

const customFieldValidation = (value) => {
  if (/^\d/.test(value)) {
    return "Field Name cannot start with a number";
  }
  if (value.trim() === "") {
    return "Please add valid field name";
  }
  return null;
};

const customOptionValidation = (value) => {
  if (value.trim() === "") {
    return "Please add valid value";
  }
  return null;
};

const customSortValidation = (value) => {
  if (value.trim() === "") {
    return "Required";
  }
  if (value <= 0 || Number.isNaN(Number(value)) || value.includes(".")) {
    return "Invalid value";
  }
  return null;
};

function index() {
  const { config } = useSelector((state) => state.config);
  const dynamicData = useSelector((state) => state.dynamicFields);
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([
    {
      questionHeader: "",
      sortOrder: "",
      questionType: "",
      optionValue: [],
      createdBy: "",
      error: "",
    },
  ]);
  const [loading, setLoading] = useState({
    questionIndex: 0,
    isSubmitting: false,
  });
  const [isDropdown, setIsDropdown] = useState(false);
  const [isSlider, setIsSlider] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [reload, setReload] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [sortNumber, setSortNumber] = useState("");
  const [sortError, setSortError] = useState(null);
  const [values, setValues] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const licensePermissions = useSelector((state) => state.License);
  const [tabsList, setTabsList] = useState([]);
  const [type, setType] = useState("");
  const location = useLocation();
  useEffect(() => {
    setQuestions([
      {
        questionHeader: "",
        sortOrder: "",
        questionType: "",
        optionValue: [],
        createdBy: "",
        error: "",
      },
    ]);
  }, [location]);

  useEffect(() => {
    if (licensePermissions?.permissions?.length > 0) {
      const tempTabs = ["Safe", "Unsafe", "NCR", "Incident"];
      const tempPer = tempTabs.filter((val) =>
        licensePermissions?.permissions.some(
          (per) => per.permission.name.toLowerCase() === val.toLowerCase()
        )
      );
      setTabsList(tempPer);
      setType(tempPer[0].toLowerCase());
    }
  }, [licensePermissions]);
  const resetForm = () => {
    setQuestions([
      {
        questionHeader: "",
        sortOrder: "",
        questionType: "",
        optionValue: [],
        createdBy: "",
        error: "",
      },
    ]);
  };

  useEffect(() => {
    if (type !== "") {
      dispatch(configThunk());
      dispatch(getAllFieldsThunk(type));
    }
  }, [type, reload]);

  const handleQuestionText = (text, i) => {
    const questionsArr = [...questions];
    questionsArr[i].questionHeader = text;
    questionsArr[i].error = "";
    setQuestions(questionsArr);
  };

  const handleSort = (number, i) => {
    const questionsArr = [...questions];
    questionsArr[i].sortOrder = number;
    questionsArr[i].sortError = customSortValidation(number); // Assign the sort error to a separate property
    setQuestions(questionsArr);
  };

  const handleQuestionType = (value, i) => {
    const questionsArr = [...questions];
    if (value === "options") {
      setIsDropdown(true);
      questionsArr[i].questionType = value;
      questionsArr[i].optionValue = [{ optionText: "", error: "" }];
      questionsArr[i].isRequired = false;
      questionsArr[i] = {
        ...questionsArr[i],
      };
      setQuestions(questionsArr);
    }

    if (value === "text") {
      questionsArr[i].questionType = value;
      questionsArr[i] = { ...questionsArr[i] };
      questionsArr[i].isRequired = false;
      setQuestions(questionsArr);
    }
    if (value === "date") {
      questionsArr[i].questionType = value;
      questionsArr[i] = { ...questionsArr[i] };
      questionsArr[i].isRequired = false;
      setQuestions(questionsArr);
    }
    if (value === "datetime") {
      questionsArr[i].questionType = value;
      questionsArr[i] = { ...questionsArr[i] };
      questionsArr[i].isRequired = false;
      setQuestions(questionsArr);
    }
    if (value === "number") {
      questionsArr[i].questionType = value;
      questionsArr[i] = { ...questionsArr[i] };
      questionsArr[i].isRequired = false;
      setQuestions(questionsArr);
    }
    if (value === "slider") {
      setIsSlider(true);
      questionsArr[i].questionType = value;
      questionsArr[i].range = [{ min: 0, max: 1 }];
      questionsArr[i].isRequired = false;
      questionsArr[i] = { ...questionsArr[i] };
      setQuestions(questionsArr);
    }

    if (value === "checkbox") {
      setIsCheckbox(true);
      questionsArr[i].questionType = value;
      questionsArr[i].optionValue = [{ optionText: "", error: "" }];
      questionsArr[i].isRequired = false;
      questionsArr[i] = { ...questionsArr[i] };
      setQuestions(questionsArr);
    }
    if (value === "boolean") {
      questionsArr[i].questionType = value;
      questionsArr[i] = { ...questionsArr[i] };
      questionsArr[i].isRequired = false;
      setQuestions(questionsArr);
    }
  };
  const dropdownIcon = () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#475467" }} />;

  const handleSave = async (i) => {
    const questionsArr = [...questions];
    const checkHeader = customFieldValidation(questionsArr[i].questionHeader);
    const checkSort = customSortValidation(questionsArr[i].sortOrder);
    questionsArr[i].optionValue.forEach((item, j) => {
      questionsArr[i].optionValue[j].error = customOptionValidation(item.optionText);
    });
    const checkoptionValue = questionsArr[i].optionValue.some((item) => item.error !== null);
    questionsArr[i].error = checkHeader;
    questionsArr[i].sortError = checkSort;
    if (checkHeader === null && !checkoptionValue && checkSort === null) {
      const body = {
        fieldName: questions[i].questionHeader.trim(),
        fieldType: questions[i].questionType,
        fieldSortOrder: questions[i].sortOrder,
        optionValue: questionsArr[i].optionValue.map((item) => {
          const temp = {
            optionText: item.optionText.trim(),
          };
          return temp;
        }),
        isRequired: questions[i].isRequired,
        range: questions[i].range,
        createdBy: config[0].id,
        cardType: type,
      };
      setLoading({ questionIndex: i, isSubmitting: true });
      const res = await dispatch(createFieldThunk(body));
      if (res.error === undefined && res.payload.status !== 400) {
        resetForm();
        dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
        setReload(!reload);
      }

      if (res.payload.status === 400) {
        questions[i].error = res.payload.data.message;
      }
    } else {
      setQuestions(questionsArr);
    }
    setLoading({ questionIndex: i, isSubmitting: false });
  };

  const handleAddOptions = (i) => {
    const questionsArr = [...questions];

    questionsArr[i].optionValue.push({ optionText: "" });
    setQuestions(questionsArr);
  };

  const handleDeleteOptions = (i, j) => {
    const questionsArr = [...questions];

    questionsArr[i].optionValue.splice(j, 1);
    setQuestions(questionsArr);
  };

  const handleDeleteField = (i) => {
    const questionsArr = [...questions];

    questionsArr.splice(i, 1);
    setQuestions(questionsArr);
  };

  const handleRequired = (required, i) => {
    const questionsArr = [...questions];

    questionsArr[i].isRequired = required;

    setQuestions(questionsArr);
  };

  const handleOptionTextChange = (text, i, j) => {
    const questionsArr = [...questions];

    questionsArr[i].optionValue[j].optionText = text;

    setQuestions(questionsArr);
  };
  const handleRangeChange = (val, i, j) => {
    const questionsArr = [...questions];

    questionsArr[i].range[0][j] = parseFloat(val);

    setQuestions(questionsArr);
  };
  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setSortError(null);
    setEditModal(false);
  };
  const handleOpenEditModal = (item) => {
    setSortNumber(item);
    setEditModal(true);
  };
  const handleDeleteDynamicField = async () => {
    const res = await dispatch(deleteFieldsThunk(deleteId));
    setDeleteModal(false);
    await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
    setDeleteModal(false);
    setReload(!reload);
  };
  const handleSortChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditSortNumber = async () => {
    const mongooseId = "_id";
    const { fieldSortOrder } = values;

    const validationError = customSortValidation(fieldSortOrder);
    setLoading(true);
    if (validationError) {
      setSortError(validationError);
      return;
    }

    setSortError(null);

    const b = {
      body: values,
      sortID: sortNumber[mongooseId],
    };

    const res = await dispatch(updateFieldThunk(b));
    setEditModal(false);
    await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
    setReload(!reload);
    setLoading(false);
  };

  const { columns, rows } = DynamicFieldTableData(
    dynamicData?.list,
    handleOpenDeleteModal,
    handleOpenEditModal
  );

  return (
    <DashboardLayout xPadding={0}>
      <MDBox px={pxToRem(30)}>
        <DashboardNavbar />
      </MDBox>

      <MDBox px={pxToRem(30)}>
        <PageTitle title={PageTitles.CONFIGURATION} />
      </MDBox>

      <Box py={5}>
        <Tabs
          value={type}
          onChange={(e, val) => setType(val)}
          aria-label="Configuration tabs"
          sx={{
            background: "white",
            width: "100%",
            "& .MuiTabs-indicator": { backgroundColor: "#red" },
            "& .PrivateTabIndicator-root-1": {
              display: "none",
            },
            paddingBottom: "0px",
            paddingTop: pxToRem(7),
            paddingX: pxToRem(30),
            height: pxToRem(54),
            borderRadius: 0,
          }}
        >
          {tabsList.map((tab) => (
            <Tab
              label={tab}
              value={tab.toLowerCase()}
              sx={{
                "&.Mui-selected": { backgroundColor: "#f6f7ff", color: "white" },
                fontWeight: 600,
                fontSize: pxToRem(16),
                borderRadius: pxToRem(6),
              }}
            />
          ))}
        </Tabs>
      </Box>

      <MDBox pt={2} px={pxToRem(30)}>
        <Card sx={{ boxShadow: "none", height: "auto", borderRadius: 0 }}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: 10000 }}
            showTotalEntries={false}
            noEndBorder
            loading={dynamicData.loading}
          />
        </Card>
      </MDBox>

      <MDBox
        px={pxToRem(30)}
        mb={3}
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        minHeight="50%"
        sx={{ backgroundColor: "#fff", flexDirection: "column" }}
      >
        {questions.map((question, i) => (
          <MDBox key={question.questionType}>
            <MDBox
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
              flexWrap="wrap"
              mt={2}
              mb={2}
              ml={2}
              sx={{ flexDirection: "row" }}
            >
              <MDBox mr={5}>
                <MDTypography
                  sx={{
                    fontSize: pxToRem(14),
                    fontWeight: 500,
                    color: "#344054",
                  }}
                  textAlign="Left"
                >
                  Field Name
                </MDTypography>
                <TextField
                  sx={{
                    "& input": {
                      fontSize: "16px",
                      color: "#667085",
                      backgroundColor: "#fff",
                      width: "300px",
                    },
                  }}
                  placeholder="Field Name"
                  value={question.questionHeader}
                  error={Boolean(question.error)}
                  helperText={question.error}
                  onChange={(e) => handleQuestionText(e.target.value, i)}
                />
              </MDBox>
              <MDBox>
                <MDTypography sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}>
                  Field Type
                </MDTypography>
                <FormControl sx={{ m: 0, minWidth: 120, width: "300px" }}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    sx={{ p: "0.75rem", color: "#667085", backgroundColor: "#fff" }}
                    IconComponent={dropdownIcon}
                    value={question.questionType}
                    label="Age"
                    onChange={(e) => handleQuestionType(e.target.value, i)}
                  >
                    <MenuItem value="options">Dropdown</MenuItem>
                    <MenuItem value="text">Short Answer</MenuItem>
                    <MenuItem value="checkbox">Checkbox</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="datetime">Datetime</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="slider">Slider</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                  </Select>
                </FormControl>
                {questions.length > 1 ? (
                  <MDButton
                    aria-label="delete"
                    variant="text"
                    color="error"
                    onClick={() => handleDeleteField(i)}
                    sx={{ marginTop: 0 }}
                  >
                    <DeleteIcon />
                  </MDButton>
                ) : null}
              </MDBox>
              <MDBox ml={5}>
                <MDTypography
                  sx={{
                    fontSize: pxToRem(14),
                    fontWeight: 500,
                    color: "#344054",
                  }}
                  textAlign="Left"
                >
                  Sort Order
                </MDTypography>
                <TextField
                  sx={{
                    "& input": {
                      fontSize: "16px",
                      color: "#667085",
                      backgroundColor: "#fff",
                      width: "100px",
                    },
                  }}
                  type="number"
                  placeholder="Sort Order"
                  value={question.sortOrder}
                  error={Boolean(question.sortError)}
                  helperText={question.sortError}
                  onChange={(e) => handleSort(e.target.value, i)}
                />
              </MDBox>
              <MDBox display="flex" flexWrap="wrap" ml={5} mt={4} sx={{ flexDirection: "row" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={question.isRequired}
                      onChange={(e) => handleRequired(e.target.checked, i)}
                      color="primary"
                    />
                  }
                  label="Required"
                />
                <MDBox>
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => {
                      if (
                        question.questionType === "slider" &&
                        question.range[0].min >= 0 &&
                        question.range[0].max >= 0 &&
                        question.range[0].max > question.range[0].min
                      ) {
                        handleSave(i);
                      } else if (question.questionType !== "slider") {
                        handleSave(i);
                      }
                    }}
                    style={{ boxShadow: "none", textTransform: "none" }}
                    sx={{ marginRight: 3, marginLeft: 3 }}
                    startIcon={Icons.NEW}
                  >
                    {loading.questionIndex === i && loading.isSubmitting
                      ? "Loading..."
                      : "Create Field"}
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
            {isDropdown && question.questionType === "options" ? (
              <MDBox
                display="flex"
                flexWrap="wrap"
                justifyContent="flex-start"
                alignItems="center"
                mb={3}
              >
                {question.optionValue.map((item, j) => (
                  <MDBox mb={2} ml={2} key="options">
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        mb={1}
                        sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                      >
                        {` Option ${j + 1}`}
                      </MDTypography>
                    </MDBox>
                    <TextField
                      sx={{
                        width: "264px",
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                          backgroundColor: "#fff",
                        },
                      }}
                      placeholder="Enter Option value"
                      value={item.optionText}
                      error={Boolean(question.optionValue[j].error)}
                      helperText={question.optionValue[j].error}
                      onChange={(e) => handleOptionTextChange(e.target.value, i, j)}
                    />
                    <MDButton
                      variant="text"
                      color="error"
                      onClick={() => handleDeleteOptions(i, j)}
                    >
                      <DeleteIcon color="error" />
                    </MDButton>
                  </MDBox>
                ))}
                <MDBox
                  mt={3}
                  display="flex"
                  justifyContent="space-evenly"
                  sx={{ flexDirection: "row" }}
                >
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddOptions(i)}
                    startIcon={Icons.NEW}
                  >
                    Add Option
                  </MDButton>
                </MDBox>
              </MDBox>
            ) : null}

            {isCheckbox && question.questionType === "checkbox" ? (
              <MDBox
                display="flex"
                flexWrap="wrap"
                justifyContent="flex-start"
                alignItems="center"
                mb={3}
              >
                {question.optionValue.map((item, j) => (
                  <MDBox mb={2} ml={2} key={item?.[j]}>
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        mb={1}
                        sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                      >
                        {` Option ${j + 1}`}
                      </MDTypography>
                    </MDBox>
                    <TextField
                      sx={{
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                          backgroundColor: "#fff",
                        },
                      }}
                      width="264px"
                      placeholder="Enter Option value"
                      value={item.optionText}
                      error={Boolean(question.optionValue[j].error)}
                      helperText={question.optionValue[j].error}
                      onChange={(e) => handleOptionTextChange(e.target.value, i, j)}
                    />
                    <MDButton
                      variant="text"
                      color="error"
                      onClick={() => handleDeleteOptions(i, j)}
                    >
                      <DeleteIcon color="error" />
                    </MDButton>
                  </MDBox>
                ))}
                <MDBox mt={3}>
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddOptions(i)}
                    startIcon={Icons.NEW}
                  >
                    Add Option
                  </MDButton>
                </MDBox>
              </MDBox>
            ) : null}
            {isSlider && question.questionType === "slider" ? (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={3}
                sx={{ flexDirection: "column" }}
              >
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                  sx={{ width: 460, flexDirection: "row" }}
                >
                  <MDBox mb={2} key="min" ml={2}>
                    <MDTypography
                      sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                      mr={2}
                    >
                      Min
                    </MDTypography>
                    <MDInput
                      sx={{
                        width: 150,
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                          backgroundColor: "#fff",
                        },
                      }}
                      placeholder="Enter min value"
                      type="number"
                      defaultValue={question.range[0].min}
                      value={question.range.min}
                      onChange={(e) => handleRangeChange(e.target.value, i, "min")}
                    />
                  </MDBox>
                  <MDBox mb={2} key="max">
                    <MDTypography
                      sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                      mr={2}
                    >
                      Max
                    </MDTypography>
                    <MDInput
                      sx={{
                        width: 150,
                        "& input": {
                          fontSize: "16px",
                          color: "#667085",
                          backgroundColor: "#fff",
                        },
                      }}
                      placeholder="Enter max value"
                      type="number"
                      value={question.range[0].max}
                      onChange={(e) => handleRangeChange(e.target.value, i, "max")}
                    />
                  </MDBox>
                </MDBox>
                {question.range[0].min === question.range[0].max ||
                question.range[0].max < question.range[0].min ? (
                  <MDTypography variant="caption" color="error">
                    {TextMessage.SLIDER_RANGE_VALUE_VALIDATION}
                  </MDTypography>
                ) : null}
                {question.range[0].min < 0 || question.range[0].max < 0 ? (
                  <MDTypography variant="caption" color="error">
                    {TextMessage.SLIDER_NEGATIVE_VALUE_VALIDATION}
                  </MDTypography>
                ) : null}
              </MDBox>
            ) : null}
          </MDBox>
        ))}
      </MDBox>

      <DeleteModal
        open={openDeleteModal}
        title="Delete Dynamic Field"
        message="Are you sure you want to delete this field?"
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteDynamicField}
      />
      <BasicModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        title="Update Sorting"
        actionButton="Update"
        handleAction={handleEditSortNumber}
      >
        <TextField
          type="number"
          defaultValue={sortNumber?.fieldSortOrder}
          name="fieldSortOrder"
          onChange={handleSortChange}
          error={sortError !== null}
          helperText={sortError}
        />
      </BasicModal>
    </DashboardLayout>
  );
}

export default index;
