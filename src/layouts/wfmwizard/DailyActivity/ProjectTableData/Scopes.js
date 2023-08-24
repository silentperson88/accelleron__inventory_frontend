import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";

export default function Scopes(
  scopeList,
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
    setEditLists({ ...editLists, scope: item });
    handleOpenNewModal("Scopes");
  };

  useEffect(() => {
    if (scopeList) {
      const list = scopeList.map((item) => {
        const temp = {
          name: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item.name}
            </MDTypography>
          ),
          isDoable: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item.isDoable}
            </MDTypography>
          ),
          normDuration: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item.normDuration}
            </MDTypography>
          ),
          sortOrder: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item.sortOrder}
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
                onClick={() => handleDelete("Scope", item[mongooseId])}
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
  }, [scopeList]);

  return {
    ScopesColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Norm Duration", accessor: "normDuration", width: "20%", align: "left" },
      { Header: "Sort Order", accessor: "sortOrder", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    ScopesRows: rows,
  };
}
