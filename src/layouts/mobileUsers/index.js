import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import MobileUsers from "layouts/mobileUsers/data/mobileUsers";
import DataTable from "examples/Tables/DataTable";

// Constant
import Constants, { defaultData, PageTitles } from "utils/Constants";

// Redux component
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch } from "react-redux";
import getAllMobileUsers from "redux/Thunks/MobileUser";

function feedbacks() {
  const [mobileUsers, setMobileUsers] = useState();
  const dispatch = useDispatch();

  const { columns, rows } = MobileUsers(mobileUsers);

  useEffect(() => {
    (async () => {
      const res = await dispatch(getAllMobileUsers());
      if (res.payload.status === 200) {
        setMobileUsers(res.payload.data.data);
      } else {
        dispatch(
          openSnackbar({
            message: Constants.MOBILE_USERS_ERROR,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.MOBILE_USERS} />
      </MDBox>
      <MDBox mt={2}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
          showTotalEntries={false}
          noEndBorder
          loading="fullfilled"
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default feedbacks;
