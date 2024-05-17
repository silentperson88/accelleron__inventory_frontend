// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";

import { useEffect, useRef, useState } from "react";
import MDInput from "components/MDInput";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification.slice";
import Constants, { defaultData, Icons, Colors, PageTitles } from "utils/Constants";
import uploadInventoryFromExcel, { getInventory } from "redux/Thunks/Inventory.thunk";
import { paramCreater } from "utils/methods/methods";
import InventoryData from "layouts/inventory/data/inventoryData";
import DataTable from "examples/Tables/DataTable";
import pxToRem from "assets/theme/functions/pxToRem";
import { Autocomplete, Divider, InputAdornment } from "@mui/material";
import PageTitle from "examples/NewDesign/PageTitle";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import ResetFilterButton from "components/Buttons/ResetButton";

function Uploader() {
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const [filters, setFilters] = useState([
    {
      inputLabel: "Search",
      list: [],
      selectedValue: "",
      isLoading: false,
    },
  ]);
  const inputFileRef = useRef(null);
  let debounceTimeout;
  const dispatch = useDispatch();
  const inventoryData = useSelector((state) => state.inventory);

  useEffect(() => {
    console.log("inventoryData", inventoryData);
  }, [inventoryData]);

  const { columns, rows } = InventoryData(inventoryData);

  const handleFilter = async (filterValue = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      ...(filterValue[0].selectedValue !== "All" && { search: filterValue[0].selectedValue }),
    };

    await dispatch(getInventory(paramCreater(paramData)));
  };

  const onSubmitHandle = async (e) => {
    try {
      const file = e.target.files[0];

      console.log("file", file);

      const response = await dispatch(uploadInventoryFromExcel(file));
      console.log("response", response);
      if (response.payload.status === 201) {
        // Assuming successful upload returns status code 201
        dispatch(
          openSnackbar({
            message: Constants.UPLOAD_SUCCESS_MESSAGE,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        handleFilter();
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
    inputFileRef.current.value = ""; // Reset the file input
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const handleTablePagination = async () => {
    const paramData = {
      page: next + 1,
      perPage: tablePagination.perPage,
    };

    const res = await dispatch(getInventory(paramCreater(paramData)));
    if (res.payload.status === 200) {
      setNext(res.payload.data.data.length > 0 ? next + 1 : next);
    }
  };

  const debouncedHandleSearch = (e) => {
    console.log("e", e);
    if (e.key !== "Enter") return;
    const temp = [...filters];
    temp[0].list = [{ [Constants.MONGOOSE_ID]: e.target.value, title: e.target.value }];
    temp[0].selectedValue = e.target.value;
    console.log("temp", temp);
    setFilters(temp);
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => handleFilter(temp), 500);
  };

  const handleButtonClick = () => {
    console.log("inputFileRef", inputFileRef.current);
    if (inputFileRef.current) {
      inputFileRef.current.click(); // Trigger file input click
    }
  };

  const handleResetFilter = () => {
    const tempFilters = [...filters];
    tempFilters[0].selectedValue = "";
    setFilters(tempFilters);
    handleFilter(tempFilters);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <PageTitle title={PageTitles.INVENTORY} />
        <BasicButton
          title="Upload File"
          icon={Icons.UPLOAD}
          background={Colors.WHITE}
          border
          color={Colors.BLACK}
          action={handleButtonClick}
        />
        <input
          type="file"
          name="excelFile"
          accept=".xlsx, .xls"
          onChange={onSubmitHandle}
          ref={inputFileRef}
          style={{ display: "none" }} // Initially hide the file input
          required
          fullWidth
        />
      </MDBox>
      <Divider sx={{ marginTop: pxToRem(22) }} />

      <MDBox
        display="flex"
        alignItems="start"
        flexWrap="wrap"
        sx={{ flexDirection: "row", mr: 2, mb: 1 }}
        style={{ width: "100%" }}
      >
        <MDBox display="flex" alignItems="start" sx={{ flexDirection: "column", mr: 2 }}>
          <MDTypography
            variant="caption"
            mb={1}
            sx={{
              fontSize: pxToRem(14),
              fontWeight: 600,
              color: "#344054",
              marginTop: pxToRem(20),
            }}
          >
            Search
          </MDTypography>
          <Autocomplete
            disablePortal
            freeSolo
            id="combo-box-demo"
            options={filters[0]?.list.map((val) => val.title) || []}
            name="Search"
            value={
              filters[0].selectedValue
                ? filters[0].selectedValue.charAt(0).toUpperCase() +
                  filters[0].selectedValue.substring(1).toLowerCase()
                : ""
            }
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
                placeholder="Search"
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
            onKeyUp={debouncedHandleSearch}
          />
        </MDBox>
        <ResetFilterButton handleReset={handleResetFilter} />
      </MDBox>

      {/* table */}
      <MDBox pb={3}>
        <MDBox pt={3}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
            showTotalEntries={false}
            noEndBorder
            loading={inventoryData?.loading}
            currentPage={tablePagination.page}
            handleTablePagination={handleTablePagination}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
          />
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Uploader;
