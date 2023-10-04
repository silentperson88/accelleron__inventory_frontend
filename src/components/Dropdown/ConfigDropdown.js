import React, { useState } from "react";
import { FormControl, FormHelperText, IconButton, MenuItem, Select } from "@mui/material";
import FormControlErrorStyles from "assets/style/Component";
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Constants from "utils/Constants";

const configDropdown = ({
  label,
  id,
  name,
  value,
  defaultValue,
  hint,
  handleChange,
  menu,
  error,
  helperText,
  marginBottom,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormControl
      sx={{
        mr: 2,
        ml: 0,
        mt: pxToRem(8),
        width: "100%", // Set the width of the FormControl to the provided width prop
        marginBottom,
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
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          sx={{
            height: 45,
            minWidth: "100%", // Make sure the Select takes the full width of the FormControl
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
              vertical: 34,
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            PaperProps: {
              style: {
                maxWidth: "100%",
                opacity: 1,
                transform: "none",
                border: "1px solid #D0D5DD",
              },
            },
          }}
          onChange={(e) => handleChange(name, e.target.value, id)}
          renderValue={(selected) => {
            const val = menu.find((opt) => opt?.[Constants.MONGOOSE_ID] === selected);
            return (
              <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
                {val?.title || defaultValue || value || "Select"}
              </MDTypography>
            );
          }}
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
          onClick={() => setOpen(!open)}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </MDBox>
      <FormHelperText sx={{ marginLeft: 0 }}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default configDropdown;
