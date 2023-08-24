import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";

export default function Member(
  memberList,
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
    setEditLists({ ...editLists, member: item });
    handleOpenNewModal("Member");
  };
  useEffect(() => {
    if (memberList) {
      const list = memberList.map((item) => {
        const temp = {
          candidateName: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {`${item?.user?.firstName} ${item.user?.lastName}`}
            </MDTypography>
          ),
          projectFunction: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {item?.function?.functionName}
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
                onClick={() => handleDelete("Member", item[mongooseId])}
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
  }, [memberList]);
  return {
    membersColumns: [
      { Header: "Candidate Name", accessor: "candidateName", width: "20%", align: "left" },
      { Header: "Project function", accessor: "projectFunction", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "20%", align: "right" },
    ],
    membersRows: rows,
  };
}
