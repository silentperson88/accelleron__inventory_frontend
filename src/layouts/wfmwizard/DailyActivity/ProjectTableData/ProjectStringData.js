import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";

export default function ProjectString(
  projectStringLists,
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
    setEditLists({ ...editLists, projectString: item });
    handleOpenNewModal("Project String");
  };

  useEffect(() => {
    if (projectStringLists) {
      const list = projectStringLists.map((item) => {
        const temp = {
          name: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.name}
            </MDTypography>
          ),
          from: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.fromLocation?.title}
            </MDTypography>
          ),
          to: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.toLocation?.title}
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
              <IconButton
                color="secondary"
                fontSize="medium"
                onClick={() => handleDelete("ProjectString", item[mongooseId])}
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
  }, [projectStringLists]);

  return {
    ProjectStringColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "From", accessor: "from", width: "20%", align: "left" },
      { Header: "To", accessor: "to", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    ProjectStringRows: rows,
  };
}
