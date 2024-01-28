import React, { useEffect, useState } from "react";

// Components
import Author from "components/Table/Author";

// Material Components
import { IconButton, Switch } from "@mui/material";
import MDBox from "components/MDBox";

// Utils
import Constants, { Icons, defaultData } from "utils/Constants";

export default function codeData(codeList, handleEdit, handleDelete, handleStatusChange) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (codeList) {
      const tempRows = codeList?.map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          code: <Author name={element?.code} maxContent={defaultData.MEDIUM_CONTENT_LENGTH} />,
          isActive: (
            <Switch
              checked={element?.status}
              onChange={(e) =>
                handleStatusChange(e, {
                  body: {
                    status: e.target.checked,
                    id: element[Constants.MONGOOSE_ID],
                  },
                })
              }
            />
          ),
          action: (
            <MDBox>
              <IconButton
                fontSize="medium"
                sx={{ cursor: "pointer", color: "#475467" }}
                onClick={() =>
                  handleEdit({
                    body: {
                      code: element.code,
                      id: element[Constants.MONGOOSE_ID],
                    },
                  })
                }
              >
                {Icons.EDIT2}
              </IconButton>
              <IconButton
                color="secondary"
                fontSize="medium"
                sx={{ cursor: "pointer" }}
                onClick={() => handleDelete(element[Constants.MONGOOSE_ID])}
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
  }, [codeList]);
  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      { Header: "Code", accessor: "code", align: "left" },
      { Header: "Is Active", accessor: "isActive", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "left" },
    ],
    rows,
  };
}
