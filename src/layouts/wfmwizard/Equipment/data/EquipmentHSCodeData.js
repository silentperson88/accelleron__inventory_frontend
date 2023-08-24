import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function EquipmentHSCodedata(
  hscodeList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, hscode: item });
    handleOpenNewModal("HS Code");
  };
  useEffect(() => {
    if (hscodeList) {
      const list = hscodeList?.map((item) => {
        const temp = {
          name: <Author name={item?.name} />,
          code: <Author name={item?.code} />,

          action: (
            <MDBox>
              <IconButton
                color="secondary"
                fontSize="medium"
                onClick={() => handleEdit(item)}
                sx={{ cursor: "pointer" }}
              >
                {Icons.EDIT}
              </IconButton>{" "}
              &nbsp;
              <IconButton
                color="secondary"
                fontSize="medium"
                sx={{ cursor: "pointer" }}
                onClick={() => handleDelete("hscode", item[[Constants.MONGOOSE_ID]])}
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
  }, [hscodeList]);

  return {
    hscodeColumns: [
      { Header: "HS Name", accessor: "name", width: "20%", align: "left" },
      { Header: "HS Code", accessor: "code", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    hscodeRows: rows,
  };
}
