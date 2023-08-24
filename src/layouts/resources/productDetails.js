import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { Divider } from "@mui/material";

// Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import pxToRem from "assets/theme/functions/pxToRem";
import FullScreenImageComponent from "components/ViewFullImage/ViewImage";
import EquipmentDetailDrawer from "examples/Drawers/Equiupment/EquipmentDetail";
import DeleteModal from "examples/modal/deleteModal/deleteModal";

// Data
import DataTable from "examples/Tables/DataTable";
import ProductData from "layouts/resources/data/productData";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import ProductListThunk, { equipmentDeleteThunk } from "redux/Thunks/Equipment";
import { reloadData } from "redux/Slice/Equipment";

// Constants
import Constants, { Icons, Colors, ModalContent, PageTitles, defaultData } from "utils/Constants";

function productDetails() {
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: 10,
  });
  const [next, setNext] = useState(0);
  const [equipmentId, setEquipmentId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  // use for handling equipment drawer
  const [equipmentAnchor, setEquipmentAnchor] = useState({ right: false });
  const [equipmentDrawerId, setEquipmentDrawerId] = useState("");
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product);

  const fetchProductList = async () => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const data = new URLSearchParams({
      page: 0,
      perPage: tablePagination.perPage,
    });
    await dispatch(ProductListThunk(data));
  };
  useEffect(() => {
    (async () => {
      await fetchProductList();
    })();
  }, []);

  const handleImageFullView = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };
  const handleCloseFullView = () => {
    setFullScreenImage(null);
  };

  // open Equipment drawer from rigth
  const handleOpenEquipmentDetailDrawer = async (id) => {
    setEquipmentAnchor({ right: true });
    setEquipmentDrawerId(id);
  };
  const handleCloseEquipmentDetailDrawer = async (id) => {
    setEquipmentAnchor({ right: false });
    setEquipmentDrawerId(id);
  };
  const handleDeleteOpen = (id) => {
    setEquipmentId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setEquipmentId("");
  };
  const handleDeleteEquipment = async () => {
    const res = await dispatch(equipmentDeleteThunk(equipmentId));
    if (res.payload.status === 200) {
      await fetchProductList();
      handleCloseDeleteModal();

      await dispatch(
        openSnackbar({
          message: Constants.EQUIPMENT_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      await dispatch(
        openSnackbar({
          message: Constants.EQUIPMENT_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setEquipmentId("");
  };
  // Equipment Table data
  const { columns, rows } = ProductData(
    productList.list,
    handleImageFullView,
    handleDeleteOpen,
    handleOpenEquipmentDetailDrawer
  );

  const handleTablePagination = async () => {
    const data = new URLSearchParams({
      page: next + 1,
      perPage: tablePagination.perPage,
    });
    const res = await dispatch(ProductListThunk(data));
    if (res.payload.status === 200) setNext(res.payload.data.data.length > 0 ? next + 1 : next);
  };

  const handleReload = async () => {
    await dispatch(reloadData());
    fetchProductList();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center" fullWidth>
        <PageTitle title={PageTitles?.EQUIPMENT} />
        <MDBox display="flex" flexDirection="row">
          <Link to="/client/register">
            <CustomButton
              title="Register"
              icon="add_circle_outline"
              background="#191A51"
              color="#ffffff"
            />
          </Link>
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

      <MDBox mt={3}>
        {/* Equipments Table */}
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: defaultData.PER_PAGE_2 }}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={productList.loading}
          licenseRequired
          currentPage={tablePagination.page}
          handleTablePagination={handleTablePagination}
          handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
        />
      </MDBox>

      {equipmentAnchor.right && (
        <EquipmentDetailDrawer
          equipmentAnchor={equipmentAnchor}
          equipmentId={equipmentDrawerId}
          closeDrawer={handleCloseEquipmentDetailDrawer}
          handleViewImage={handleImageFullView}
        />
      )}
      <FullScreenImageComponent
        fullScreenImage={fullScreenImage}
        handleCloseFullView={handleCloseFullView}
        src={fullScreenImage}
      />
      <DeleteModal
        open={deleteModalOpen}
        title={ModalContent.DELETE_EQUIPMENT_TITLE}
        message={ModalContent.DELETE_EQUIPMENT_MESSAGE}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteEquipment}
      />
    </DashboardLayout>
  );
}

export default productDetails;
