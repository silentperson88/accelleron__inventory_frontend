import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import LoanDataTable from "dataTables/submittedLoan/submitterLoan";
import DataTable from "examples/Tables/DataTable";

// Constant
import Constants, { defaultData, PageTitles } from "utils/Constants";

// Redux component
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch } from "react-redux";
import { getAllSubmitterLoanFormThunk } from "redux/Thunks/LoanFormConfig";

function feedbacks() {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(Constants.PENDING);
  const dispatch = useDispatch();

  const { columns, rows } = LoanDataTable(loanData);

  useEffect(() => {
    (async () => {
      const res = await dispatch(getAllSubmitterLoanFormThunk());
      if (res.payload.status === 200) {
        setLoanData(res.payload.data.data);
        setLoading(Constants.FULFILLED);
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
        <PageTitle title={PageTitles.LOAN_DATA} />
      </MDBox>
      <MDBox mt={2}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
          showTotalEntries={false}
          noEndBorder
          loading={loading}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default feedbacks;
