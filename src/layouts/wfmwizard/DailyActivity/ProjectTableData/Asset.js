import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";

export default function Asset(
  assetList,
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
    setEditLists({ ...editLists, asset: item });
    handleOpenNewModal("Asset");
  };

  useEffect(() => {
    if (assetList) {
      const list = assetList.map((item) => {
        const temp = {
          name: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.cableName}
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
          manufacture: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.manufacture}
            </MDTypography>
          ),
          typemm2: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.typeMm2}
            </MDTypography>
          ),
          string: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.string?.name}
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
                onClick={() => handleDelete("Asset", item[mongooseId])}
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
  }, [assetList]);

  return {
    AssetColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "from", accessor: "from", width: "20%", align: "left" },
      { Header: "To", accessor: "to", width: "20%", align: "left" },
      { Header: "Manufacture", accessor: "manufacture", width: "20%", align: "left" },
      { Header: "Type Mm2", accessor: "typemm2", width: "20%", align: "left" },
      { Header: "String", accessor: "string", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    AssetRows: rows,
  };
}
