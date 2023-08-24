import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import { Icons } from "utils/Constants";

export default function Setuplicensedata(licenseList, handleOpenEdit, permission) {
  const [rows, setRows] = useState([]);
  const mongooseId = "_id";

  useEffect(() => {
    if (licenseList) {
      const tempRows = licenseList?.map((element) => {
        const temp = {
          name: <MDTypography variant="caption">{element.name}</MDTypography>,
          status: (
            <MDTypography variant="caption">
              {permission?.filter((item) => item?.licence[mongooseId] === element[mongooseId])
                .length > 0
                ? "Active"
                : "In Active"}
            </MDTypography>
          ),
          count: (
            <MDTypography variant="caption">
              {
                permission?.filter((item) => item?.licence[mongooseId] === element[mongooseId])
                  .length
              }
            </MDTypography>
          ),
          action: (
            <MDBox>
              <Icon
                sx={{ cursor: "pointer" }}
                fontSize="medium"
                onClick={() => handleOpenEdit(element)}
              >
                {Icons.EDIT}
              </Icon>{" "}
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [permission, licenseList]);
  return {
    columns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Status", accessor: "status", width: "20%", align: "left" },
      { Header: "Count", accessor: "count", width: "20%", align: "left" },
      { Header: "Action", accessor: "action", width: "5%", align: "left" },
    ],
    rows,
  };
}
