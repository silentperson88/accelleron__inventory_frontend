/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import MDTypography from "components/MDTypography";
import { Avatar, Tooltip } from "@mui/material";
import moment from "moment";
import { defaultData } from "utils/Constants";
import Author from "components/Table/Author";

export default function data(report) {
  const [rows, setRows] = useState([]);

  const CustomValue = ({ type, value, hasThreePahse = true }) => {
    if (
      (type === "text" ||
        type === "options" ||
        type === "number" ||
        type === "slider" ||
        type === "checkbox") &&
      hasThreePahse
    ) {
      return (
        <Tooltip title={value}>
          <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
            {value.length > 20 ? `${value.slice(0, 20)}...` : value}
          </MDTypography>
        </Tooltip>
      );
    }
    if ((type === "image" || type === "signature") && hasThreePahse) {
      return <Avatar alt="image" src={value} sx={{ width: 100, height: 100 }} />;
    }
    if (type === "boolean" && hasThreePahse) {
      return (
        <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
          {value ? "Yes" : "No"}
        </MDTypography>
      );
    }
    if (type === "date" && hasThreePahse) {
      return (
        <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
          {value !== "" ? moment(value).format(defaultData.WEB_DATE_FORMAT) : " "}
        </MDTypography>
      );
    }
    if (type === "datetime" && hasThreePahse) {
      return (
        <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
          {moment(value).format(defaultData.WEB_24_HOURS_FORMAT)}
        </MDTypography>
      );
    }
    return "---";
  };

  useEffect(() => {
    if (report && report.length > 0) {
      const list = report[0]?.details.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          parameter: <Author name={item?.name} />,
          input: <CustomValue type={item?.type} value={item?.inputValue} />,
          l1: (
            <CustomValue
              type={item?.type}
              value={item?.l1Value}
              hasThreePahse={item?.hasThreePhase}
            />
          ),
          l2: (
            <CustomValue
              type={item?.type}
              value={item?.l2Value}
              hasThreePahse={item?.hasThreePhase}
            />
          ),
          l3: (
            <CustomValue
              type={item?.type}
              value={item?.l3Value}
              hasThreePahse={item?.hasThreePhase}
            />
          ),
          comments: <Author name={item?.comment} />,
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [report]);
  return {
    reportColumns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      { Header: "Parameter", accessor: "parameter", align: "left" },
      { Header: "Input", accessor: "input", align: "left" },
      { Header: "L1", accessor: "l1", align: "left" },
      { Header: "L2", accessor: "l2", align: "left" },
      { Header: "L3", accessor: "l3", align: "left" },
      { Header: "Comments", accessor: "comments", align: "left" },
    ],
    reportRows: rows,
  };
}
