import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function EquipmentGroupdata(
  groupList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, group: item });
    handleOpenNewModal("Equipment Category");
  };
  useEffect(() => {
    if (groupList) {
      const list = groupList?.map((item) => {
        const temp = {
          name: <Author name={item?.name} />,
          abbrevation: <Author name={item?.abbreviation} />,
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
                onClick={() => handleDelete("group", item[Constants.MONGOOSE_ID])}
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
  }, [groupList]);

  return {
    groupColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      {
        Header: "Equipment Nr. Abbreviation",
        accessor: "abbrevation",
        width: "25%",
        align: "left",
      },
      { Header: "Action", accessor: "action", width: "5%", align: "center" },
    ],
    groupRows: rows,
  };
}
