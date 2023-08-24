import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";

export default function Activities(
  activityList,
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
    setEditLists({ ...editLists, activity: item });
    handleOpenNewModal("Activity");
  };

  useEffect(() => {
    if (activityList) {
      const list = activityList.map((item) => {
        const temp = {
          name: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.name}
            </MDTypography>
          ),
          scope: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.scopeId?.name}
            </MDTypography>
          ),
          weight: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.weight}
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
                sx={{ cursor: "pointer" }}
                onClick={() => handleDelete("Activity", item[mongooseId])}
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
  }, [activityList]);

  return {
    ActivitiesColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Scope", accessor: "scope", width: "20%", align: "left" },
      { Header: "Weight", accessor: "weight", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    ActivitiesRows: rows,
  };
}
