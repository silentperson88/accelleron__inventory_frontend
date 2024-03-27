/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { IconButton, Switch } from "@mui/material";
import Author from "components/Table/Author";
import Constants, { Icons, ModalContent } from "utils/Constants";
import Status from "components/Table/Status";

export default function palletData(handleOpenEdit, roleList, handleConfirmationModalOpen) {
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
            rack: <Author name={element.rack} />,
            palletName: <Author name={element.pallet} />,
            status: <Status title={element.status} />,
            isActive: <ActiveRole data={element} />,
            action: (
              <MDBox>
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
      { Header: "Rack", accessor: "rack", align: "left" },
      {
        Header: "Pallet",
        accessor: "palletName",
        width: "40%",
        align: "left",
      },
      {
        Header: "Status",
        accessor: "status",
        width: "11%",
        align: "center",
      },
      { Header: "Is Active", accessor: "isActive", width: "11%", align: "center" },
      { Header: "Action", accessor: "action", width: "6%", align: "center" },
    ],
    rows,
  };
}
