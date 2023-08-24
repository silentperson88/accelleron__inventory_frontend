/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { IconButton, Switch } from "@mui/material";
import Author from "components/Table/Author";
import { Link } from "react-router-dom";
import Constants, { Icons, ModalContent } from "utils/Constants";

export default function RoleData(handleOpenEdit, roleList, handleConfirmationModalOpen) {
  const [rows, setRows] = useState([]);

  const ActiveRole = ({ data }) => (
    <Switch
      checked={data?.isActive}
      onChange={(e) => handleConfirmationModalOpen(data?.[Constants.MONGOOSE_ID], e.target.checked)}
    />
  );

  useEffect(() => {
    if (roleList) {
      const tempRows = roleList
        ?.filter((element) => element?.title !== "admin")
        .map((element, index) => {
          const temp = {
            srNo: <Author name={index + 1} />,
            role: <Author name={element.title} />,
            description: <Author name={element.description} />,
            accessType: <Author name={element?.accessType} />,
            projectType: <Author name={element.allProject ? "All Project" : "Assigned"} />,
            isActive: <ActiveRole data={element} />,
            action: (
              <MDBox>
                <Link
                  to={`/client/setting/role-management/${element?.[Constants.MONGOOSE_ID]}`}
                  state={{ title: element?.title }}
                >
                  <IconButton aria-label="delete report type" color="error">
                    {Icons.VIEW}
                  </IconButton>
                </Link>
                <IconButton
                  aria-label="edit report type"
                  color="error"
                  onClick={() =>
                    handleOpenEdit(
                      ModalContent.EDIT_ROLE,
                      "update",
                      element,
                      element?.[Constants.MONGOOSE_ID]
                    )
                  }
                >
                  {Icons.EDIT}
                </IconButton>
              </MDBox>
            ),
          };
          return temp;
        });
      setRows([...tempRows]);
    }
  }, [roleList]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "3%", align: "center" },
      { Header: "Role", accessor: "role", align: "left" },
      {
        Header: "Description",
        accessor: "description",
        width: "40%",
        align: "left",
      },
      { Header: "Access Type", accessor: "accessType", width: "20%", align: "left" },
      { Header: "Project Type", accessor: "projectType", width: "20%", align: "left" },
      { Header: "Is Active", accessor: "isActive", width: "11%", align: "center" },
      { Header: "Action", accessor: "action", width: "6%", align: "center" },
    ],
    rows,
  };
}
