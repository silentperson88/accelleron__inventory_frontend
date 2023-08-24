import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function WieghtFormdata(
  weightFormList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, weightForm: item });
    handleOpenNewModal("Weight Form");
  };
  useEffect(() => {
    if (weightFormList) {
      const list = weightFormList?.map((item) => {
        const temp = {
          weightForm: <Author name={item?.title} />,
          weightAbbrevation: <Author name={item?.abbreviation} />,
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
                onClick={() => handleDelete("weightForm", item[Constants.MONGOOSE_ID])}
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
  }, [weightFormList]);

  return {
    weightFormColumns: [
      { Header: "Weight Form", accessor: "weightForm", width: "30%", align: "left" },
      { Header: "Weight Abbrevation", accessor: "weightAbbrevation", width: "30%", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "center" },
    ],
    weightFormRows: rows,
  };
}
