// Common Components
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import ConfirmationModal from "examples/modal/Confirmation/Confirmation";

// Material-UI Imports
import { Button, Divider, FormControlLabel, Radio, RadioGroup } from "@mui/material";

// Custom components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import DataTable from "examples/Tables/DataTable";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";

// Redux
import getAllQuestions, {
  createMedicalQuestion,
  deleteMedicalQuestion,
  updateMedicalQuestion,
} from "redux/Thunks/medicalQuestion";
import { openSnackbar } from "redux/Slice/Notification";

// Other Imports
import Medicalmanagementdata from "layouts/wfmwizard/System/data/medicalQuestionData";
import pxToRem from "assets/theme/functions/pxToRem";
import Constants, { Icons, ButtonTitles, ModalContent, Colors } from "utils/Constants";
import MDInput from "components/MDInput";

function medicalQuestion() {
  const dispatch = useDispatch();
  const [loadingStatus, setLoadingStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [medicalQuestions, setMedicalsQuestion] = useState({
    type: "new",
    openModal: false,
    list: [],
    body: {
      title: "",
      isPublished: false,
    },
    errors: {},
    openDeleteModal: false,
    openConfirmationModal: false,
    editDeleteId: "",
  });
  const [filters, setFilters] = useState([
    {
      inputLabel: "Questions",
      list: [
        { [Constants.MONGOOSE_ID]: "All", title: "All" },
        { [Constants.MONGOOSE_ID]: "true", title: "Published" },
        { [Constants.MONGOOSE_ID]: "false", title: "UnPublished" },
      ],
      selectedValue: "All",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: 20,
  });
  const handleFilter = async (filterVale = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    const paramData = {
      isPublished: filterVale[0].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    const res = await dispatch(getAllQuestions(data));
    setLoadingStatus("fullfilled");
    setQuestionsData(res.payload.data.data);
  };
  const handleResetFilter = () => {
    setFilters((prev) => [{ ...prev[0], selectedValue: "All" }, ...prev.slice(1)]);
    handleFilter([{ ...filters[0], selectedValue: "All" }, ...filters.slice(1)]);
  };
  const handleFilterChange = (e) => {
    const temp = [...filters];
    const { value } = e.target;
    const index = filters.findIndex((filter) => filter.inputLabel === e.target.name);
    temp[index].selectedValue = value;
    setFilters(temp);
    handleFilter(temp);
  };
  useEffect(() => {
    (async () => {
      handleFilter();
    })();
  }, []);

  const handleCloseMedicalquestions = () =>
    setMedicalsQuestion((prev) => ({
      ...prev,
      type: "new",
      openModal: false,
      body: {},
      errors: {},
    }));

  const handleCloseDeleteMedicalQuestionModal = () =>
    setMedicalsQuestion((prev) => ({ ...prev, openDeleteModal: false }));

  const handleCloseConfirmationlModal = () =>
    setMedicalsQuestion((prev) => ({ ...prev, openConfirmationModal: false }));

  const handleEdit = (data) => {
    setMedicalsQuestion((prev) => ({
      ...prev,
      type: "update",
      openModal: true,
      body: { ...data.body },
      editDeleteId: data.id,
    }));
  };
  const handleDelete = (id) => {
    setMedicalsQuestion((prev) => ({ ...prev, openDeleteModal: true, editDeleteId: id }));
  };

  const handlePublishChange = (event, data) => {
    if (event.target.checked) {
      setMedicalsQuestion((prev) => ({
        ...prev,
        openConfirmationModal: true,
        body: { ...data.body },
        editDeleteId: data.id,
      }));
    }
  };
  const handlemedicalQuestionChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setMedicalsQuestion((prev) => ({
        ...prev,
        body: { ...prev.body, [name]: value },
      }));
    } else {
      setMedicalsQuestion((prev) => ({
        ...prev,
        body: { ...prev.body, isPublished: value === "true", [name]: value },
      }));
    }
  };

  const medicalQuestionValidation = () => {
    const { body } = medicalQuestions;
    const errors = {};
    if (!body.title) errors.title = Constants.REQUIRED;
    return errors;
  };
  const handleCreateMedicalQuestion = async () => {
    setLoading(true);
    const errors = medicalQuestionValidation();
    if (Object.keys(errors).length === 0) {
      const { body } = medicalQuestions;
      const res = await dispatch(createMedicalQuestion(body));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.MEDICAL_QUESTIONS_CREATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else if (res.payload.status === 400) {
        dispatch(
          openSnackbar({
            message: Constants.MEDICAL_QUESTIONS_CREATE_ERROR,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
      setMedicalsQuestion((prev) => ({ ...prev, openModal: false, errors: {}, body: {} }));
    } else {
      setMedicalsQuestion((prev) => ({ ...prev, errors }));
    }
    setLoading(false);
  };
  const handleUpdateMedicalQuestion = async () => {
    setLoading(true);
    const errors = medicalQuestionValidation();
    if (Object.keys(errors).length === 0) {
      const { body, editDeleteId } = medicalQuestions;
      const res = await dispatch(updateMedicalQuestion({ body, medicalQuestionId: editDeleteId }));
      if (res.payload.status === 200) {
        handleFilter();
        dispatch(
          openSnackbar({
            message: Constants.MEDICAL_QUESTIONS_UPDATE_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else if (res.payload.status === 400) {
        dispatch(
          openSnackbar({
            message: Constants.MEDICAL_QUESTIONS_UPDATE_ERROR,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
      setMedicalsQuestion((prev) => ({
        ...prev,
        openModal: false,
        errors: {},
        body: {},
        editDeleteId: "",
        type: "new",
      }));
    } else {
      setMedicalsQuestion((prev) => ({ ...prev, errors }));
    }
    setLoading(false);
  };
  const handleDeleteMedicalQuestion = async () => {
    const { editDeleteId } = medicalQuestions;
    const res = await dispatch(deleteMedicalQuestion(editDeleteId));
    if (res.payload.status === 200) {
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.MEDICAL_QUESTIONS_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      dispatch(
        openSnackbar({
          message: Constants.MEDICAL_QUESTIONS_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setMedicalsQuestion((prev) => ({ ...prev, openDeleteModal: false, editDeleteId: "" }));
  };
  const handlePermissionQuestion = async () => {
    const { body, editDeleteId } = medicalQuestions;
    const res = await dispatch(updateMedicalQuestion({ body, medicalQuestionId: editDeleteId }));
    if (res.payload.status === 200) {
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.MEDICAL_QUESTIONS_CONFIRMATION_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      dispatch(
        openSnackbar({
          message: Constants.MEDICAL_QUESTIONS_UPDATE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setMedicalsQuestion((prev) => ({
      ...prev,
      openConfirmationModal: false,
      errors: {},
      body: {},
      editDeleteId: "",
      type: "new",
    }));
  };
  const { columns, rows } = Medicalmanagementdata(
    questionsData,
    handleEdit,
    handleDelete,
    handlePublishChange
  );

  const handleReload = async () => {
    setLoadingStatus("pending");
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center" fullWidth>
        <PageTitle title="Medical Management" />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title="Question"
            icon="add_circle_outline"
            background="#191A51"
            color="#ffffff"
            openModal={() => setMedicalsQuestion((prev) => ({ ...prev, openModal: true }))}
          />
          <Divider
            orientation="vertical"
            sx={{
              backgroundColor: "var(--gray-300, #D0D5DD)",
              height: "auto",
              marginLeft: pxToRem(16),
              marginRight: 0,
            }}
          />
          <BasicButton
            icon={Icons.RELOAD}
            background={Colors.WHITE}
            border
            color={Colors.BLACK}
            action={handleReload}
          />
        </MDBox>
      </MDBox>
      <Divider sx={{ marginTop: 2 }} />
      <MDBox display="flex" alignItems="center">
        <MDBox
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="start"
          sx={{ flexDirection: "row", mr: 2 }}
        >
          {filters &&
            filters.map((val) => (
              <FilterDropdown
                key={val.inputLabel}
                label={val.inputLabel}
                name={val.inputLabel}
                defaultValue={val?.selectedValue}
                value={val?.selectedValue}
                handleChange={handleFilterChange}
                menu={val.list}
              />
            ))}
          <Button
            sx={{
              mt: 5.5,
              mr: 1,
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#fff",
              },
              fontSize: pxToRem(14),
              textTransform: "capitalize",
            }}
            variant="outlined"
            color="info"
            startIcon={Icons.RESET_FILTER}
            onClick={handleResetFilter}
          >
            {ButtonTitles.RESET_FILTER}
          </Button>
        </MDBox>
      </MDBox>
      <MDBox mt={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: 25 }}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus}
        />
      </MDBox>
      {/* Create and Update Medical Question modal */}
      <BasicModal
        open={medicalQuestions.openModal}
        handleClose={handleCloseMedicalquestions}
        title={
          medicalQuestions.type === "new"
            ? ModalContent.NEW_MEDICAL_QUESTION_TYPE_TITLE
            : ModalContent.UPDATE_MEDICAL_QUESTION_TITLE
        }
        actionButton={
          (medicalQuestions.type === "new" && !loading && ButtonTitles.SUBMIT) ||
          (medicalQuestions.type === "new" && loading && ButtonTitles.SUBMIT_LOADING) ||
          (medicalQuestions.type === "update" && !loading && ButtonTitles.UPDATE) ||
          (medicalQuestions.type === "update" && loading && ButtonTitles.UPDATE_LOADING)
        }
        handleAction={
          medicalQuestions.type === "new"
            ? handleCreateMedicalQuestion
            : handleUpdateMedicalQuestion
        }
      >
        <MDTypography
          variant="caption"
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Question Title
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            minWidth: 150,
            textTransform: "capitalize",
            "& input": {
              fontSize: "16px",
            },
          }}
          size="small"
          variant="outlined"
          name="title"
          placeholder="Medical Question"
          value={medicalQuestions.body?.title}
          error={medicalQuestions.errors?.title}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          helperText={medicalQuestions.errors?.title}
          onChange={handlemedicalQuestionChange}
        />
        {medicalQuestions.type === "new" ? (
          <MDBox>
            <MDTypography
              variant="caption"
              mb={1}
              mt={2}
              sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
            >
              You want to publish this question?
            </MDTypography>
            <RadioGroup
              name="use-radio-group"
              value={medicalQuestions.body.isPublished ? "true" : "false"}
              onChange={handlemedicalQuestionChange}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel label="Yes" value="true" control={<Radio />} />
              <FormControlLabel
                sx={{ marginLeft: "8px" }}
                label="No"
                value="false"
                control={<Radio />}
              />
            </RadioGroup>
          </MDBox>
        ) : null}
      </BasicModal>

      {/* Delete Modal for Medical Questions */}
      <DeleteModal
        open={medicalQuestions.openDeleteModal}
        title={ModalContent.MEDICAL_QUESTION_DELETE_TITLE}
        message={ModalContent.MEDICAL_QUESTION_DELETE_MESSAGE}
        handleClose={handleCloseDeleteMedicalQuestionModal}
        handleDelete={handleDeleteMedicalQuestion}
      />

      {/* Confirmation Modal for Medical Questions */}
      <ConfirmationModal
        open={medicalQuestions.openConfirmationModal}
        title={ModalContent.MEDICAL_QUESTION_CONFIRMATION_TITLE}
        message={ModalContent.MEDICAL_QUESTION_CONFIRMATION_MESSAGE}
        handleClose={handleCloseConfirmationlModal}
        handleAction={handlePermissionQuestion}
      />
    </DashboardLayout>
  );
}

export default medicalQuestion;
