import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import ClientData from "layouts/superadmin/dashboard/data/Client";

import NewAdmin from "examples/modal/NewAdmin";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import licenseListThunk from "redux/Thunks/License";
import AdminListThunk from "redux/Thunks/SuperAdmin";
import { Backdrop } from "@mui/material";
import { Icons } from "utils/Constants";

function index() {
  const [open, setOpen] = useState(false);
  const [switchToAdminPanel, setSwitchToAdminPanel] = useState(false);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: 20,
  });
  const adminList = useSelector((state) => state.superadmin);
  const dispatch = useDispatch();

  const { columns, rows } = ClientData(adminList.lists, setSwitchToAdminPanel);

  const fetchClientList = async () => {
    setTablePagination({ ...tablePagination, page: 0 });
    const data = new URLSearchParams({
      page: 0,
      perPage: tablePagination.perPage,
    });
    await dispatch(AdminListThunk(data));
  };

  useEffect(() => {
    (async () => {
      await fetchClientList();
      await dispatch(licenseListThunk());
    })();
  }, []);

  const handleOpen = async () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleTablePagination = async (page) => {
    setTablePagination({ ...tablePagination, page: page - 1 });
    const data = new URLSearchParams({
      page,
      perPage: 10,
    });
    await dispatch(AdminListThunk(data));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <PageTitle title="Companies" />
        <CustomButton
          title="Company"
          icon="add_circle_outline"
          background="#191A51"
          color="#ffffff"
          openModal={handleOpen}
        />
      </MDBox>
      {open && <NewAdmin open={open} handleClose={handleClose} fetchClientList={fetchClientList} />}
      <MDBox pt={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
          loading={adminList.loading}
          currentPage={tablePagination.page}
          handleTablePagination={handleTablePagination}
        />

        {switchToAdminPanel && <Backdrop open={switchToAdminPanel}>{Icons.LOADING2}</Backdrop>}
      </MDBox>
    </DashboardLayout>
  );
}

export default index;
