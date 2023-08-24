/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";

// Images
import { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Constants, { Icons, defaultData } from "utils/Constants";
import { IconButton } from "@mui/material";
import Sessions from "utils/Sessions";
import Author from "components/Table/Author";

export default function data(adminList, setSwitchToAdminPanel) {
  const [rows, setRows] = useState([]);

  const handleViewAsAdmin = async (account, admin) => {
    setSwitchToAdminPanel(true);
    setTimeout(() => {
      Sessions.setIsSuperAdminViewingAdminPanel(account, admin);
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    if (adminList) {
      const tempRows = adminList?.map((element, index) => {
        const temp = {
          no: <Author name={index + 1} />,
          logo: <Logo image={element.logo} id={element?.accountOwner?.[Constants.MONGOOSE_ID]} />,
          client: (
            <Link to={`/admin/profile/${element?.accountOwner?.[Constants.MONGOOSE_ID]}`}>
              <Author
                name={`${element?.accountOwner?.firstName} ${element?.accountOwner?.lastName}`}
              />
            </Link>
          ),
          email: (
            <Link to={`/admin/profile/${element?.accountOwner?.[Constants.MONGOOSE_ID]}`}>
              <Author name={element?.email} style={{ textTransform: "inherit" }} />
            </Link>
          ),
          organization: (
            <Link to={`/admin/profile/${element?.accountOwner?.[Constants.MONGOOSE_ID]}`}>
              <Author name={element?.name} />
            </Link>
          ),
          status: (
            <Status
              color={element.isActive ? "#029E3B" : "#BD382F"}
              bgColor={element.isActive ? "#DCF5E9" : "#FEE4E2"}
              title={element.isActive ? "Active" : "InActive"}
            />
          ),
          employed: (
            <Author name={moment(element?.createdAt).format(defaultData.WEB_DATE_FORMAT)} />
          ),
          action: (
            <MDBox>
              <Link to={`/admin/profile/${element?.accountOwner?.[Constants.MONGOOSE_ID]}`}>
                <IconButton color="secondary" fontSize="medium" sx={{ cursor: "pointer" }}>
                  {Icons.VIEW}
                </IconButton>
              </Link>
              <IconButton
                aria-label="edit report type"
                color="error"
                onClick={() =>
                  handleViewAsAdmin(
                    element?.[Constants.MONGOOSE_ID],
                    element?.accountOwner?.[Constants.MONGOOSE_ID]
                  )
                }
              >
                {Icons.MANAGE_ACCOUNT}
              </IconButton>
            </MDBox>
          ),
        };
        return temp;
      });
      setRows([...tempRows]);
    }
  }, [adminList]);
  const Logo = ({ image, id }) => (
    <Link to={`/admin/profile/${id}`} state={{ from: id }}>
      <MDAvatar src={image} />
    </Link>
  );

  const Status = ({ color, bgColor, title }) => (
    <MDBox
      color={color}
      bgColor={bgColor}
      variant="contained"
      borderRadius="lg"
      opacity={1}
      p={1}
      width="62px"
      height="24px"
      textAlign="right"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      {title}
    </MDBox>
  );
  return {
    columns: [
      { Header: "No.", accessor: "no", width: "5%", align: "left" },
      { Header: "Logo", accessor: "logo", width: "5%", align: "left" },
      { Header: "Client", accessor: "client", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Organization", accessor: "organization", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Employed", accessor: "employed", align: "left" },
      { Header: "Action", accessor: "action", width: "8%", align: "center" },
    ],

    rows,
  };
}
