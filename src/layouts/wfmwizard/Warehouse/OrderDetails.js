import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Material Components
import { Autocomplete, Box, Divider, Grid, InputAdornment, Tooltip } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import OrderDetailsData from "layouts/wfmwizard/Warehouse/data/OderDetailData";
// import CustomButton from "examples/NewDesign/CustomButton";
import pxToRem from "assets/theme/functions/pxToRem";
// import Frame from "assets/images/Frame.png";

// Constant
import Constants, {
  // ButtonTitles,
  Icons,
  ModalContent,
  PageTitles,
  FeatureTags,
  defaultData,
  Colors,
  // LicensePermission,
} from "utils/Constants";

// Redux component
import { useDispatch } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import { productByWarehouseIdThunk } from "redux/Thunks/Warehouse";
import { reloadWarehouse, removeEquipment } from "redux/Slice/Warehouse";

// 3rd Party lib
import { Feature } from "flagged";
import styled from "@emotion/styled";
import MDAvatar from "components/MDAvatar/index";
import MDTypography from "components/MDTypography";
import { equipmentDeleteThunk } from "redux/Thunks/Equipment";
import MDInput from "components/MDInput";

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
          [Constants.MONGOOSE_ID]: "pending",
          title: "Pending",
        },
        {
          [Constants.MONGOOSE_ID]: "aproved",
          title: "Approved",
        },
        {
          [Constants.MONGOOSE_ID]: "rejected",
          title: "Rejected",
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

  const { columns, rows } = OrderDetailsData(handleDeleteOpen);

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

  // JSX component that arranges title, value and subvalue in a column and value as bolr
  const orderinfo = (title, value = "", subValue = "") => (
    <MDBox display="flex" flexDirection="column" alignItems="start" justifyContent="space-between">
      <MDTypography
        mb={pxToRem(8)}
        sx={{
          color: "var(--gray-600, #475467)",
          fontFamily: "Inter",
          fontSize: pxToRem(16),
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: pxToRem(16),
        }}
      >
        {title}
      </MDTypography>
      <MDTypography
        sx={{
          mb: 1,
          color: "var(--gray-600, #475467)",
          fontFamily: "Inter",
          fontSize: pxToRem(16),
          fontStyle: "normal",
          fontWeight: 400,

          lineHeight: pxToRem(16),
        }}
      >
        {value}
      </MDTypography>
      <Tooltip title={subValue}>
        <MDTypography
          variant="caption"
          sx={{
            textTransform: "capitalize",
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {subValue}
        </MDTypography>
      </Tooltip>
    </MDBox>
  );

  // const actionsButton = [
  //   {
  //     title: ButtonTitles.PENDING,
  //     permission: LicensePermission.WAREHOUSE,
  //     icon: Icons.ARROW_DOWN,
  //     background: Colors.WHITE,
  //     color: Colors.DARK_YELLOW,
  //     borderColor: Colors.DARK_YELLOW,
  //     //   openModal: setOpenSafeModal,
  //     btnType: "basic",
  //   },
  //   {
  //     title: ButtonTitles.REJECTED,
  //     permission: LicensePermission.WAREHOUSE,
  //     icon: Icons.REJECTED,
  //     background: Colors.WHITE,
  //     color: Colors.DARK_RED,
  //     borderColor: Colors.DARK_RED,
  //     //   openModal: setOpenNCRModal,
  //     btnType: "basic",
  //   },
  //   {
  //     title: ButtonTitles.APPROVED,
  //     permission: LicensePermission.WAREHOUSE,
  //     icon: Icons.APPROVED,
  //     background: Colors.SUCCESS,
  //     color: Colors.WHITE,
  //     //   openModal: setOpenUnsafeModal,
  //     btnType: "custom",
  //   },
  // ];

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
      <Feature name={FeatureTags.WAREHOUSE}>
        <MDBox display="flex" justifyContent="space-between">
          <PageTitle title={`${PageTitles.ORDER_DETAIL} 1025`} />
          {/* <MDBox mt={{ lg: 0, sm: 2 }} display="flex" flexWrap="wrap"> */}
          {/* {actionsButton.map((item) => {
              if (item.btnType === "basic") {
                return (
                  <BasicButton
                    title={item.title}
                    icon={item.icon}
                    background={item.background}
                    border
                    borderColor={item.borderColor}
                    color={item.color}
                    //   action={handleReload}
                  />
                );
              }
              return (
                <CustomButton
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  background={item.background}
                  color={item.color}
                  // openModal={item.openModal}
                />
              );
            })} */}
          {/* <Divider
              orientation="vertical"
              sx={{
                backgroundColor: "var(--gray-300, #D0D5DD)",
                height: "auto",
                marginLeft: pxToRem(16),
                marginRight: 0,
              }}
            /> */}
          {/* </MDBox> */}
        </MDBox>
        <Divider sx={{ marginTop: 2 }} />
        <StyledMDBox>
          <MDBox
            width="100%"
            display="flex"
            flexDirection={{ xs: "column" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <MDTypography
              variant="h4"
              fontWeight="medium"
              mb={3}
              width={{ xs: "100%", sm: "auto" }}
              textAlign={{ xs: "center", sm: "left" }}
              textTransform="capitalize"
            >
              Porject A
            </MDTypography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <MDBox mb={1} display="flex" flexDirection="column" alignItems="start">
                  <MDTypography
                    mb={pxToRem(8)}
                    variant="caption"
                    fontWeight="regular"
                    width={{ xs: "100%", sm: "auto" }}
                    textAlign={{ xs: "center", sm: "left" }}
                    textTransform="capitalize"
                  >
                    Requested By
                  </MDTypography>
                  <MDBox display="flex" flexDirection="row" alignItems="center">
                    <MDAvatar sx={{ width: "fit-content", height: "fit-content" }}>
                      <img
                        src="https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/EquipmentDocument/E9CWZOp5EnG0mHZ_IMG-20230815-WA0008.jpg"
                        alt="warehouse"
                        loading="lazy"
                        width={40}
                        height="auto"
                      />
                    </MDAvatar>
                    <MDBox ml={1} display="flex" flexDirection="column">
                      <MDTypography
                        variant="h6"
                        fontWeight="medium"
                        width={{ xs: "100%", sm: "auto" }}
                        textAlign={{ xs: "center", sm: "left" }}
                        textTransform="capitalize"
                      >
                        Jane Cooper
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        fontWeight="regular"
                        width={{ xs: "100%", sm: "auto" }}
                      >
                        27/02/2023
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={2}>
                {orderinfo("Requested Items", "4", "55 Qty")}
              </Grid>
              <Grid item xs={12} sm={2}>
                {orderinfo("Targeted date", "01/06/2023 - 10/06/2023", "10 Days ")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {orderinfo(
                  "Remark",
                  "",
                  "Lorem ipsum dolor sit amet consectetur. Tortor aliquet velit eget nisi vel quisque odiojusto. Suscipit parturient turpis maecenas ac eleifend integer."
                )}
              </Grid>
            </Grid>
            {/* </MDBox> */}
          </MDBox>
        </StyledMDBox>
        <MDBox display="flex" justifyContent="space-between">
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

          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="start"
            sx={{ mt: pxToRem(45), mr: 1 }}
          >
            <BasicButton
              title="Print"
              icon={Icons.PRINT}
              background={Colors.WHITE}
              border
              color={Colors.BLACK}
              //   action={handleReload}
            />
            <BasicButton
              title="Export"
              icon={Icons.EXPORT}
              background={Colors.WHITE}
              border
              color={Colors.BLACK}
              //   action={handleReload}
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
        <MDBox mt={3} mb={3}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
            showTotalEntries={false}
            noEndBorder
            loading="fullfilled"
            // licenseRequired
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
