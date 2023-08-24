import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import Constants, { Icons } from "utils/Constants";
import { IconButton } from "@mui/material";
import Author from "components/Table/Author";

export default function CertificateTypedata(
  certificatetypeList,
  handleOpenNewModal,
  setModalType,
  editLists,
  setEditLists,
  handleDelete
) {
  const [rows, setRows] = useState([]);
  const handleEdit = (item) => {
    setModalType("Update");
    setEditLists({ ...editLists, certificatetype: item });
    handleOpenNewModal("Certificate Type");
  };
  useEffect(() => {
    if (certificatetypeList) {
      const list = certificatetypeList?.map((item) => {
        const temp = {
          name: <Author name={item?.title} />,
          action: (
            <MDBox>
              <IconButton
                color="secondary"
                fontSize="medium"
                onClick={() => handleEdit(item)}
                sx={{ cursor: "pointer" }}
              >
                {Icons.EDIT}
              </IconButton>{" "}
              &nbsp;
              <IconButton
                color="secondary"
                fontSize="medium"
                sx={{ cursor: "pointer" }}
                onClick={() => handleDelete("certificatetype", item[[Constants.MONGOOSE_ID]])}
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
  }, [certificatetypeList]);

  return {
    certificateColumns: [
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "center" },
    ],
    certificateRows: rows,
  };
}
