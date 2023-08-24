import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React from "react";

const fTextArea = ({
  title,
  name,
  error,
  handleChange,
  defaultValue,
  id,
  value,
  helperText,
  placeholder,
  marginTop,
}) => (
  <MDBox
    marginTop={marginTop}
    sx={{
      mr: 2,
      ml: 0,
      mb: 0,
      display: "flex",
      flexDirection: "column",
      minWidth: "100%",
    }}
  >
    <MDTypography
      variant="body"
      sx={{
        fontSize: "14px",
        fontWeight: 500,
        color: "#344054",
        mb: 1,
        lineHeight: "20px",
      }}
    >
      {title}
    </MDTypography>
    <MDInput
      multiline
      autoComplete="off"
      size="small"
      variant="outlined"
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      defaultValue={defaultValue}
      error={error}
      helperText={helperText}
      onChange={handleChange}
      FormHelperTextProps={{
        sx: { marginLeft: 0, color: "#FF2E2E" },
      }}
      inputProps={{
        style: { textTransform: "capitalize", flex: "1", minHeight: "5em" },
      }}
      sx={{
        mb: 2,
        mt: 0,
        minWidth: "100%",
        "& .MuiInputBase-input": {
          fontSize: "16px",
          fontWeight: 400,
          color: "#667085",
        },
      }}
    />
  </MDBox>
);

export default fTextArea;
