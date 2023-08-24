import React, { useEffect, useState } from "react";
import { Feature } from "flagged";

// Material components
import MDBox from "components/MDBox";
import { Card, Divider, Grid } from "@mui/material";

// Custom components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import ReportParameterModal from "examples/modal/ReportParameter/ReportParameter";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import pxToRem from "assets/theme/functions/pxToRem";

// Table Data
import ParamterData from "layouts/wfmwizard/DailyActivity/data/Paramater";

import Constants, {
  Icons,
  PageTitles,
  ButtonTitles,
  Colors,
  ModalContent,
  FeatureTags,
} from "utils/Constants";
import DataTable from "examples/Tables/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getReportTypeById, deleteParamter, updateReportType } from "redux/Thunks/Report";
import { openSnackbar } from "redux/Slice/Notification";

function SetupReport() {
  const [parameterData, setParameterData] = useState({
    type: "new",
    openModal: false,
    list: [],
    body: {
      reportType: "",
      project: "",
    },
    errors: {},
    openDeleteModal: false,
    editDeleteId: "",
    loadingList: "pending",
    publishLoading: false,
  });
  const [loading, setLoading] = useState(false);
  const reportTypeList = useSelector((state) => state.report);
  const dispatch = useDispatch();
  const { reportType } = useParams();
  const navigate = useNavigate();

  const fetchReportTypeById = async () => {
    const res = await dispatch(getReportTypeById(reportType));
    if (res?.payload.status === 200) {
      setParameterData((prev) => ({
        ...prev,
        list: res?.payload.data?.data?.parameters,
        loadingList: "fullfilled",
      }));
    } else {
      navigate("/client/setting/report-type");
    }
  };

  useEffect(() => {
    const fetchParamter = async () => {
      if (reportTypeList?.reportType?.length > 0) {
        const currentReportType = reportTypeList.reportType.find(
          (item) => item[Constants.MONGOOSE_ID] === reportType
        );
        setParameterData((prev) => ({
          ...prev,
          list: currentReportType?.parameters,
          loadingList: "fullfilled",
        }));
      } else {
        fetchReportTypeById();
      }
    };
    fetchParamter();
  }, [reportTypeList]);

  const handleCloseParameter = () =>
    setParameterData((prev) => ({ ...prev, type: "new", openModal: false, body: {} }));

  const handleCloseDeleteParameterModal = () =>
    setParameterData((prev) => ({ ...prev, openDeleteModal: false, editDeleteId: "" }));

  const handleDeleteParameterModal = (id) => {
    setParameterData((prev) => ({ ...prev, openDeleteModal: true, editDeleteId: id }));
  };

  const handleEditParameter = (data) => {
    setParameterData((prev) => ({
      ...prev,
      type: "update",
      openModal: true,
      body: { ...data },
    }));
  };

  const { columns, rows } = ParamterData(
    parameterData.list,
    handleEditParameter,
    handleDeleteParameterModal
  );

  const parameterValidation = () => {
    const { body } = parameterData;
    const errors = {};
    if (!body.reportType) errors.reportType = Constants.REQUIRED;
    if (!body.project) errors.project = Constants.REQUIRED;
    return errors;
  };

  const handleCreateParameter = () => {
    setLoading(true);
    const errors = parameterValidation();
    if (Object.keys(errors).length === 0) {
      setParameterData((prev) => ({ ...prev, openModal: false, errors: {}, body: {} }));
    } else {
      setParameterData((prev) => ({ ...prev, errors }));
    }
    setLoading(false);
  };

  const handleUpdateParameter = () => {
    setLoading(true);
    const errors = parameterValidation();
    if (Object.keys(errors).length === 0) {
      setParameterData((prev) => ({ ...prev, openModal: false, errors: {}, body: {} }));
    }
  };

  const handleDeleteParameter = async () => {
    const { editDeleteId } = parameterData;
    const res = await dispatch(deleteParamter({ reportType, parameterId: editDeleteId }));
    if (res?.payload.status === 200) {
      fetchReportTypeById();
      dispatch(
        openSnackbar({
          message: Constants.PARAMETER_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res?.payload.status === 400) {
      dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setParameterData((prev) => ({ ...prev, openDeleteModal: false, editDeleteId: "" }));
  };

  // publish only when total weightage is equal to 100
  const handlePublish = async () => {
    setParameterData((prev) => ({ ...prev, publishLoading: true }));
    const { list } = parameterData;
    const totalWeightage = list.reduce((acc, item) => acc + item.weightage, 0);
    if (totalWeightage === 100) {
      const body = {
        isPublish: true,
      };
      const res = await dispatch(updateReportType({ reportTypeId: reportType, body }));
      if (res?.payload.status === 200) {
        dispatch(
          openSnackbar({
            message: Constants.PUBLISH_SUCCESS,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    } else {
      dispatch(
        openSnackbar({
          message: Constants.TOTAL_WEIGHTAGE_NOT_100,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setParameterData((prev) => ({ ...prev, publishLoading: false }));
  };

  // Realod Table Data
  const handleReload = async () => {
    setParameterData((prevState) => ({
      ...prevState,
      loadingList: "pending",
    }));
    fetchReportTypeById();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        display="flex"
        flexDirection={["column", "row"]}
        justifyContent={["center", "space-between"]}
        alignItems={["center", "flex-start"]}
      >
        <PageTitle title={PageTitles.REPORT_PARAMETER_FIGURE} />
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={[3, 0]}>
          <CustomButton
            title={ButtonTitles.NEW_REPORT_PARAMETER_FIGURE}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => setParameterData((prev) => ({ ...prev, openModal: true }))}
          />
          <CustomButton
            title={
              parameterData.publishLoading ? ButtonTitles.PUBLISH_LOADING : ButtonTitles.PUBLISH
            }
            icon={Icons.PUBLISH}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            border
            openModal={handlePublish}
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

      <Feature name={FeatureTags.SETUP_REPORT}>
        <MDBox mt={5}>
          <Grid item xs={12}>
            <Card>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 10 }}
                  showTotalEntries={false}
                  noEndBorder
                  loading={parameterData.loadingList}
                />
              </MDBox>
            </Card>
          </Grid>
        </MDBox>

        {/* create and Update Modal for Report type */}
        <ReportParameterModal
          open={parameterData.openModal}
          handleClose={handleCloseParameter}
          title={ModalContent.REPORT_PARAMETER_FIGURE_TITLE}
          actionButton={
            (parameterData.type === "new" && !loading && ButtonTitles.SUBMIT) ||
            (parameterData.type === "new" && loading && ButtonTitles.SUBMIT_LOADING) ||
            (parameterData.type === "update" && !loading && ButtonTitles.UPDATE) ||
            (parameterData.type === "update" && loading && ButtonTitles.UPDATE_LOADING)
          }
          handleAction={
            parameterData.type === "new" ? handleCreateParameter : handleUpdateParameter
          }
          fetchReportTypeById={fetchReportTypeById}
          parameterData={parameterData}
        />

        {/* Delete Modal for Report type */}
        <DeleteModal
          open={parameterData.openDeleteModal}
          title={ModalContent.REPORT_PARAMETER_FIGURE_DELETE_TITLE}
          message={ModalContent.REPORT_PARAMETER_FIGURE_DELETE_MESSAGE}
          handleClose={handleCloseDeleteParameterModal}
          handleDelete={handleDeleteParameter}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default SetupReport;
