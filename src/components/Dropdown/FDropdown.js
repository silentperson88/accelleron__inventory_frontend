import { FormControl, FormHelperText, IconButton, MenuItem, Select } from "@mui/material";
import FormControlErrorStyles from "assets/style/Component";
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import Constants from "utils/Constants";

const formDropdown = ({
  width,
  label,
  id,
  name,
  defaultValue,
  value,
  hint,
  handleChange,
  menu,
  error,
  helperText,
  marginBottom,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <FormControl
      sx={{
        mr: 2,
        ml: 0,
        mt: pxToRem(8),
        minWidth: "100%",
        width,
        marginBottom,
        maxHeight: 400,
        ...FormControlErrorStyles,
      }}
      error={error}
      size="small"
    >
      <MDTypography
        variant="caption"
        mb={1}
        sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
      >
        {label}
      </MDTypography>
      <MDBox
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Select
          displayEmpty
          id={id}
          name={name}
          {...(!value && { defaultValue })}
          {...(!defaultValue && { value })}
          placeholder={hint}
          disabled={disabled}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          sx={{
            height: 45,
            minWidth: "100%",
            "& .MuiInputBase-input": {
              fontSize: pxToRem(16),
              fontWeight: 400,
              color: "#667085",
            },
            textTransform: "capitalize",
            backgroundColor: "black",
            paddingY: "0.65rem",
            paddingRight: "0.55rem",
            maxHeight: 100,
            cursor: "pointer",
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: 29,
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            PaperProps: {
              style: {
                maxHeight: 200,
                opacity: 1,
                transform: "none",
                border: "1px solid #D0D5DD",
              },
            },
          }}
          onChange={(e) => handleChange(name, e.target.value, id)}
        >
          <MenuItem disabled value="">
            Select
          </MenuItem>
          {menu.length > 0 ? (
            menu.map((item) => (
              <MenuItem
                value={item[Constants.MONGOOSE_ID] || item}
                id={item[Constants.MONGOOSE_ID] || item}
                sx={{
                  textTransform: "capitalize",
                  maxHeight: 400,
                  fontSize: pxToRem(16),
                  fontWeight: 400,
                  marginTop: "4px",
                  color: "#667085",
                }}
                key={item[Constants.MONGOOSE_ID] || item}
              >
                {item.title || item}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No data available</MenuItem>
          )}
        </Select>
        <IconButton
          onClick={() => !disabled && setOpen(!open)}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <KeyboardArrowDownIcon sx={{ color: disabled ? "#CDD3D9" : "#667085" }} />
        </IconButton>
      </MDBox>
      <FormHelperText sx={{ marginLeft: 0 }}>{helperText}</FormHelperText>
    </FormControl>
  );
};

// FDropdown menu modal
export const FormDropdownModal = (mongooseId, title) => ({
  [Constants.MONGOOSE_ID]: mongooseId,
  title,
});

export default formDropdown;
