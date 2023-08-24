import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";

export default function Functions(
  functionList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const mongooseId = "_id";

  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, function: item });
    handleOpenNewModal("Functions");
  };

  useEffect(() => {
    if (functionList) {
      const list = functionList.map((item) => {
        const temp = {
          name: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.functionName}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <IconButton
                color="secondary"
                fontSize="medium"
                onClick={() => handleEdit(item)}
                sx={{ cursor: "pointer" }}
                disabled={!item?.isDeletable || false}
              >
                {Icons.EDIT}
              </IconButton>{" "}
              &nbsp;
              <IconButton
                color="secondary"
                fontSize="medium"
                onClick={() => handleDelete("Function", item[mongooseId])}
                disabled={!item?.isDeletable || false}
              >
                {Icons.DELETE}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [functionList]);

  return {
    FunctionsColumns: [
      { Header: "Project Function", accessor: "name", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    FunctionsRows: rows,
  };
}
