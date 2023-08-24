/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import moment from "moment";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Status from "components/Table/Status";
import Constants, { Icons, defaultData } from "utils/Constants";
import Author from "components/Table/Author";

export default function data(handleOpenDeleteModal, shiftList) {
  const [rows, setRows] = useState([]);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[5]?.screensInfo?.agreement;
  useEffect(() => {
    if (shiftList && permission?.read) {
      const list = shiftList.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          project: (
            <Author nickName={item?.projects[0]?.title} name={item?.defaultProject?.title} />
          ),
          team: <Author name={item?.teams[0]?.teamsWfmName} />,
          status: <Status title={`${item?.status.replace("_", " ")}`} />,
          startTime: (
            <MDTypography
              variant="caption"
              sx={{ cursor: "pointer" }}
              component={Link}
              to={`/client/shifts/${item?.[Constants.MONGOOSE_ID]}`}
            >
              {item?.startDate
                ? moment(item?.startDate).format(defaultData.WEB_24_HOURS_FORMAT)
                : "---"}
            </MDTypography>
          ),
          createdBy: (
            <Author
              name={`${item?.createdBy?.firstName ?? ""} ${item?.createdBy?.lastName ?? ""} ${
                item?.createdBy?.role?.[0]?.title === defaultData.SUPER_ADMIN_ROLE ? "(SA)" : ""
              }`}
              nickName={moment(item?.createdAt).format(defaultData.WEB_DATE_FORMAT)}
            />
          ),
          action: (
            <MDBox>
              {permission?.read && (
                <IconButton
                  aria-label="fingerprint"
                  color="info"
                  component={Link}
                  to={`/client/shifts/${item?.[Constants.MONGOOSE_ID]}`}
                >
                  {Icons.VIEW}
                </IconButton>
              )}
              &nbsp;
              {permission?.delete && (
                <IconButton
                  aria-label="fingerprint"
                  color="error"
                  onClick={() => handleOpenDeleteModal(item?.[Constants.MONGOOSE_ID])}
                >
                  {Icons.DELETE}
                </IconButton>
              )}
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [shiftList, ConfigData]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "7%" },
      { Header: "Project", accessor: "project", align: "left" },
      { Header: "Team", accessor: "team", align: "left" },
      { Header: "Start Time", accessor: "startTime", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Created By", accessor: "createdBy", align: "left" },
      { Header: "Action", accessor: "action", width: "10%", align: "left" },
    ],

    rows,
  };
}
