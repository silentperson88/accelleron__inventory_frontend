import React, { useEffect, useState } from "react";

// Components
import Author from "components/Table/Author";

// Material Components
import { IconButton, Switch } from "@mui/material";
import MDBox from "components/MDBox";

// Utils
import Constants, { Icons, defaultData } from "utils/Constants";

export default function bankData(bankList, handleEdit, handleDelete, handleStatusChange) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (bankList) {
      const tempRows = bankList?.map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          bankName: (
            <Author name={element?.bankName} maxContent={defaultData.MEDIUM_CONTENT_LENGTH} />
          ),
          isActive: (
            <Switch
              checked={element?.bankStatus}
              onChange={(e) =>
                handleStatusChange(e, {
                  body: {
                    bankStatus: e.target.checked,
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
                      bankName: element.bankName,
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
  }, [bankList]);
  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      { Header: "Bank Name", accessor: "bankName", align: "left" },
      { Header: "Is Active", accessor: "isActive", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "left" },
    ],
    rows,
  };
}
