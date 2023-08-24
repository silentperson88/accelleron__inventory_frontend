import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import moment from "moment";
import { useEffect, useState } from "react";
import MDAvatar from "components/MDAvatar";
import { IconButton } from "@mui/material";
import { Icons } from "utils/Constants";

export default function licenseData(pendingData, openConfirmationBox) {
  const [rows, setRows] = useState([]);
  const mongooseId = "_id";

  useEffect(() => {
    if (pendingData) {
      const tempRows = pendingData.map((element, index) => {
        const temp = {
          no: <MDTypography variant="caption">{index + 1}</MDTypography>,
          logo: <MDAvatar src={element?.account?.logo} size="sm" />,
          client: (
            <MDBox lineHeight={1} textAlign="left">
              <MDTypography variant="caption">
                {" "}
                {`${element?.account?.accountOwner?.firstName} ${element?.account?.accountOwner?.lastName}`}
              </MDTypography>
            </MDBox>
          ),
          email: (
            <MDBox lineHeight={1} textAlign="left">
              <MDTypography variant="caption">
                {" "}
                {element?.account?.accountOwner?.email}
              </MDTypography>
            </MDBox>
          ),
          organization: (
            <MDBox lineHeight={1} textAlign="left">
              <MDTypography variant="caption">{element?.account?.name}</MDTypography>
            </MDBox>
          ),
          licensename: <MDTypography variant="caption">{element?.licence?.name}</MDTypography>,
          permission: <MDTypography variant="caption">{element?.permission?.name}</MDTypography>,
          created: (
            <MDTypography variant="caption">
              {moment(element?.createdAt).format("DD-MM-YYYY")}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => openConfirmationBox(element[mongooseId], "reject")}
              >
                {Icons.REJECTED}
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="info"
                onClick={() => openConfirmationBox(element[mongooseId], "approve")}
              >
                {Icons.APPROVED}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [pendingData]);

  return {
    columns: [
      { Header: "No.", accessor: "no", width: "5%", align: "left" },
      { Header: "Logo", accessor: "logo", width: "5%", align: "left" },
      { Header: "Client", accessor: "client", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Organization", accessor: "organization", align: "left" },
      { Header: "License Name", accessor: "licensename", align: "left" },
      { Header: "Pending Permission", accessor: "permission", align: "left" },
      { Header: "Created", accessor: "created", align: "left" },
      { Header: "Action", accessor: "action", width: "8%", align: "left" },
    ],
    rows,
  };
}
