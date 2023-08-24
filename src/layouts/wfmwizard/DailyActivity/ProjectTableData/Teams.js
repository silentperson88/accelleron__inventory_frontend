import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";

export default function teamData(
  teamList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const mongooseId = "_id";

  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, team: item });
    handleOpenNewModal("Team");
  };

  useEffect(() => {
    if (teamList) {
      const list = teamList?.map((item) => {
        const temp = {
          teamsWfmName: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.teamsWfmName}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <Icon
                color="secondary"
                fontSize="medium"
                onClick={() => handleEdit(item)}
                sx={{ cursor: "pointer" }}
              >
                {Icons.EDIT}
              </Icon>{" "}
              &nbsp;
              <Icon
                color="secondary"
                fontSize="medium"
                sx={{ cursor: "pointer" }}
                onClick={() => handleDelete("Team", item[mongooseId])}
              >
                {Icons.DELETE}
              </Icon>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...list]);
    }
  }, [teamList]);

  return {
    teamColumns: [
      { Header: "Teams WFM Name", accessor: "teamsWfmName", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    teamRows: rows,
  };
}
