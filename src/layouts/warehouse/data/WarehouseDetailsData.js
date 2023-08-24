/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Material Components
import MDBox from "components/MDBox";
import { IconButton } from "@mui/material";

// Custom Components
import Author from "components/Table/Author";

// Utils
import Constants, { Icons } from "utils/Constants";

// Redux
import { useSelector } from "react-redux";

export default function data(equipmentList, handleDeleteOpen) {
  const [rows, setRows] = useState([]);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[5]?.screensInfo?.agreement;
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate("/client/add-warehouse", { state: { warehouse: id } });
  };

  const handleEdit = (item) => {
    navigate("/client/add-warehouse", { state: { warehouse: item } });
  };

  useEffect(() => {
    if (equipmentList) {
      const tempRows = equipmentList.map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          equipmentName: <Author name={element?.name} />,
          equipmentNumber: <Author name={element?.equipmentNumber} />,
          serialNumber: <Author name={element?.serialNumber} />,
          weight: <Author name={element?.weight} />,
          equipmentType: <Author name={element?.equipmentType?.type} />,
          equipmentCategory: <Author name={element?.equipmentType?.category?.name} />,
          hasCode: <Author name={element?.equipmentType?.hsCode} />,
          value: <Author name={element?.value} />,
          rentalPrice: <Author name={element?.equipmentType?.rentalPrice} />,
          qrNumber: <Author name={element?.qrCode} />,
          action: (
            <MDBox>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => handleView(element?.equipment?.[Constants.MONGOOSE_ID])}
              >
                {Icons.VIEW}
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="error"
                component={Link}
                to={`/client/register/${element?.equipment?.[Constants.MONGOOSE_ID]}`}
                onClick={() => handleEdit(element)}
              >
                {Icons.EDIT}
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="error"
                onClick={() => handleDeleteOpen(element)}
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
  }, [equipmentList]);

  // return {
  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      {
        Header: "Equipment name",
        accessor: "equipmentName",
        width: "10%",
        align: "left",
      },
      { Header: "Equipment number", accessor: "equipmentNumber", width: "10%", align: "left" },
      { Header: "Serial number", accessor: "serialNumber", width: "10%", align: "left" },
      { Header: "Weigth(KG)", accessor: "weight", width: "10%", align: "left" },
      { Header: "Equipment type", accessor: "equipmentType", width: "10%", align: "left" },
      { Header: "Equipment category", accessor: "equipmentCategory", width: "10%", align: "left" },
      { Header: "Has code", accessor: "hasCode", width: "10%", align: "left" },
      { Header: "Value", accessor: "value", width: "10%", align: "left" },
      { Header: "Rental Price", accessor: "rentalPrice", width: "10%", align: "left" },
      { Header: "QR Number", accessor: "qrNumber", align: "left" },
      { Header: "Action", accessor: "action", width: "10%", align: "left" },
    ],
    rows,
  };
}
