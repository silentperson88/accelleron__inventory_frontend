import React, { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Constants, { Icons } from "utils/Constants";
import { IconButton, Switch } from "@mui/material";

export default function medical(questionsData, handleEdit, handleDelete, handlePublishChange) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (questionsData) {
      const tempRows = questionsData.map((element, index) => {
        const temp = {
          srNo: (
            <MDTypography display="block" variant="caption">
              {index + 1}
            </MDTypography>
          ),
          questions: <MDTypography variant="caption">{element?.title}</MDTypography>,
          ispublish: (
            <Switch
              checked={element?.isPublished}
              onChange={(e) =>
                handlePublishChange(e, {
                  body: {
                    isPublished: e.target.checked,
                  },
                  id: element[Constants.MONGOOSE_ID],
                })
              }
            />
          ),
          action: (
            <MDBox>
              <IconButton
                fontSize="medium"
                disabled={element?.isPublished}
                sx={{ cursor: "pointer", color: "#475467" }}
                onClick={() =>
                  handleEdit({
                    body: {
                      isPublished: element.isPublished,
                      title: element.title,
                    },
                    id: element[Constants.MONGOOSE_ID],
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
  }, [questionsData]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "5%" },
      {
        Header: "Questions",
        accessor: "questions",
        width: "30%",
        align: "left",
      },
      { Header: "isPublish?", accessor: "ispublish", width: "8%", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "left" },
    ],
    rows,
  };
}
