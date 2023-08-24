import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function QuantityTypedata(
  quantityTypeList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, quantityType: item });
    handleOpenNewModal("Quantity Type");
  };
  useEffect(() => {
    if (quantityTypeList) {
      const list = quantityTypeList?.map((item) => {
        const temp = {
          name: <Author name={item?.name} />,
          priceType: <Author name={item?.priceType} />,
          quantityType: <Author name={item?.quantityType} />,
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
                onClick={() => handleDelete("quantityType", item[Constants.MONGOOSE_ID])}
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
  }, [quantityTypeList]);

  return {
    quantityTypeColumns: [
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      { Header: "Price Type", accessor: "priceType", width: "30%", align: "left" },
      { Header: "Quantity Type", accessor: "quantityType", width: "30%", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "center" },
    ],
    quantityTypeRows: rows,
  };
}
