import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Material components
import MDBox from "components/MDBox";
import { Card, Divider, Grid } from "@mui/material";

// Custom components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import ConfirmationModal from "examples/modal/Confirmation/Confirmation";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import pxToRem from "assets/theme/functions/pxToRem";

// Table Data
import RoleData from "layouts/wfmwizard/System/data/RoleAggrement";

// utils
import Constants, { PageTitles, FeatureTags, ModalContent, Icons, Colors } from "utils/Constants";

// Feature flag
import { Feature } from "flagged";
import { openSnackbar } from "redux/Slice/Notification";
// Redux
import { useDispatch } from "react-redux";
import { roleByIdThunk, UpdateRoleAgreement } from "redux/Thunks/Role";
import MDButton from "components/MDButton";

function roleAgreement() {
  const [modal, setModal] = useState({
    open: false,
    title: ModalContent.NEW_ROLE,
    type: "save",
    loading: false,
  });
  const [loadingStatus, setLoadingStatus] = useState("pending");
  const [roleAggrementData, setRoleAggrementData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const title = (location?.state?.title || "").replace(/\b\w/g, (match) => match.toUpperCase());
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await dispatch(roleByIdThunk(id));
      if (res.payload.status === 200) {
        setLoadingStatus("fullfilled");
        setRoleAggrementData(res.payload.data.data);
        setPermissions(roleAggrementData);
      } else {
        // Redirect to parent page when error occurs
        // Mostly it will occur on invalid role id
        navigate("/client/setting/role-management");
      }
    })();
  }, [id]);
  const handleConfirmationModalOpen = (modalTitle, modalType) => {
    setModal({
      open: true,
      title: modalTitle,
      type: modalType,
      loading: false,
    });
  };
  const handleClose = () => {
    setModal({
      open: false,
      title: ModalContent.NEW_ROLE,
      type: "save",
      loading: false,
    });
  };
  const handlePermissionsChange = (updatedPermissions) => {
    setPermissions(updatedPermissions);
  };
  const { columns, rows } = RoleData({
    roleAggrementData,
    onPermissionsChange: handlePermissionsChange,
  });
  const updateRoleAgreement = async () => {
    const body = {
      agreements: permissions,
    };
    const res = await dispatch(UpdateRoleAgreement(body));
    if (res.payload.status === 200) {
      handleClose();
      await dispatch(roleByIdThunk(id));
      await dispatch(
        openSnackbar({
          message: Constants.ROLE_ASSIGNED_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else {
      handleClose();
      await dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleReload = async () => {
    setLoadingStatus("pending");
    await dispatch(roleByIdThunk(id));
    setLoadingStatus("fullfilled");
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Page Title */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <PageTitle title={`${title} ${PageTitles.ROLE_AGGREMENT}`} />
        <MDBox display="flex" flexDirection="row">
          <MDButton
            color="info"
            disabled={!permissions || permissions.length === 0}
            style={{ textTransform: "none", boxShadow: "none" }}
            onClick={handleConfirmationModalOpen}
          >
            Save
          </MDButton>
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
      <Feature name={FeatureTags.ROLE_MANAGEMENT}>
        {/* Role Aggrement Table */}
        <MDBox mt={5}>
          <Grid item xs={12}>
            <Card>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 25 }}
                  showTotalEntries={false}
                  noEndBorder
                  loading={loadingStatus}
                />
              </MDBox>
            </Card>
          </Grid>
        </MDBox>
        <ConfirmationModal
          open={modal.open}
          title={ModalContent.ASSIGN_ROLE_TITLE}
          message={ModalContent.ASSIGN_ROLE_MESSAGE}
          handleClose={handleClose}
          handleAction={updateRoleAgreement}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default roleAgreement;
