/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React from "react";
import { Checkbox } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CustomCheckbox = ({ name, defaultChecked, checked, onChange }) => (
  <Checkbox
    name={name}
    defaultChecked={defaultChecked}
    checked={checked}
    onChange={onChange}
    style={{
      border: "2px solid #191A51",
      borderRadius: "2px",
      padding: "0",
      height: "18px",
      width: "18px",
    }}
    icon={
      <CheckCircleOutlineIcon
        style={{
          border: "0px solid #191A51",
          borderRadius: "0px",
          padding: "0",
          margin: 0,
        }}
      />
    }
    checkedIcon={
      <CheckCircleIcon
        style={{
          border: "0px solid #191A51",
          borderRadius: "0px",
          padding: "0",
          margin: 0,
        }}
      />
    }
  />
);

export default CustomCheckbox;
