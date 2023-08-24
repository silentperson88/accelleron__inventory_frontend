import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Material Components
import { Box, Divider } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import ProductData from "layouts/resources/data/productData";
import CustomButton from "examples/NewDesign/CustomButton";
import FullScreenImageComponent from "components/ViewFullImage/ViewImage";
import EquipmentDetailDrawer from "examples/Drawers/Equiupment/EquipmentDetail";
import pxToRem from "assets/theme/functions/pxToRem";
import Frame from "assets/images/Frame.png";

// Constant
import Constants, {
  ButtonTitles,
  Icons,
  ModalContent,
  PageTitles,
  FeatureTags,
  defaultData,
  Colors,
} from "utils/Constants";

// Redux component
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import { productByWarehouseIdThunk } from "redux/Thunks/Warehouse";
import { reloadWarehouse, removeEquipment } from "redux/Slice/Warehouse";

// 3rd Party lib
import { Feature } from "flagged";
import styled from "@emotion/styled";
import MDAvatar from "components/MDAvatar/index";
import MDTypography from "components/MDTypography";
import { equipmentDeleteThunk } from "redux/Thunks/Equipment";

const StyledMDBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),

  borderRadius: theme.spacing(1),
  border: "1px solid #E0E6F5",
  background: "var(--base-white, #FFF)",

  /* Shadow/sm */
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",

  padding: theme.spacing(`${pxToRem(30)} ${pxToRem(30)}`), // Default padding for all breakpoints
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(30)}`), // Adjust padding for small screens and below
    // flex direction row
    flexDirection: "column",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(20)}`), // Adjust padding for small screens and below
    // flex direction column
    flexDirection: "column",
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(10)}`), // Adjust padding for extra-small screens
    // flex direction column
    flexDirection: "column",
  },
}));

function reports() {
  const [filters, setFilters] = useState([
    {
      inputLabel: "Status",
      list: [
        { [Constants.MONGOOSE_ID]: "all", title: "All" },
        {
          [Constants.MONGOOSE_ID]: "true",
          title: "Active",
        },
        {
          [Constants.MONGOOSE_ID]: "false",
          title: "Inactive",
        },
      ],
      selectedValue: "all",
    },
  ]);

  // Load warehouseId at edit, delete, status change and view
  const [equipmentId, setEquipmentId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [equipmentAnchor, setEquipmentAnchor] = useState({ right: false });
  const [equipmentDrawerId, setEquipmentDrawerId] = useState("");
  const ConfigData = useSelector((state) => state.config);
  const equipmentPermission = ConfigData?.screens?.[8]?.screensInfo?.agreement;
  const warehousePermission = ConfigData?.screens?.[9]?.screensInfo?.agreement;
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const { id } = useParams();

  const { warehouseProduct, warehouseProductsLoading = "pending" } = useSelector(
    (state) => state.Warehouse
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteOpen = (equipId) => {
    setEquipmentId(equipId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setEquipmentId("");
  };

  const handleProductWarehouse = () => {
    navigate("/client/register");
  };

  const handleEditWarehouse = (warehouse) => {
    const warehouseInfo = {
      [Constants.MONGOOSE_ID]: warehouse?.[Constants.MONGOOSE_ID],
      name: warehouse?.name || "",
      country: warehouse.country.toUpperCase().replace("_", " ") || "",
      state: warehouse?.state || "",
      city: warehouse?.city || "",
      street: warehouse?.street || "",
      zipCode: warehouse?.zipCode || "",
      contactNumber: warehouse?.contactNumber || "",
      email: warehouse?.email || "",
      image: warehouse?.image || "",
      isActive: warehouse?.isActive || "",
    };
    navigate("/client/setting/add-warehouse", { state: { warehouse: warehouseInfo } });
  };

  const handleImageFullView = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const handleCloseFullView = () => {
    setFullScreenImage(null);
  };

  // open Equipment drawer from rigth
  const handleOpenEquipmentDetailDrawer = async (equipId) => {
    setEquipmentAnchor({ right: true });
    setEquipmentDrawerId(equipId);
  };
  const handleCloseEquipmentDetailDrawer = async (equipId) => {
    setEquipmentAnchor({ right: false });
    setEquipmentDrawerId(equipId);
  };

  const { columns, rows } = ProductData(
    warehouseProduct?.equipment,
    handleImageFullView,
    handleDeleteOpen,
    handleOpenEquipmentDetailDrawer
  );

  const handleFilter = async (filterVale = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      isActive: filterVale[0].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    await dispatch(productByWarehouseIdThunk({ id, params: data }));
  };

  useEffect(() => {
    (async () => {
      handleFilter();
    })();
  }, []);

  const handleFilterChange = (e) => {
    const temp = [...filters];
    const { value } = e.target;
    const index = filters.findIndex((filter) => filter.inputLabel === e.target.name);
    temp[index].selectedValue = value;
    setFilters(temp);
    handleFilter(temp);
  };

  const handleDeleteEquipment = async () => {
    const res = await dispatch(equipmentDeleteThunk(equipmentId));
    if (res.payload.status === 200) {
      await dispatch(removeEquipment(equipmentId));
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
    setDeleteModalOpen(false);
  };

  const handleTablePagination = async () => {
    const paramData = {
      page: next + 1,
      perPage: tablePagination.perPage,
      isActive: filters[0].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    const data = new URLSearchParams(paramData);
    const res = await dispatch(productByWarehouseIdThunk(data));
    if (res.payload.status === 200) setNext(res.payload.data.length > 0 ? next + 1 : next);
  };
  const handleReload = async () => {
    await dispatch(reloadWarehouse());
    handleFilter();
  };

  const warehouseDetails = (info) => (
    <MDTypography
      sx={{
        mt: 1,
        color: "var(--gray-600, #475467)",
        fontFamily: "Inter",
        fontSize: pxToRem(16),
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: pxToRem(16),
      }}
    >
      {info}
    </MDTypography>
  );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.WAREHOUSE_DETAILS} />
        <MDBox mt={{ lg: 0, sm: 2 }} display="flex" flexWrap="wrap">
          <BasicButton
            icon={Icons.RELOAD}
            background={Colors.WHITE}
            border
            color={Colors.BLACK}
            action={handleReload}
          />
        </MDBox>
      </MDBox>
      <Feature name={FeatureTags.WAREHOUSE}>
        <Divider sx={{ marginTop: 2 }} />
        <StyledMDBox>
          <MDBox
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <MDAvatar variant="rounded" sx={{ width: "fit-content", height: "fit-content" }}>
              <img
                src={warehouseProduct?.warehouseDetails?.image || Frame}
                alt="warehouse"
                loading="lazy"
                width={100}
                height="auto"
              />
            </MDAvatar>
            <MDBox
              ml={{ xs: 0, sm: 2 }}
              mt={{ xs: 2, sm: 0 }}
              sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
            >
              <MDTypography
                variant="h4"
                fontWeight="medium"
                mb={1}
                width={{ xs: "100%", sm: "auto" }}
                textAlign={{ xs: "center", sm: "left" }}
                textTransform="capitalize"
              >
                {warehouseProduct?.warehouseDetails?.name}
              </MDTypography>
              {warehouseDetails(`Email: ${warehouseProduct?.warehouseDetails?.email || ""}`)}
              {warehouseDetails(
                `Phone Number: ${warehouseProduct?.warehouseDetails?.contactNumber?.in || ""} ${
                  warehouseProduct?.warehouseDetails?.contactNumber?.number || ""
                }`
              )}
              {warehouseDetails(
                `Address: ${warehouseProduct?.warehouseDetails?.street || ""}, ${
                  warehouseProduct?.warehouseDetails?.city || ""
                } ${warehouseProduct?.warehouseDetails?.state || ""} ${
                  warehouseProduct?.warehouseDetails?.zipCode || ""
                } ${warehouseProduct?.warehouseDetails?.country || ""}`
              )}
            </MDBox>
          </MDBox>
          <MDBox display="flex" flexDirection={{ xs: "column", xl: "row" }} gap={1}>
            {warehousePermission && warehousePermission?.update && (
              <BasicButton
                title={ButtonTitles.EDIT_DETAILS}
                icon={Icons.EDIT}
                background={Colors.WHITE}
                color={Colors.BLACK}
                border
                action={() => handleEditWarehouse(warehouseProduct?.warehouseDetails)}
              />
            )}
            {equipmentPermission && equipmentPermission?.create && (
              <CustomButton
                key="warehouse-create"
                title={ButtonTitles.ADD_PRODUCT}
                icon={Icons.ADD}
                background={Colors.PRIMARY}
                color={Colors.WHITE}
                openModal={handleProductWarehouse}
              />
            )}
          </MDBox>
        </StyledMDBox>
        <MDBox display="flex" justifyContent="space-between">
          {filters &&
            filters.map((val) => (
              <FilterDropdown
                label={val.inputLabel}
                name={val.inputLabel}
                defaultValue={val?.selectedValue}
                value={val?.selectedValue}
                handleChange={handleFilterChange}
                menu={val.list}
                key={val.inputLabel}
              />
            ))}
        </MDBox>
        <MDBox mt={3} mb={3}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
            showTotalEntries={false}
            noEndBorder
            loading={warehouseProductsLoading}
            // licenseRequired
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

        {/* Delete Modal for Report type */}
        <DeleteModal
          open={deleteModalOpen}
          title={ModalContent.DELETE_EQUIPMENT_TITLE}
          message={ModalContent.DELETE_EQUIPMENT_MESSAGE}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDeleteEquipment}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default reports;
