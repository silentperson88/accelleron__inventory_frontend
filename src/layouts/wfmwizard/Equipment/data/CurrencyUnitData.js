import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function CurrencyUnitdata(
  currencyUnitList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, currencyUnit: item });
    handleOpenNewModal("Currency Unit");
  };
  useEffect(() => {
    if (currencyUnitList) {
      const list = currencyUnitList?.map((item) => {
        const temp = {
          name: <Author name={item?.name} />,
          symbol: <Author name={`${item?.symbol} ${item?.isDefault ? "(Default)" : ""}`} />,
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
                onClick={() => handleDelete("currencyUnit", item[Constants.MONGOOSE_ID])}
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
  }, [currencyUnitList]);

  return {
    currencyUnitColumns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Currency Symbol", accessor: "symbol", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "center" },
    ],
    currencyUnitRows: rows,
  };
}
