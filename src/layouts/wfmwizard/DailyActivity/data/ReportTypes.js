import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Constants, { Icons } from "utils/Constants";
import { Link } from "react-router-dom";

export default function ReportTypes(ReportTypeList, handleEdit, handleDelete) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (ReportTypeList) {
      const list = ReportTypeList.map((item, index) => {
        const temp = {
          srNo: (
            <MDTypography variant="caption" color="text">
              {index + 1}
            </MDTypography>
          ),
          project: <MDTypography variant="caption">{item?.project?.title}</MDTypography>,
          reportType: (
            <MDTypography variant="caption" sx={{ textTransform: "capitalize" }}>
              {item?.terminationTypeName}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <IconButton
                aria-label="report-parameter"
                color="error"
                component={Link}
                to={`/client/setting/report-type/${item[Constants.MONGOOSE_ID]}/parameter-figure`}
              >
                {Icons.VIEW}
              </IconButton>
              <IconButton
                aria-label="edit report type"
                color="error"
                onClick={() =>
                  handleEdit({
                    body: {
                      project: item.project[Constants.MONGOOSE_ID],
                      terminationTypeName: item.terminationTypeName,
                    },
                    id: item[Constants.MONGOOSE_ID],
                  })
                }
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
  }, [ReportTypeList]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%", align: "left" },
      { Header: "Project", accessor: "project", width: "20%", align: "left" },
      { Header: "Report Types", accessor: "reportType", width: "40%", align: "left" },
      { Header: "Action", accessor: "action", width: "10%", align: "center" },
    ],
    rows,
  };
}
