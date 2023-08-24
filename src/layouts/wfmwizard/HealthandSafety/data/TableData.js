import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Author from "components/Table/Author";
import Constants, { Icons } from "utils/Constants";

export default function TableData(handleOpenEdit, categoryList, handleOpenConfirm) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (categoryList.length > 0) {
      const tempRows = categoryList?.map((element, index) => {
        const temp = {
          srNo: <Author name={index + 1} />,
          name: <Author name={element.categoryName} />,
          isVisibleForIncidentCard: (
            <Icon color="secondary" fontSize="medium">
              {element.isVisibleForIncidentCard === true ? "check" : null}
            </Icon>
          ),
          visibleforsafecards: (
            <Icon color="secondary" fontSize="medium">
              {element.isVisibleForSafeCard === true ? "check" : null}
            </Icon>
          ),
          visibleforunsafecards: (
            <Icon color="secondary" fontSize="medium">
              {element.isVisibleForUnsafeCard === true ? "check" : null}
            </Icon>
          ),
          action: (
            <MDBox>
              <Icon
                fontSize="medium"
                onClick={() => handleOpenEdit(element)}
                sx={{ cursor: "pointer" }}
              >
                {Icons.EDIT}
              </Icon>{" "}
              &nbsp;
              <Icon
                fontSize="medium"
                onClick={() => handleOpenConfirm(element[Constants.MONGOOSE_ID])}
                sx={{ cursor: "pointer" }}
              >
                {Icons.DELETE}
              </Icon>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [categoryList]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%", align: "left" },
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      {
        Header: "Visible for incident cards",
        accessor: "isVisibleForIncidentCard",
        width: "20%",
        align: "center",
      },
      {
        Header: "Visible for safe cards",
        accessor: "visibleforsafecards",
        width: "20%",
        align: "center",
      },
      {
        Header: "Visible for unsafe cards",
        accessor: "visibleforunsafecards",
        width: "20%",
        align: "center",
      },
      { Header: "Action", accessor: "action", width: "6%", align: "left" },
    ],
    rows,
  };
}
