/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import pxToRem from "assets/theme/functions/pxToRem";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const CustomRadio = ({ label, name, list, value, handleChange }) => (
  <MDBox sx={{ mt: pxToRem(8) }}>
    <MDTypography
      variant="body"
      mb={1}
      sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
    >
      {label}
    </MDTypography>
    <RadioGroup row aria-labelledby={name} name={name} value={value} onChange={handleChange}>
      {list.map((item) => (
        <FormControlLabel
          key={item?.label.replace(/\s/g, "")}
          value={item?.value}
          control={<Radio />}
          label={item?.label}
          sx={{
            "& .MuiFormControlLabel-label": {
              fontWeight: 400,
            },
          }}
        />
      ))}
    </RadioGroup>
  </MDBox>
);

export default CustomRadio;
