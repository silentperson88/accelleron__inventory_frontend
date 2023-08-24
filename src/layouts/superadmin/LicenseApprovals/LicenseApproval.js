import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import licenseData from "layouts/superadmin/LicenseApprovals/data/licenseData";
import ConfirmationModal from "examples/modal/ConfirmationModal";
import { useDispatch } from "react-redux";
import { pendingLicenseThunk, pendingActionThunk } from "redux/Thunks/License";
import { openSnackbar } from "redux/Slice/Notification";
import Constants from "utils/Constants";

function index() {
  const dispatch = useDispatch();
  const [pendingRequest, setPendingRequest] = useState({
    list: [],
    loadingStatus: "pending",
    refresh: false,
  });
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const handleApproveClose = () => setOpenApprove(false);
  const handleRejectClose = () => setOpenReject(false);

  useEffect(() => {
    (async () => {
      const res = await dispatch(pendingLicenseThunk());
      if (res.payload?.status === 200) {
        setPendingRequest({
          list: res.payload.data.data,
          loadingStatus: "fullfilled",
        });
      } else {
        setPendingRequest({
          list: [],
          loadingStatus: "rejected",
        });
      }
    })();
  }, [pendingRequest.refresh]);

  const openConfirmationBox = (id, type) => {
    setSelectedId(id);
    if (type === "approve") {
      setOpenApprove(true);
    } else {
      setOpenReject(true);
    }
  };

  const handlePendingAction = async (body) => {
    const data = { id: selectedId, body };
    const res = await dispatch(pendingActionThunk(data));
    if (res.payload?.status === 200) {
      setPendingRequest({
        ...pendingRequest,
        refresh: !pendingRequest.refresh,
      });
      dispatch(openSnackbar({ message: res.payload?.data.message, notificationType: "success" }));
    } else {
      dispatch(
        openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
      );
    }
    if (body.action === "approve") {
      setOpenApprove(false);
    } else {
      setOpenReject(false);
    }
  };

  const { columns, rows } = licenseData(pendingRequest.list, openConfirmationBox);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center" fullWidth>
        <PageTitle title="License Approval" />
      </MDBox>

      <MDBox mt={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={pendingRequest.loadingStatus}
        />
      </MDBox>
      <ConfirmationModal
        title="Approve Permission"
        open={openApprove}
        handleClose={handleApproveClose}
        handleAction={handlePendingAction}
      />

      <ConfirmationModal
        title="Reject Permission"
        open={openReject}
        handleClose={handleRejectClose}
        handleAction={handlePendingAction}
      />
    </DashboardLayout>
  );
}
export default index;
