/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";

// Images
import { useEffect, useState } from "react";
import { FormControl, Icon, InputLabel, MenuItem, Select } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Icons } from "utils/Constants";
import Author from "components/Table/Author";

export default function data(fieldList, handleDeleteModal, handleOpenEditModal) {
  const [rows, setRows] = useState([]);
  const mongooseId = "_id";
  const mutableFieldList = [...fieldList.dyamicField];
  useEffect(() => {
    if (fieldList.staticField.length > 0) {
      const list = fieldList.staticField.map((item) => {
        const temp = {
          fieldName: (
            <Author name={`${item.fieldName.charAt(0).toUpperCase()}${item.fieldName.slice(1)}`} />
          ),
          action: (
            <MDBox>
              <EditOutlinedIcon fontSize="medium" sx={{ color: "#C6C6C6" }} disabled />
              &nbsp;
              <DeleteOutlineOutlinedIcon fontSize="medium" sx={{ color: "#C6C6C6" }} disabled />
            </MDBox>
          ),
          option: item.optionValue.length > 0 ? <Dropdown optionValue={item.optionValue} /> : null,
        };
        return temp;
      });
      setRows([...list]);
    }
    if (mutableFieldList.length > 0) {
      const sortedList = mutableFieldList.sort((a, b) => a.fieldSortOrder - b.fieldSortOrder);
      const list = sortedList.map((item) => {
        const temp = {
          fieldName: (
            <Author name={`${item?.fieldName.charAt(0).toUpperCase()}${item.fieldName.slice(1)}`} />
          ),
          option: item.optionValue.length > 0 ? <Dropdown optionValue={item?.optionValue} /> : null,
          sortorder: <Author name={item?.fieldSortOrder} />,
          action: (
            <MDBox>
              {item?.fieldSortOrder ? (
                <Icon
                  fontSize="medium"
                  onClick={() => handleOpenEditModal(item)}
                  sx={{ cursor: "pointer" }}
                >
                  {Icons.EDIT}
                </Icon>
              ) : (
                <EditOutlinedIcon fontSize="medium" sx={{ color: "#C6C6C6" }} disabled />
              )}{" "}
              &nbsp;
              <Icon
                fontSize="medium"
                onClick={() => handleDeleteModal(item[mongooseId])}
                sx={{ cursor: "pointer" }}
              >
                {Icons.DELETE}
              </Icon>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows((oldValue) => [...oldValue, ...list]);
    }
  }, [fieldList]);

  const dropdownIcon = () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#475467" }} />;

  const Dropdown = ({ fieldType, optionValue }) => (
    <FormControl sx={{ m: 1, minWidth: 120, width: 200 }}>
      <InputLabel id="demo-simple-select-label">{fieldType}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        sx={{ p: "0.75rem" }}
        IconComponent={dropdownIcon}
        value={optionValue[0].optionText}
        displayEmpty
      >
        {optionValue.map((val) => (
          <MenuItem value={val.optionText}>
            {typeof val.optionText === "string" && val.optionText.length > 0
              ? val.optionText.charAt(0).toUpperCase() + val.optionText.slice(1)
              : val.optionText}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return {
    columns: [
      { Header: "Field Name", accessor: "fieldName", align: "left" },
      { Header: "Options", accessor: "option", align: "left" },
      { Header: "Sort Order", width: "20%", accessor: "sortorder", align: "left" },
      { Header: "Action", width: "6%", accessor: "action", align: "left" },
    ],

    rows,
  };
}
