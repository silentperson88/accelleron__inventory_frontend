import { useMemo, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import { Pagination, TableCell } from "@mui/material";

import Constants, { Icons } from "utils/Constants";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  isSorted,
  noEndBorder,
  loading,
  // currentPage, handleTablePagination, handleCurrentPage are use when need data size is more
  // Use this parameter to retrieve additional data when a user visits the last page
  currentPage,
  handleTablePagination,
  handleCurrentPage,
  backgroundColor, // New prop to specify the background color
  textColor,
  extraContent,
}) {
  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 10;
  const [status, setStatus] = useState("pending");
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: currentPage } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // update the status on role change, when superadmin login as admin and data changes
  useEffect(() => {
    // for superadmin panel

    // for admin panel
    console.log("loading", loading, rows.length, pageOptions.length);
    if (loading === "pending") setStatus("pending");
    else if (loading === "rejected") setStatus("rejected");
    else if (loading === "fullfilled" && rows.length > 0 && pageOptions.length > 0)
      setStatus("fullfilled");
    else if (loading === "fullfilled" && rows.length === 0 && pageOptions.length === 0)
      setStatus("noData");
  }, [table]);

  useEffect(() => {
    console.log("Status", status);
  }, [status]);

  // set current page to last page when the current page has no data
  // Works when some data is deleted from the last page
  useEffect(() => {
    if (pageOptions.length > 0 && pageOptions.length <= currentPage) {
      const lastPage = pageOptions.length - 1;
      gotoPage(lastPage);
      handleCurrentPage(lastPage);
    }
  }, [pageOptions]);
  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value);

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  const handlePageChange = (event, value) => {
    if (pageOptions.length === value) handleTablePagination(value);
    if (event.target.innerText === "Previous") {
      previousPage();
    } else if (event.target.innerText === "Next") {
      nextPage();
    } else {
      gotoPage(value - 1);
      handleCurrentPage(value - 1);
    }
  };

  return (
    <MDBox
      sx={{
        backgroundColor: "White",
        borderRadius: "10px",
        border: "1px solid #E0E6F5",
      }}
    >
      <TableContainer sx={{ boxShadow: "none" }}>
        {entriesPerPage.entries || canSearch ? (
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            backgroundColor={backgroundColor}
            color={textColor}
          >
            {entriesPerPage && (
              <MDBox display="flex" alignItems="center">
                <Autocomplete
                  disableClearable
                  value={pageSize.toString()}
                  options={entries}
                  onChange={(event, newValue) => {
                    setEntriesPerPage(parseInt(newValue, 10));
                  }}
                  size="small"
                  sx={{ width: "5rem" }}
                  renderInput={(params) => <MDInput {...params} />}
                />
                <MDTypography variant="caption" color="secondary">
                  &nbsp;&nbsp;entries per page
                </MDTypography>
              </MDBox>
            )}
            {canSearch && (
              <MDBox width="12rem" ml="auto">
                <MDInput
                  placeholder="Search..."
                  value={search}
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }) => {
                    setSearch(search);
                    onSearchChange(currentTarget.value);
                  }}
                />
              </MDBox>
            )}
          </MDBox>
        ) : null}
        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <DataTableHeadCell
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                    sorted={setSortedValue(column)}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {(() => {
              switch (status) {
                case "pending":
                  return (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <MDBox py={5} display="flex" justifyContent="center" alignItems="center">
                          {Icons.LOADING2}
                        </MDBox>
                      </TableCell>
                    </TableRow>
                  );
                case "rejected":
                  return (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <MDTypography variant="h4" color="secondary">
                          {Constants.SOMETHING_WENT_WRONG}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  );

                case "fullfilled":
                  return page.map((row, key) => {
                    prepareRow(row);
                    return (
                      <TableRow
                        {...row.getRowProps()}
                        sx={{ background: key % 2 !== 0 ? "#f6f7ff" : null }}
                      >
                        {row.cells.map((cell) => (
                          <DataTableBodyCell
                            noBorder={noEndBorder && rows.length - 1 === key}
                            align={cell.column.align ? cell.column.align : "left"}
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </DataTableBodyCell>
                        ))}
                      </TableRow>
                    );
                  });
                case "noData":
                  return (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <MDTypography variant="h4" color="secondary">
                          {Constants.NO_DATA_FOUND}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  );
                default:
                  return (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <MDTypography variant="h4" color="secondary">
                          {Constants.SOMETHING_WENT_WRONG}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  );
              }
            })()}
          </TableBody>
        </Table>
      </TableContainer>
      {status === "fullfilled" && page.length > 0 && pageOptions.length > 1 && (
        <MDBox
          sx={{ color: "#f6f7ff" }}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          ml="40%"
          p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
        >
          <Pagination
            count={pageOptions.length}
            page={pageIndex + 1}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .Mui-selected:hover": {
                backgroundColor: "#f6f7ff",
              },
              "& .Mui-selected": {
                backgroundColor: "#e0e1f5",
              },
              ".MuiPaginationItem-root": {
                borderRadius: "50%",
                border: "none",
              },
            }}
          />
        </MDBox>
      )}
      {extraContent}
    </MDBox>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  currentPage: 0,
  loading: "pending",
  licenseRequired: false,
  handleTablePagination: () => {},
  handleCurrentPage: () => {},
  backgroundColor: "", // Add a default value for backgroundColor
  textColor: "",
  extraContent: null,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  loading: PropTypes.string,
  licenseRequired: PropTypes.bool,
  handleTablePagination: PropTypes.func,
  currentPage: PropTypes.number,
  handleCurrentPage: PropTypes.func,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  extraContent: PropTypes.node,
};

export default DataTable;
