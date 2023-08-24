/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import NewUser from "examples/modal/NewUser";
import UserBulkUpload from "examples/modal/UserBulkUpload";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import DataTable from "examples/Tables/DataTable";
import PageTitle from "examples/NewDesign/PageTitle";
import Usermanagementdata from "layouts/wfmwizard/System/data/userData";
import { useDispatch, useSelector } from "react-redux";
import UserListThunk, { updateSyncupTime } from "redux/Thunks/UserManagement";
import {
  Autocomplete,
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import Constants, { Icons, defaultData, Colors, countryList } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import MDTypography from "components/MDTypography";
import FormControlErrorStyles from "assets/style/Component";
import MDInput from "components/MDInput";
import { openSnackbar } from "redux/Slice/Notification";
import configThunk from "redux/Thunks/Config";

function Usermanagement() {
  const [open, setOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("pending");
  const [userData, setUserData] = useState([]);
  const [openBulk, setOpenBulk] = useState(false);
  const [syncUptime, setSyncUptime] = useState({
    currentSyncUpTime: 0,
    syncUpTime: Array.from({ length: 24 }, (_hour, hours) =>
      Array.from({ length: 4 }, (_min, index) => ({
        hours: index === 3 ? hours + 1 : hours,
        min: index === 3 ? 0 : (index + 1) * 15,
        id: `${hours}${index}`,
      }))
    ).flat(),
  });
  const { config } = useSelector((state) => state.config);
  let debounceTimeout;

  const [filters, setFilters] = useState([
    {
      inputLabel: "Search",
      list: [{ [Constants.MONGOOSE_ID]: "All", title: "All" }],
      selectedValue: "All",
      isLoading: false,
    },
    {
      inputLabel: "Nationality",
      list: ["All", ...countryList],
      selectedValue: "All",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: 20,
  });
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);

  const handleFilter = async (filterVale = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      nationality: filterVale[1].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    if (filterVale[0].selectedValue !== "All") {
      paramData.search = filterVale[0].selectedValue;
    }

    const data = new URLSearchParams(paramData);
    const res = await dispatch(UserListThunk(data));
    setLoadingStatus("fullfilled");
    setUserData(res.payload.data.data.filter((item) => item.role?.title !== "admin"));
    const temp = [...filters];
    let userList = [];
    if (res.payload?.data?.data) {
      // add error-handling for undefined payload and data
      userList = res.payload.data.data.reduce((acc, item) => {
        if (
          item.role?.title !== defaultData.ADMIN_ROLE &&
          item.role?.title !== defaultData.SUPER_ADMIN_ROLE &&
          item.firstName &&
          item.lastName
        ) {
          // avoid returning null elements and handle undefined first/last name
          acc.push({
            [Constants.MONGOOSE_ID]: item[Constants?.MONGOOSE_ID], // check for existence of Constants object to avoid errors
            title: `${item.firstName} ${item.lastName}`,
          });
        }
        return acc;
      }, []);
    }
    temp[0].list = [{ [Constants.MONGOOSE_ID]: "All", title: "All" }, ...userList];
    setFilters(temp);
  };

  useEffect(() => {
    (async () => {
      handleFilter();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (config?.[0]?.syncUpTime) {
        const index = syncUptime.syncUpTime.findIndex(
          (val) =>
            val.hours === parseInt(config?.[0]?.syncUpTime?.hours, 10) &&
            val.min === parseInt(config?.[0]?.syncUpTime?.min, 10)
        );
        setSyncUptime((prev) => {
          const temp = { ...prev };
          temp.currentSyncUpTime = index;
          return temp;
        });
      }
    })();
  }, [config]);

  const handleOpenBulk = () => setOpenBulk(true);
  const handleCloseBulk = () => setOpenBulk(false);

  const { columns, rows } = Usermanagementdata(userData, handleFilter);

  const handleFilterChange = (e) => {
    const temp = [...filters];
    const { value } = e.target;
    if (value) {
      const index = filters.findIndex((filter) => filter.inputLabel === e.target.name);
      temp[index].selectedValue = value;
      setFilters(temp);
      handleFilter(temp);
    }
  };

  const handleSearch = async (e) => {
    if (e.target.value === "") return;
    setFilters((prev) => {
      const temp = [...prev];
      temp[0].isLoading = true;
      return temp;
    });
    setTablePagination({ ...tablePagination, page: 0 });

    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      nationality: filters[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      search: e.target.value,
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    const res = await dispatch(UserListThunk(data));
    const temp = [...filters];
    const userList = res.payload.data.data
      .filter((item) => item.role?.title !== defaultData.ADMIN_ROLE)
      .map((item) => ({
        [Constants.MONGOOSE_ID]: item[Constants.MONGOOSE_ID],
        title: `${item.firstName} ${item.lastName}`,
      }));
    temp[0].list = [{ [Constants.MONGOOSE_ID]: "all", title: "All" }, ...userList];
    temp[0].isLoading = false;
    setFilters(temp);
  };
  const debouncedHandleSearch = (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => handleSearch(e), 300);
  };

  const handleSyncUptime = async (e) => {
    const index = syncUptime.syncUpTime.findIndex((val) => val.id === e.target.value);
    const paramAndBody = {
      body: {
        syncUpTime: {
          hours: syncUptime.syncUpTime[index].hours,
          min: syncUptime.syncUpTime[index].min,
        },
      },
      accountId: config?.[0]?.accountId,
    };
    const res = await dispatch(updateSyncupTime(paramAndBody));
    if (res.payload.status === 200) {
      await dispatch(configThunk());
      await dispatch(
        openSnackbar({
          message: Constants.SYNC_UP_TIME_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else {
      dispatch(
        openSnackbar({
          message: Constants.SYNC_UP_TIME_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleReload = async () => {
    setLoadingStatus("pending");
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        {open && <NewUser open={open} handleClose={handleClose} handleFilter={handleFilter} />}
        {openBulk && <UserBulkUpload openBulk={openBulk} handleCloseBulk={handleCloseBulk} />}
        <PageTitle title="User Management" />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title="New"
            icon="add_circle_outline"
            background="#191A51"
            color="#ffffff"
            openModal={setOpen}
          />
          <CustomButton
            title="Bulk Upload"
            icon="add_circle_outline"
            background="#D3D3D3"
            color="#ffffff"
            openModal={handleOpenBulk}
            disabled
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
      <Divider sx={{ marginTop: pxToRem(22) }} />

      {/* Search and filter */}
      <MDBox display="flex" alignItems="center" mt={pxToRem(20)}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          sx={{ flexDirection: "column", mr: 2 }}
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
            options={filters[0]?.list.map((val) => val.title) || []}
            value={filters[0].selectedValue}
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
                InputProps={{
                  ...params.InputProps,

                  endAdornment: (
                    <InputAdornment position="end">
                      {filters[0].isLoading ? Icons.LOADING : Icons.SEACRH}
                    </InputAdornment>
                  ),
                }}
              />
            )}
            onChange={(e, value) => {
              handleFilterChange({
                target: {
                  name: filters[0].inputLabel,
                  value,
                },
              });
            }}
            onKeyUp={debouncedHandleSearch}
          />
        </MDBox>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          sx={{ flexDirection: "column", mr: 2 }}
        >
          <FormControl
            sx={{
              ml: 0,
              mb: 0,
              minWidth: 150,
              maxHeight: 400,
              ...FormControlErrorStyles,
            }}
            size="small"
          >
            <MDTypography
              variant="caption"
              mb={1}
              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
            >
              Nationality
            </MDTypography>
            <Select
              displayEmpty
              labelId="demo-select-small"
              id="demo-select-small"
              name={filters[1].inputLabel}
              value={filters[1]?.selectedValue}
              sx={{
                height: 40,
                color: "black",
                fontWeight: 600,
                backgroundColor: "#fff",
                paddingY: "0.65rem",
                paddingRight: "0.55rem",
                maxHeight: 100,
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                PaperProps: {
                  style: {
                    height: 200,
                    opacity: 1,
                    transform: "none",
                    top: 183,
                    left: 442,
                  },
                },
              }}
              onChange={handleFilterChange}
              IconComponent={Icons.DROPDOWN}
            >
              {filters[1].list.map((item) => (
                <MenuItem
                  value={item}
                  sx={{
                    textTransform: "capitalize",
                    maxHeight: 400,
                    fontSize: pxToRem(14),
                    fontWeight: 400,
                    color: "#344054",
                  }}
                  key={item}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          sx={{ flexDirection: "column", mr: 2 }}
        >
          <FormControl
            sx={{
              ml: 0,
              mb: 0,
              minWidth: 150,
              maxHeight: 400,
              ...FormControlErrorStyles,
            }}
            size="small"
          >
            <MDTypography
              variant="caption"
              mb={1}
              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
            >
              Sync Up Time
            </MDTypography>
            <Select
              value={syncUptime.syncUpTime[syncUptime.currentSyncUpTime]?.id}
              sx={{
                height: 40,
                color: "black",
                fontWeight: 600,
                backgroundColor: "#fff",
                paddingY: "0.65rem",
                paddingRight: "0.55rem",
                maxHeight: 100,
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                PaperProps: {
                  style: {
                    width: pxToRem(150),
                    height: 200,
                    opacity: 1,
                    transform: "none",
                    top: 183,
                    left: 442,
                  },
                },
              }}
              onChange={handleSyncUptime}
              IconComponent={Icons.DROPDOWN}
            >
              {syncUptime.syncUpTime.map((item) => (
                <MenuItem
                  value={item.id}
                  sx={{
                    textTransform: "capitalize",
                    maxHeight: 400,
                    fontSize: pxToRem(14),
                    fontWeight: 400,
                    color: "#344054",
                  }}
                  key={item.id}
                >
                  {(item.hours === 0 && item.min !== 0 && `${item.min}min`) ||
                    (item.hours !== 0 && item.min === 0 && `${item.hours}hr`) ||
                    (item.hours !== 0 && item.min !== 0 && `${item.hours}hr ${item.min}min`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>
      </MDBox>

      <MDBox mt={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: tablePagination.perPage }}
          showTotalEntries={false}
          loading={loadingStatus}
          currentPage={tablePagination.page}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default Usermanagement;
