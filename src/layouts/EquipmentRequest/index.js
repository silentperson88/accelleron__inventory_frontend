import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Material Components
import { Autocomplete, Divider, InputAdornment } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import EquipmentRequestData from "layouts/EquipmentRequest/data/EquipmentRequestData";
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
  LicensePermission,
} from "utils/Constants";

// Redux component
import { useDispatch } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import { productByWarehouseIdThunk } from "redux/Thunks/Warehouse";
import { reloadWarehouse, removeEquipment } from "redux/Slice/Warehouse";

// 3rd Party lib
import { Feature } from "flagged";
import MDTypography from "components/MDTypography";
import { equipmentDeleteThunk } from "redux/Thunks/Equipment";
import MDInput from "components/MDInput";

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

  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const { id } = useParams();

  const dispatch = useDispatch();

  const handleDeleteOpen = (equipId) => {
    setEquipmentId(equipId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setEquipmentId("");
  };

  // open Equipment drawer from rigth
  const { columns, rows } = EquipmentRequestData(handleDeleteOpen);

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

  const actionsButton = [
    {
      title: ButtonTitles.PLACE_ORDER,
      permission: LicensePermission.WAREHOUSE,
      icon: Icons.CHEKOUT,
      background: Colors.SUCCESS,
      color: Colors.WHITE,
      btnType: "custom",
    },
  ];

  const billingComponent = (
    <MDBox
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="end"
    >
      <MDBox width={{ xs: "100%", md: "50%", xl: "30%" }} px={3} pb={3}>
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="regular">
            Total Items
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
            4
          </MDTypography>
        </MDBox>
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="regular">
            Total quantity
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
            595
          </MDTypography>
        </MDBox>
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="regular">
            Total days (01/06/2023 - 10/06/2023)
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
            10
          </MDTypography>
        </MDBox>
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="medium">
            Total amount
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium" sx={{ color: Colors.DARK_ORANGE }}>
            Є6,635
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.EQUIPMENT_REQUESTS} />
        <MDBox mt={{ lg: 0, sm: 2 }} display="flex" flexWrap="wrap">
          {actionsButton.map((item) => (
            <CustomButton
              key={item.title}
              title={item.title}
              icon={item.icon}
              background={item.background}
              color={item.color}
            />
          ))}
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
        <MDBox display="flex">
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
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="start"
            sx={{ mr: 2, mt: pxToRem(20), ml: 0, mb: 0, flexDirection: "column" }}
          >
            <MDTypography
              variant="caption"
              mb={1}
              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
            >
              Search
            </MDTypography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={[]}
              noOptionsText="No data found"
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  padding: 0,
                  height: 40,
                  backgroundColor: "#fff",
                  paddingX: "8px !important",
                  fontSize: pxToRem(14),
                  fontWeight: 600,
                  color: "#344054",
                },
              }}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  pr={0}
                  sx={{ textTransform: "capitalize" }}
                  placeholder="Search"
                  InputProps={{
                    ...params.InputProps,

                    startAdornment: (
                      <InputAdornment position="end">
                        {filters?.[0].isLoading ? Icons.LOADING : Icons.SEACRH}
                      </InputAdornment>
                    ),
                    endAdornment: "",
                  }}
                />
              )}
            />
          </MDBox>
        </MDBox>
        <MDBox mt={3} mb={3}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
            showTotalEntries={false}
            noEndBorder
            loading="fullfilled"
            currentPage={tablePagination.page}
            handleTablePagination={handleTablePagination}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
            extraContent={billingComponent}
          />
        </MDBox>

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
