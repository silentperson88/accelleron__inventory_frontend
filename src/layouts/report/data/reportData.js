/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useEffect, useState } from "react";

import { IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import { Link } from "react-router-dom";
import Constants, { Icons, defaultData } from "utils/Constants";
import moment from "moment";
import { useSelector } from "react-redux";
import Status from "components/Table/Status";
import Author from "components/Table/Author";

export default function data(ReportDetailsList, handleDelete, handleDownloadReport) {
  const [rows, setRows] = useState([]);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[6]?.screensInfo?.agreement;

  useEffect(() => {
    if (ReportDetailsList && permission?.read) {
      const list = ReportDetailsList.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          project: <Author name={item?.project?.title} />,
          reportType: <Author name={item?.reportType?.terminationTypeName} />,
          submittedBy: (
            <Author
              name={`${item?.createdBy?.firstName} ${item?.createdBy?.lastName} ${
                item.createdBy?.role?.[0]?.title === defaultData.SUPER_ADMIN_ROLE ? "(SA)" : ""
              }`}
            />
          ),
          submittedDate: (
            <Author name={moment(item?.createdAt).format(defaultData.WEB_24_HOURS_FORMAT)} />
          ),
          status: <Status title={`${item?.status.replace("_", " ")}`} />,
          action: (
            <MDBox>
              <IconButton
                aria-label="report-parameter"
                color="error"
                component={Link}
                to={`/client/report/${item[Constants.MONGOOSE_ID]}`}
              >
                {Icons.VIEW}
              </IconButton>
              {permission?.delete && (
                <IconButton
                  aria-label="delete report detail"
                  color="error"
                  onClick={() => handleDelete(item[Constants.MONGOOSE_ID])}
                >
                  {Icons.DELETE}
                </IconButton>
              )}
              <IconButton
                aria-label="edit report detail"
                color="info"
                onClick={() => handleDownloadReport(item[Constants.MONGOOSE_ID])}
              >
                {Icons.DOWNLOAD}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [ReportDetailsList, permission]);
  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      { Header: "Project", accessor: "project", align: "left" },
      { Header: "Type", accessor: "reportType", align: "left" },
      { Header: "Submitted By", accessor: "submittedBy", width: "13%", align: "left" },
      { Header: "Submitted Date", accessor: "submittedDate", width: "13%", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Action", accessor: "action", width: "13%", align: "left" },
    ],
    rows,
  };
}
