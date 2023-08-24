import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Material Components
import { Divider } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import WarehouseData from "layouts/warehouse/data/WarehouseData";
import CustomButton from "examples/NewDesign/CustomButton";
import pxToRem from "assets/theme/functions/pxToRem";

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
import { warehouseDeleteThunk, warehouseListThunk } from "redux/Thunks/Warehouse";
import { reloadWarehouse, removeWarehouse } from "redux/Slice/Warehouse";

// 3rd Party lib
import { Feature } from "flagged";

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
  const [warehouseId, setWarehouseId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);

  const { list = [], loading = "pending" } = useSelector((state) => state.Warehouse);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteOpen = (id) => {
    setWarehouseId(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setWarehouseId("");
  };

  const handleAddWarehouse = () => {
    navigate("/client/setting/add-warehouse");
  };

  const { columns, rows } = WarehouseData(list, handleDeleteOpen);
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
    await dispatch(warehouseListThunk(data));
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

  const handleDeleteWarehouse = async () => {
    const res = await dispatch(warehouseDeleteThunk(warehouseId));
    if (res.payload.status === 200) {
      await dispatch(removeWarehouse(warehouseId));
      await dispatch(
        openSnackbar({
          message: Constants.WAREHOUSE_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      await dispatch(
        openSnackbar({
          message: Constants.WAREHOUSE_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    handleCloseDeleteModal();
  };

  const handleTablePagination = async () => {
    const paramData = {
      page: next + 1,
      perPage: tablePagination.perPage,
      isActive: filters[0].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    const data = new URLSearchParams(paramData);
    const res = await dispatch(warehouseListThunk(data));
    if (res.payload.status === 200) setNext(res.payload.data.length > 0 ? next + 1 : next);
  };
  const handleReload = async () => {
    await dispatch(reloadWarehouse());
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.WAREHOUSE} />
        <MDBox mt={{ lg: 0, sm: 2 }} display="flex" flexWrap="wrap">
          <CustomButton
            key="warehouse-create"
            title={ButtonTitles.NEW_WAREHOUSE}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={handleAddWarehouse}
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
      <Feature name={FeatureTags.WAREHOUSE}>
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
            loading={loading}
            // licenseRequired
            currentPage={tablePagination.page}
            handleTablePagination={handleTablePagination}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
          />
        </MDBox>

        {/* Delete Modal for Report type */}
        <DeleteModal
          open={deleteModalOpen}
          title={ModalContent.DELETE_WAREHOUSE_MESSAGE}
          message={ModalContent.DELETE_WAREHOUSE_TITLE}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDeleteWarehouse}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default reports;
