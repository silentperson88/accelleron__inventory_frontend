import { FormControl, FormHelperText, MenuItem, IconButton, Select } from "@mui/material";
import { useState } from "react";
import FormControlErrorStyles from "assets/style/Component";
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const formDropdown2 = ({
  width,
  label,
  value,
  id,
  name,
  defaultValue,
  options,
  error,
  helperText,
  handleChange,
  marginBottom,
  maxWidth,
}) => {
  const [open, setOpen] = useState(false);
  const mongooseId = "_id";
  return (
    <FormControl
      size="small"
      error={Boolean(error)}
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
          labelId={id}
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
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
                maxWidth,
                opacity: 1,
                transform: "none",
                border: "1px solid #D0D5DD",
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Select
          </MenuItem>
          {options.length > 0 ? (
            options.map((item) => (
              <MenuItem
                sx={{
                  textTransform: "capitalize",
                  maxHeight: 400,
                  fontSize: pxToRem(16),
                  fontWeight: 400,
                  marginTop: "4px",
                  color: "#667085",
                }}
                key={item[mongooseId] || item}
                value={item[mongooseId] || item}
              >
                {item.title || item.name}
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

export default formDropdown2;
