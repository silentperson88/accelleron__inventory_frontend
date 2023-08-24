import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";

export default function Locationdata(
  locationList,
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
    setEditLists({ ...editLists, location: item });
    handleOpenNewModal("Location");
  };

  useEffect(() => {
    if (locationList) {
      const list = locationList.map((item) => {
        const temp = {
          name: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.title}
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
                onClick={() => handleDelete("Location", item[mongooseId])}
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
  }, [locationList]);

  return {
    locationColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    locationRows: rows,
  };
}
