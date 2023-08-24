import React, { useEffect, useState } from "react";

// Material component
import { Button, Card, Divider, Grid } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Component
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import NewShift from "examples/modal/shift";
import FilterDropdown from "components/Dropdown/FilterDropdown";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { projectListThunk, dalShitFiltersThunk } from "redux/Thunks/Filter";
import { deleteShiftThunk } from "redux/Thunks/DalShift";
import { openSnackbar } from "redux/Slice/Notification";

// Data
import DailyShiftData from "layouts/dalShiftDetails/data/dailyShiftData";
import DataTable from "examples/Tables/DataTable";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";

// Feature Flag
import { Feature } from "flagged";

// Constant
import Constants, {
  Icons,
  ModalContent,
  PageTitles,
  ButtonTitles,
  Colors,
  FeatureTags,
  defaultData,
} from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import UserListThunk from "redux/Thunks/UserManagement";
import { reloadData, removeShift } from "redux/Slice/DalShift";

function index() {
  const mongooseId = "_id";
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [openNewShift, setOpenNewShift] = useState(false);
  const [filters, setFilters] = useState([
    {
      inputLabel: "Project",
      list: [{ [mongooseId]: "all", title: "All" }],
      selectedValue: "all",
    },
    {
      inputLabel: "Created",
      list: ["All", "Today", "This Week", "This Month", "Last Month", "This Year"],
      selectedValue: "All",
    },
    {
      inputLabel: "Status",
      list: ["All", "Open", "Submitted", "In Discussion", "Closed"],
      selectedValue: "All",
    },
  ]);
  const [selectedId, setSelectedId] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const shiftData = useSelector((state) => state?.dalShift);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[5]?.screensInfo?.agreement;
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const dispatch = useDispatch();

  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const { columns, rows } = DailyShiftData(handleOpenDeleteModal, shiftData?.shiftList);

  const handleFilter = async (temp = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      project: temp[0].selectedValue,
      date: temp[1].selectedValue.replace(/\s+/g, "_").toLowerCase(),
      status: temp[2].selectedValue.replace(/\s+/g, "_").toLowerCase(),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    await dispatch(dalShitFiltersThunk(data));
  };

  const handleDeleteShift = async () => {
    const res = await dispatch(deleteShiftThunk(selectedId));

    if (res.payload.status === 200) {
      await dispatch(removeShift(selectedId));
      dispatch(
        openSnackbar({ message: Constants.SHIFT_DELETE_SUCCESS, notificationType: "success" })
      );
    } else if (res.payload.status === 400) {
      dispatch(openSnackbar({ message: Constants.INVALID_SHIFT, notificationType: "error" }));
    } else if (res.payload.status === 500) {
      dispatch(
        openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
      );
    }
    setDeleteModal(false);
  };

  useEffect(() => {
    handleFilter(filters);
    (async () => {
      const paramObject = {
        isActive: true,
      };
      const param = new URLSearchParams(paramObject);
      const [tempProjectList, res2] = await Promise.all([
        dispatch(projectListThunk()),

        dispatch(UserListThunk(param)),
      ]);

      const temp = [...filters];
      temp[0].list = [{ [mongooseId]: "all", title: "All" }, ...tempProjectList.payload.data];
      setFilters(temp);

      const users = res2.payload.data.data.filter(
        (user) =>
          user.role?.title.toLowerCase() !== defaultData.ADMIN_ROLE &&
          user.role?.title.toLowerCase() !== defaultData.SUPER_ADMIN_ROLE
      );
      setActiveUsers(users);
    })();
  }, []);

  const handleFilterType = async (e) => {
    const temp = [...filters];
    const i = temp.findIndex((item) => item.inputLabel === e.target.name);
    temp[i].selectedValue = e.target.value;
    setFilters(temp);
    await handleFilter(temp);
  };

  const handleReset = async () => {
    const resetFilters = filters.map((filter) => ({
      ...filter,
      selectedValue: filter.list[0][mongooseId] || filter.list[0],
    }));

    setFilters(resetFilters);
    await handleFilter(resetFilters);
  };

  const handleTablePagination = async () => {
    const data = new URLSearchParams({
      page: next + 1,
      perPage: tablePagination.perPage,
      project: filters[0].selectedValue,
      date: filters[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      status: filters[2].selectedValue.toLowerCase().replace(/ /g, "_"),
    });
    const res = await dispatch(dalShitFiltersThunk(data));
    if (res.payload.status === 200)
      setNext(res.payload.data.data.shiftData.length > 0 ? next + 1 : next);
  };

  const handleReload = async () => {
    await dispatch(reloadData());
    handleFilter();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        display="flex"
        flexDirection={{ md: "row", sm: "column" }}
        justifyContent={{ md: "space-between" }}
        alignItems={{ lg: "space-between", sm: "center" }}
      >
        <PageTitle title={PageTitles.DAL_SHIFT} />
        <MDBox mt={{ lg: 0, sm: 2 }} display="flex" flexWrap="wrap">
          {permission?.create && (
            <CustomButton
              title={ButtonTitles.NEW_SHIFT}
              icon={Icons.NEW}
              background={Colors.PRIMARY}
              color={Colors.WHITE}
              openModal={setOpenNewShift}
            />
          )}
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
      <Divider sx={{ marginTop: pxToRem(22) }} />
      <Feature name={FeatureTags.SHIFT_DETAILS}>
        <MDBox display="flex" justifyContent="space-between" mx={0}>
          <MDBox display="flex wrap" flexWrap="wrap" justifyContent="start" mx={0}>
            {filters?.map((val) => (
              <FilterDropdown
                key={val.inputLabel}
                label={val.inputLabel}
                name={val.inputLabel}
                defaultValue={val?.selectedValue}
                value={val?.selectedValue}
                handleChange={handleFilterType}
                menu={val.list}
              />
            ))}
            <Button
              sx={{
                mt: 5.5,
                mr: 1,
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                },
                fontSize: pxToRem(14),
                textTransform: "capitalize",
              }}
              variant="outlined"
              color="info"
              onClick={handleReset}
              startIcon={Icons.RESET_FILTER}
            >
              {ButtonTitles.RESET_FILTER}
            </Button>
          </MDBox>
        </MDBox>
        <MDBox mt={3} mb={3}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: "none" }}>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted
                  entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
                  showTotalEntries={false}
                  noEndBorder
                  loading={shiftData.loading}
                  licenseRequired
                  currentPage={tablePagination.page}
                  handleTablePagination={handleTablePagination}
                  handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
                />
              </MDBox>
            </Card>
          </Grid>
        </MDBox>

        {/* New Shift */}
        {openNewShift && (
          <NewShift
            openShiftModal={openNewShift}
            setOpenShiftModal={setOpenNewShift}
            handleFilter={handleFilter}
            activeUsers={activeUsers}
          />
        )}
        {openDeleteModal && (
          <DeleteModal
            open={openDeleteModal}
            title={ModalContent.SHIFT_DELETE_TITLE}
            message={ModalContent.DELETE_SHIFT}
            handleClose={handleCloseDeleteModal}
            handleDelete={handleDeleteShift}
          />
        )}
      </Feature>
    </DashboardLayout>
  );
}

export default index;
