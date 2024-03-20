/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// React
import React from "react";

// Material Components
import { Autocomplete, InputAdornment } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";

// Common Commponents
import pxToRem from "assets/theme/functions/pxToRem";

// Utils
import { Icons } from "utils/Constants";

export default function ResetFilterButton({
  filters,
  handleFilterChange,
  options,
  value,
  debouncedHandleSearch,
  placeholder,
  label = "Search",
  width = pxToRem(300),
  marginRight = 2,
  freeSolos,
  error,
  helperText,
}) {
  return (
    <MDBox display="flex" alignItems="start" sx={{ flexDirection: "column", marginRight, mt: 2.5 }}>
      <MDTypography
        variant="caption"
        mb={1}
        sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
      >
        {label}
      </MDTypography>
      <Autocomplete
        disablePortal
        freeSolo={freeSolos}
        id="combo-box-demo"
        options={options}
        value={value}
        noOptionsText="No data found"
        sx={{
          width,
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
            placeholder={placeholder}
            pr={0}
            error={error}
            helperText={helperText}
            FormHelperTextProps={{
              sx: { marginLeft: 0, marginTop: 1, color: "red" },
            }}
            sx={{ textTransform: "capitalize" }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {filters && filters[0].isLoading ? Icons.LOADING : Icons.SEACRH}
                </InputAdornment>
              ),
            }}
          />
        )}
        onChange={handleFilterChange}
        onKeyUp={debouncedHandleSearch}
      />
    </MDBox>
  );
}
