/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Icons, defaultData } from "utils/Constants";
import { IconButton } from "@mui/material";
import Status from "components/Table/Status";
import Author from "components/Table/Author";
import RiskFactor from "components/Table/RiskFactor";
import By from "components/Table/By";

export default function data(handleEditOpen, handleDeleteOpen) {
  const [rows, setRows] = useState([]);
  const safetyCards = useSelector((state) => state.safetCard.list);
  const ConfigData = useSelector((state) => state.config);

  const screens = ConfigData?.screens;
  useEffect(() => {
    if (safetyCards) {
      const list = [];
      safetyCards.forEach((item, index) => {
        const configObjIdx = screens.findIndex(
          (s) =>
            s.screensInfo &&
            s.screensInfo.title &&
            s.screensInfo.title.toLowerCase() === item.cardType
        );
        const configObj = configObjIdx !== -1 ? screens[configObjIdx] : null;
        if (configObj && configObj.screensInfo?.agreement?.read) {
          const temp = {
            srNo: <Author name={index + 1} />,
            title: <Author name={item.title ? item.title : ""} maxContent={20} />,
            project: (
              <Author
                nickName={item.project ? item.project?.title : ""}
                name={item.defaultProject?.title ?? ""}
              />
            ),
            type: (
              <Author
                icon={item?.images && item.images.length > 0 ? Icons.ATTACHMENT : null}
                name={item?.cardType}
              />
            ),
            location: <Author name={item?.location?.title} />,
            riskFactor: item?.riskFactor && <RiskFactor risk={parseInt(item?.riskFactor, 10)} />,
            status: <Status title={`${item?.status.replace("_", " ")}`} />,
            createdBy: (
              <By
                name={`${item.createdBy?.firstName} ${item.createdBy?.lastName}`}
                isSuperAdmin={item.createdBy?.role?.title === defaultData.SUPER_ADMIN_ROLE}
                when={moment(item?.createdAt).format(defaultData.WEB_DATE_FORMAT)}
              />
            ),
            lastChangedBy: (
              <By
                name={
                  item.updatedBy ? `${item.updatedBy?.firstName} ${item.updatedBy?.lastName} ` : ""
                }
                isSuperAdmin={item.updatedBy?.role?.title === defaultData.SUPER_ADMIN_ROLE}
                when={moment(item?.updatedAt).format(defaultData.WEB_DATE_FORMAT)}
              />
            ),
            action: (
              <MDBox>
                {configObj?.screensInfo?.agreement?.update && (
                  <IconButton
                    aria-label="Edit Safety Card"
                    color="info"
                    onClick={() => handleEditOpen(item)}
                  >
                    {Icons.EDIT}
                  </IconButton>
                )}
                &nbsp;
                {configObj?.screensInfo?.agreement?.delete && (
                  <IconButton
                    aria-label="fingerprint"
                    color="error"
                    onClick={() => handleDeleteOpen(item)}
                  >
                    {Icons.DELETE}
                  </IconButton>
                )}
              </MDBox>
            ),
          };
          list.push(temp);
        }
      });
      setRows([...list]);
    }
  }, [safetyCards, ConfigData]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%" },
      { Header: "Project", accessor: "project", align: "left" },
      { Header: "Type", accessor: "type", align: "left" },
      { Header: "Title", accessor: "title", align: "left" },
      { Header: "Location", accessor: "location", align: "left" },
      { Header: "Risk Factor", accessor: "riskFactor", width: "5%", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Created By", accessor: "createdBy", align: "left" },
      { Header: "Last Changed By", accessor: "lastChangedBy", align: "left" },
      { Header: "Action", accessor: "action", align: "center", width: "5%" },
    ],

    rows,
  };
}
