/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import Author from "components/Table/Author";

export default function data(handleOpenTeamMember, handleOpenDeleteTeamMember, currentShift) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (Object.keys(currentShift).length > 0) {
      const list = currentShift.teammembers.map((item, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          member: <Author name={item?.members?.users?.fullName} />,
          function: <Author name={item?.members?.functions?.functionName} />,
          action: (
            <MDBox>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => handleOpenTeamMember(item, "update")}
              >
                {Icons.EDIT}
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="error"
                onClick={() => handleOpenDeleteTeamMember(item?.[Constants.MONGOOSE_ID])}
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
  }, [currentShift]);

  return {
    teamMemberColumn: [
      { Header: "No.", accessor: "srNo", width: "7%" },
      { Header: "Member", accessor: "member", align: "left" },
      { Header: "Function", accessor: "function", align: "left" },
      { Header: "Action", accessor: "action", width: "10%", align: "left" },
    ],

    teamMemberRow: rows,
  };
}
