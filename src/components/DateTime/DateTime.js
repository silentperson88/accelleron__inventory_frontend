/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import React, { forwardRef } from "react";
import pxToRem from "assets/theme/functions/pxToRem";
import MDTypography from "components/MDTypography";

const DateTime = forwardRef(({ value, onClick, item, errors, label, minWidth = "100%" }, ref) => (
  <MDBox
    sx={{
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      mr: 2,
      ml: 0,
      mb: 0,
      minWidth: "100%",
    }}
  >
    <MDTypography
      variant="caption"
      mb={1}
      sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
    >
      {label}
    </MDTypography>
    <MDInput
      id={label}
      error={Boolean(errors)}
      helperText={errors}
      FormHelperTextProps={{
        sx: { marginLeft: 1, color: "#FF2E2E" },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      placeholder={item?.hint}
      value={value}
      sx={{ ml: 0, minWidth, mb: 2 }}
      onClick={onClick}
      ref={ref}
    />
  </MDBox>
));

export default DateTime;
