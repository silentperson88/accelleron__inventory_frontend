import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { Link } from "react-router-dom";
import Constants, { Icons, defaultData } from "utils/Constants";
import { IconButton, Switch } from "@mui/material";
import { updateAdminProfileThunk } from "redux/Thunks/SuperAdmin";
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch } from "react-redux";
import Author from "components/Table/Author";

export default function user(userData, handleFilter) {
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();

  const handleUserStatus = async (id, value) => {
    const b = {
      body: { isActive: value, id },
      id,
    };
    const res = await dispatch(updateAdminProfileThunk(b));
    if (res.payload.status === 200) {
      handleFilter();
      await dispatch(
        openSnackbar({ message: Constants.USER_STATUS_UPDATE_SUCCESS, notificationType: "success" })
      );
    }
  };
  useEffect(() => {
    if (userData) {
      const tempRows = userData
        .filter(
          (element) =>
            element.role?.title.toLowerCase() !== defaultData.ADMIN_ROLE &&
            element.role?.title !== defaultData.SUPER_ADMIN_ROLE
        )
        .map((element, index) => {
          const temp = {
            srNo: <Author name={index + 1} />,
            name: (
              <Link
                to={`/client/setting/usermanagement/profile/${element?.[Constants.MONGOOSE_ID]}`}
              >
                <Author name={`${element?.firstName} ${element?.lastName}`} />
              </Link>
            ),
            email: <Author name={element?.email} style={{ textTransform: "inherit" }} />,
            contactnumber: (
              <Author
                name={
                  element?.contactNumber?.number
                    ? `${element?.contactNumber?.in}${element?.contactNumber?.number}`
                    : element?.contactNumber
                }
              />
            ),
            role: <Author name={element?.role?.title} />,
            accessType: <Author name={element?.role?.accessType} />,
            projectType: (
              <Author name={element?.role?.allProject ? "All Project" : "Assigned Project"} />
            ),
            isactive: (
              <Switch
                checked={element?.isActive}
                onChange={(e) =>
                  handleUserStatus(element?.[Constants.MONGOOSE_ID], e.target.checked)
                }
              />
            ),
            action: (
              <MDBox>
                <Link
                  to={`/client/setting/usermanagement/profile/${element?.[Constants.MONGOOSE_ID]}`}
                >
                  <IconButton color="secondary" fontSize="medium" sx={{ cursor: "pointer" }}>
                    {Icons.VIEW}
                  </IconButton>
                </Link>
              </MDBox>
            ),
          };
          return temp;
        });
      setRows([...tempRows]);
    }
  }, [userData]);

  return {
    columns: [
      { Header: "No.", accessor: "srNo", width: "7%" },
      {
        Header: "Name",
        accessor: "name",
        width: "20%",
        align: "left",
      },
      { Header: "Email", accessor: "email", width: "20%", align: "left" },
      { Header: "Contact", accessor: "contactnumber", width: "20%", align: "left" },
      { Header: "Role", accessor: "role", width: "10%", align: "left" },
      { Header: "Access Type", accessor: "accessType", width: "10%", align: "left" },
      { Header: "Project Type", accessor: "projectType", width: "10%", align: "left" },
      { Header: "Is Active", accessor: "isactive", width: "10%", align: "left" },
      { Header: "Action", accessor: "action", width: "8%", align: "left" },
    ],
    rows,
  };
}
