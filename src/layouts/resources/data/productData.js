import React, { useEffect, useState } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { IconButton } from "@mui/material";
import Constants, { Icons } from "utils/Constants";

// Components
import Author from "components/Table/Author";

// Routing
import { Link } from "react-router-dom";

export default function product(
  productList,
  handleImageFullView,
  handleDeleteOpen,
  handleOpenEquipmentDetailDrawer
) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (productList) {
      const tempRows = productList.map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          equipmentname: <Author name={element?.name} />,
          weight: (
            <Author
              name={`${element?.weight} ${element?.equipmentType?.equipmentUnit?.abbreviation}`}
              style={{ textTransform: "inherit" }}
            />
          ),
          equipmenttype: <Author name={element?.equipmentType?.type} />,
          equipmentcategory: <Author name={element?.equipmentType?.equipmentCategory?.name} />,
          price: (
            <Author
              name={
                element?.value
                  ? `${element?.equipmentType?.currencyUnit?.symbol} ${element?.value}`
                  : `${element?.equipmentType?.currencyUnit?.symbol} ${element?.equipmentType?.price}`
              }
            />
          ),
          action: (
            <MDBox>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => handleOpenEquipmentDetailDrawer(element?.[Constants.MONGOOSE_ID])}
              >
                {Icons.VIEW}
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="error"
                component={Link}
                to={`/client/register/${element?.[Constants.MONGOOSE_ID]}`}
              >
                {Icons.EDIT}
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="error"
                onClick={() => handleDeleteOpen(element?.[Constants.MONGOOSE_ID])}
              >
                {Icons.DELETE}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [productList]);
  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      {
        Header: "Equipment name",
        accessor: "equipmentname",
        width: "10%",
        align: "left",
      },
      { Header: "Weight", accessor: "weight", width: "10%", align: "left" },
      { Header: "Equipment type", accessor: "equipmenttype", width: "10%", align: "left" },
      { Header: "Equipment category", accessor: "equipmentcategory", width: "10%", align: "left" },
      { Header: "Price", accessor: "price", width: "10%", align: "left" },
      { Header: "Action", accessor: "action", width: "10%", align: "left" },
    ],
    rows,
  };
}
