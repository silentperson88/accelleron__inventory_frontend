import React, { useEffect, useState } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { IconButton } from "@mui/material";
import { Icons } from "utils/Constants";

// Components
import Author from "components/Table/Author";

const orderEquipmentList = [
  {
    name: "Equipment 1",
    reqQty: 2,
    avStock: 1,
    qrNumber: "123456",
    equipmentType: {
      type: "Equipment Type 1",
      equipmentCategory: {
        name: "Equipment Category 1",
      },
      currencyUnit: {
        symbol: "$",
      },
      equipmentUnit: {
        abbreviation: "kg",
      },
    },
    rentdays: 1,
    price: 100,
    value: 100,
  },
];

export default function OrderDetailsData() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (orderEquipmentList) {
      const tempRows = Array.from(
        { length: 30 },
        (_, index) => orderEquipmentList[index % orderEquipmentList.length]
      ).map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          equipmentname: <Author name={element?.name} />,
          reqQty: <Author name={element?.reqQty} />,
          avStock: <Author name={element?.avStock} />,
          qrNumber: <Author name={element?.qrNumber} />,

          equipmenttype: <Author name={element?.equipmentType?.type} />,
          equipmentcategory: <Author name={element?.equipmentType?.equipmentCategory?.name} />,
          rentdays: <Author name={element?.rentdays} />,
          price: (
            <Author name={`${element?.equipmentType?.currencyUnit?.symbol} ${element?.value}`} />
          ),
          amount: (
            <Author name={`${element?.equipmentType?.currencyUnit?.symbol} ${element?.value}`} />
          ),

          action: (
            <MDBox>
              <IconButton aria-label="fingerprint" color="error">
                {Icons.EDIT}
              </IconButton>
              <IconButton aria-label="fingerprint" color="error">
                {Icons.REJECTED}
              </IconButton>
              <IconButton aria-label="fingerprint" color="info">
                {Icons.APPROVED}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [orderEquipmentList]);
  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      {
        Header: "Equipment Name",
        accessor: "equipmentname",
        width: "10%",
        align: "left",
      },
      { Header: "Req Qty", accessor: "reqQty", align: "center" },
      { Header: "Equipment Category", accessor: "equipmentcategory", align: "left" },
      { Header: "Equipment Type", accessor: "equipmenttype", align: "left" },
      { Header: "Rental days", accessor: "rentdays", align: "center" },
      { Header: "Price Per Equipment", accessor: "price", align: "center" },
      { Header: "Total Amount", accessor: "amount", align: "center" },
      { Header: "Action", accessor: "action", width: "10%", align: "center" },
    ],
    rows,
  };
}
