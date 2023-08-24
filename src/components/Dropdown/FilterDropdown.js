import { Box, FormControl, MenuItem, Select } from "@mui/material";
import FormControlErrorStyles from "assets/style/Component";
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Cosntants, { Icons } from "utils/Constants";

const filterDropdown = ({ label, name, defaultValue, value, handleChange, menu }) => (
  <FormControl
    sx={{
      mr: 2,
      mt: pxToRem(20),
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
      {label}
    </MDTypography>
    <Select
      displayEmpty
      labelId="demo-select-small"
      id="demo-select-small"
      name={name}
      defaultValue={defaultValue}
      value={value}
      sx={{
        height: 40,
        color: "black",
        fontWeight: 600,
        backgroundColor: "#fff",
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
            top: 183,
            left: 442,
          },
        },
      }}
      onChange={handleChange}
      IconComponent={Icons.DROPDOWN}
      renderValue={(selected) => {
        const val = menu.filter(
          (opt) => opt?.[Cosntants.MONGOOSE_ID] === selected || opt === selected
        )[0];
        return (
          <MDBox sx={{ display: "flex", alignItems: "center" }}>
            {val?.color && val?.color !== "" ? (
              <Box
                component="span"
                sx={{
                  backgroundColor: `#${val?.color}`,
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                  mr: 1,
                }}
              />
            ) : null}
            <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
              {val?.title || val}
            </MDTypography>
          </MDBox>
        );
      }}
    >
      {menu.map((item) => (
        <MenuItem
          value={item[Cosntants.MONGOOSE_ID] || item}
          sx={{
            textTransform: "capitalize",
            maxHeight: 400,
            fontSize: pxToRem(14),
            fontWeight: 400,
            marginTop: "4px",
            color: "#344054",
          }}
          key={item[Cosntants.MONGOOSE_ID] || item.replace(/\s/g, "")}
        >
          {item?.color && item?.color !== "" && (
            <Box
              component="span"
              sx={{
                backgroundColor: `#${item?.color}`,
                borderRadius: "50%",
                width: "10px",
                height: "10px",
                mr: 1,
              }}
            />
          )}
          <MDTypography
            variant="caption"
            sx={{
              textTransform: "capitalize",
              fontSize: pxToRem(16),
              fontWeight: 400,
              color: "#667085",
              display: "flex",
            }}
          >
            {item.title || item}
          </MDTypography>
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default filterDropdown;
