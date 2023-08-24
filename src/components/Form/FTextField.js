/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import pxToRem from "assets/theme/functions/pxToRem";

const { default: MDBox } = require("components/MDBox");
const { default: MDInput } = require("components/MDInput");
const { default: MDTypography } = require("components/MDTypography");

// Form Text field
const FTextField = ({
  label,
  name,
  id,
  placeholder,
  type,
  error,
  helperText,
  value,
  defaultValue,
  handleChange,
  width,
  marginBottom,
  disabled,
}) => (
  <MDBox sx={{ mt: pxToRem(8), display: "flex", flexDirection: "column", width }}>
    <MDTypography
      variant="body"
      sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054", lineHeight: "20px" }}
    >
      {label}
    </MDTypography>
    <MDInput
      sx={{
        mt: pxToRem(6),
        "& .MuiInputBase-input": {
          fontSize: "16px",
        },
        width,
        marginBottom,
      }}
      type={type}
      {...(type === "textarea" && { multiline: true, rows: 3 })}
      id={id}
      name={name}
      error={error}
      helperText={helperText}
      FormHelperTextProps={{
        sx: { marginLeft: 0, color: "red" },
      }}
      value={value}
      disabled={disabled}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={handleChange}
    />
  </MDBox>
);

export default FTextField;
