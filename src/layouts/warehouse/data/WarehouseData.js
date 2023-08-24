/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Material Components
import MDBox from "components/MDBox";
import { IconButton } from "@mui/material";

// Custom Components
import Author from "components/Table/Author";
import Status2 from "components/Table/Status2";

// Utils
import Constants, { Icons } from "utils/Constants";

// Redux
import { useSelector } from "react-redux";

export default function data(list, handleDeleteOpen) {
  const [rows, setRows] = useState([]);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[9]?.screensInfo?.agreement;
  const navigate = useNavigate();

  const handleView = (id) => {
    console.log(permission);
    navigate(`/client/setting/warehouse/${id}`, { state: { warehouse: id } });
  };

  const handleEdit = (item) => {
    navigate("/client/setting/add-warehouse", { state: { warehouse: item } });
  };

  useEffect(() => {
    if (list) {
      const tempList = list.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          warehouse: <Author name={item?.name} />,
          address: <Author name={item?.street} />,
          email: <Author name={item?.email} style={{ textTransform: "inherit" }} maxContent={30} />,
          totalProducts: <Author name={item?.totalProductCount || 0} />,
          status: (
            <Status2
              color={item.isActive ? "#029E3B" : "#BD382F"}
              bgColor={item.isActive ? "#DCF5E9" : "#FEE4E2"}
              title={item.isActive ? "Active" : "InActive"}
            />
          ),
          action: (
            <MDBox>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => handleView(item?.[Constants.MONGOOSE_ID])}
              >
                {Icons.VIEW}
              </IconButton>
              {permission?.update && (
                <IconButton aria-label="fingerprint" color="error" onClick={() => handleEdit(item)}>
                  {Icons.EDIT}
                </IconButton>
              )}
              {permission?.delete && (
                <IconButton
                  aria-label="fingerprint"
                  color="error"
                  onClick={() => handleDeleteOpen(item?.[Constants.MONGOOSE_ID])}
                >
                  {Icons.DELETE}
                </IconButton>
              )}
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempList]);
    }
  }, [list]);

  // return {
  const activityColumns = [
    { Header: "No.", accessor: "srNo", width: "7%" },
    { Header: "Warehouse", accessor: "warehouse", align: "left" },
    { Header: "Address", accessor: "address", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Total Products", accessor: "totalProducts", align: "left" },
    { Header: "Status", accessor: "status", align: "left" },
    { Header: "Action", accessor: "action", align: "left" },
  ];

  const tableData = {
    columns: activityColumns,
    rows,
  };

  return tableData;
}
