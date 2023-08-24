import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import SetupCardCategoryModal from "examples/modal/HealthAndSafety/SetupCardCategoryModal";
import PageTitle from "examples/NewDesign/PageTitle";
import EditModal from "examples/modal/EditModal";
import { useDispatch, useSelector } from "react-redux";
import Setuplicensedata from "layouts/wfmwizard/Organization/staticdata/Setuplicensedata";
import licenseListThunk, { accountLicenseThunk, requestLicenseThunk } from "redux/Thunks/License";
import { openSnackbar } from "redux/Slice/Notification";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import { Icons, Colors } from "utils/Constants";

function Setuplicenses() {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedPermission, setSelectedPermission] = useState({});
  const [permission, setPermission] = useState([]);
  const handleClose = () => setOpen(false);
  const [openEdit, setOpenEdit] = useState(false);
  const mongooseId = "_id";

  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpenEdit = (element) => {
    const allowedPermission = element.permissions.map((item) => {
      const a = permission?.filter((val) => val?.permission[mongooseId] === item[mongooseId]);
      return a.length > 0 ? a[0].permission[mongooseId] : null;
    });
    const temp = {
      licence: element[mongooseId],
      permission: allowedPermission.filter((val) => val !== null),
    };

    setSelectedPermission(temp);
    setOpenEdit(true);
    setModalContent(element);
  };
  const licenseList = useSelector((state) => state.License);
  const dispatch = useDispatch();
  const { columns, rows } = Setuplicensedata(licenseList.allLicense, handleOpenEdit, permission);

  useEffect(() => {
    (async () => {
      dispatch(licenseListThunk());
      const res = await dispatch(accountLicenseThunk());
      setPermission(res.payload.data);
    })();
  }, []);

  const handleMultiplePermissions = (event, item) => {
    let temp = { ...selectedPermission };
    if (!event.target.checked) {
      temp = {};
    } else {
      temp = {
        licence: item[mongooseId],
        permission: item.permissions.map((val) => val[mongooseId]),
      };
    }
    setSelectedPermission(temp);
  };

  const handlePermission = (event, item) => {
    let temp = { ...selectedPermission };
    if (!event.target.checked) {
      temp.permission = temp.permission.filter((val) => val !== event.target.id);
    } else if (Object.keys(temp).length > 0) {
      temp.permission.push(event.target.id);
    } else {
      temp = {
        licence: item[mongooseId],
        permission: [event.target.id],
      };
    }
    setSelectedPermission(temp);
  };

  const handleRequest = async () => {
    const body = {
      isRequested: true,
      isRejected: false,
      ...selectedPermission,
    };
    const res = await dispatch(requestLicenseThunk(body));
    await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
    setOpenEdit(false);
  };
  const handleReload = async () => {
    await dispatch(licenseListThunk());
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center" fullWidth>
        <PageTitle title="All Licenses" />
        <BasicButton
          icon={Icons.RELOAD}
          background={Colors.WHITE}
          border
          color={Colors.BLACK}
          action={handleReload}
        />
      </MDBox>
      <SetupCardCategoryModal open={open} handleClose={handleClose} />
      <MDBox mt={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={licenseList.licenseLoading}
        />
      </MDBox>
      <EditModal
        title="Request License"
        openEdit={openEdit}
        handleCloseEdit={handleCloseEdit}
        handleRequest={handleRequest}
      >
        {Object.entries(modalContent).length > 0 ? (
          <MDBox display="flex" flexDirection="column" justifyContent="space-between">
            <FormControlLabel
              label={modalContent.name}
              control={
                <Checkbox
                  checked={modalContent?.permissions?.every((val) =>
                    selectedPermission?.permission?.some((per) => per === val[mongooseId])
                  )}
                  onChange={(e) => handleMultiplePermissions(e, modalContent)}
                />
              }
            />
            {modalContent.permissions.map((per) => (
              <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                <FormControlLabel
                  label={per.name}
                  id={per[mongooseId]}
                  control={
                    <Checkbox
                      checked={
                        selectedPermission?.permission?.filter((val) => val === per[mongooseId])
                          .length > 0
                      }
                      id={per[mongooseId]}
                      name={per.name}
                      onChange={(event) => handlePermission(event, modalContent)}
                    />
                  }
                />
              </Box>
            ))}
          </MDBox>
        ) : null}
      </EditModal>
    </DashboardLayout>
  );
}

export default Setuplicenses;
