/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icons, defaultData } from "utils/Constants";
import Author from "components/Table/Author";

export default function data(
  handleOpenDeleteActivity,
  activityList,
  handleOpenEditActivty,
  startTime,
  handleDuration
) {
  const [rows, setRows] = useState([]);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[5]?.screensInfo?.agreement;
  const mongooseId = "_id";

  useEffect(() => {
    // sort activity list by end time
    const sortedAcivityList = activityList.sort(
      (a, b) => new Date(a.endTime) - new Date(b.endTime)
    );
    if (sortedAcivityList && permission?.read) {
      const list = sortedAcivityList.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          location: <Author name={item?.location?.title} />,
          activity: <Author name={item?.activity?.name} />,
          asset: <Author name={item?.cable?.cableName} />,
          endTime: <Author name={moment(item?.endTime).format(defaultData.WEB_24_HOURS_FORMAT)} />,
          duration: (
            <Author
              name={
                index === 0
                  ? handleDuration([startTime?.split(".")[0], item?.endTime?.split(".")[0]])
                  : handleDuration([
                      sortedAcivityList[index - 1]?.endTime?.split(".")[0],
                      item?.endTime?.split(".")[0],
                    ])
              }
            />
          ),
          comments: <Author name={item?.comments} />,
          action: (
            <MDBox>
              {permission?.update && (
                <IconButton
                  aria-label="fingerprint"
                  color="info"
                  onClick={() => handleOpenEditActivty(item, "update")}
                >
                  {Icons.EDIT}
                </IconButton>
              )}
              &nbsp;
              {permission?.delete && (
                <IconButton
                  aria-label="fingerprint"
                  color="error"
                  onClick={() => handleOpenDeleteActivity(item[mongooseId])}
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
  }, [activityList, ConfigData]);

  // return {
  const activityColumns = [
    { Header: "No.", accessor: "srNo", width: "7%" },
    { Header: "Location", accessor: "location", align: "left" },
    { Header: "Activity", accessor: "activity", align: "left" },
    { Header: "Asset", accessor: "asset", align: "left" },
    { Header: "End Time", accessor: "endTime", align: "left" },
    { Header: "Duration", accessor: "duration", align: "left" },
    { Header: "Descriptions", accessor: "comments", align: "left" },
  ];
  if (permission?.update || permission?.delete) {
    activityColumns.push({ Header: "Action", accessor: "action", width: "10%", align: "left" });
  }

  const tableData = {
    activityColumns,
    activityRows: rows,
  };

  return tableData;
}
