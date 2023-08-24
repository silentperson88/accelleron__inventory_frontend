import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function EquipmentTypedata(
  typeList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, equiptype: item });
    handleOpenNewModal("Equipment Type");
  };
  useEffect(() => {
    if (typeList) {
      const list = typeList?.map((item) => {
        const temp = {
          name: <Author name={item?.type} />,
          category: <Author name={item?.equipmentCategory?.name} />,
          form: <Author name={item?.equipmentUnit?.title} />,
          rent: <Author name={`${item?.currencyUnit?.symbol} ${item?.price}`} />,
          quantity: <Author name={item?.quantityType?.name} />,
          code: <Author name={`${item?.hsCode?.name} (${item?.hsCode?.code})`} />,
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
                onClick={() => handleDelete("equiptype", item[Constants.MONGOOSE_ID])}
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
  }, [typeList]);

  return {
    typeColumns: [
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Equipment Category", accessor: "category", align: "left" },
      { Header: "Weight Form", accessor: "form", align: "left" },
      { Header: "Rental Price", accessor: "rent", align: "left" },
      { Header: "Quantity Type", accessor: "quantity", align: "left" },
      { Header: "HS Code", accessor: "code", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    typeRows: rows,
  };
}
