/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Constants, { Icons } from "utils/Constants";
import Author from "components/Table/Author";

export default function data(ParameterList, handleEdit, handleDelete) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (ParameterList) {
      const list = ParameterList.map((item, index) => {
        const temp = {
          srNo: (
            <MDTypography variant="caption" color="text">
              {index + 1}
            </MDTypography>
          ),
          name: <Author name={item?.name} />,
          description: <Author name={item?.description !== "" ? item?.description : ""} />,
          type: <Author name={item?.type} />,
          sortOrder: <Author name={item?.sortOrder} />,
          measurementCode: (
            <Author
              name={item?.measurement !== "" ? item?.measurement : ""}
              style={{ textTransform: "inherit" }}
            />
          ),
          hasThreePhases: <Author name={item?.hasThreePhase ? "Yes" : "No"} />,
          duration: <Author name={item?.duration} />,
          weightage: <Author name={item?.weightage} />,
          action: (
            <MDBox>
              <IconButton
                aria-label="edit report type"
                color="error"
                onClick={() => handleEdit(item)}
              >
                {Icons.EDIT}
              </IconButton>
              <IconButton
                aria-label="delete report type"
                color="error"
                onClick={() => handleDelete(item[Constants.MONGOOSE_ID])}
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
  }, [ParameterList]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%", align: "left" },
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Type", accessor: "type", align: "left" },
      { Header: "Sort Order", accessor: "sortOrder", align: "left" },
      { Header: "Measurement Code", accessor: "measurementCode", align: "left" },
      { Header: "Has Three Phases", accessor: "hasThreePhases", align: "left" },
      { Header: "Duration (hrs)", accessor: "duration", align: "left" },
      { Header: "Weightage (%)", accessor: "weightage", align: "left" },
      { Header: "Action", accessor: "action", width: "10%", align: "left" },
    ],
    rows,
  };
}
