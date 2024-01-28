import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import LoanDataTable from "dataTables/submittedLoan/submitterLoan";
import DataTable from "examples/Tables/DataTable";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import ConfigDropdown from "components/Dropdown/ConfigDropdown";

// Constant
import Constants, { defaultData, PageTitles, ModalContent, ButtonTitles } from "utils/Constants";

// Redux component
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch } from "react-redux";
import { getAllSubmitterLoanFormThunk, updateLeadDataThunk } from "redux/Thunks/LoanFormConfig";
import getAllBanks, { getAllCodes } from "redux/Thunks/leadUtilsThunks";
import FTextField from "components/Form/FTextField";
import pxToRem from "assets/theme/functions/pxToRem";
import { paramCreater } from "utils/methods/methods";

const initialEditModal = {
  open: false,
  id: "",
  status: "open",
  sourceOfLead: "",
  imd: "",
  bank: "",
  code: "",
  currentStatus: "",
  remark: "",
};

function feedbacks() {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editModal, setEditModal] = useState(initialEditModal);
  const [error, setError] = useState({});
  const leadSources = ["Direct Offline", "Direct Online", "IMD Channel"];
  const currentStatus = [
    { [Constants.MONGOOSE_ID]: "Document Verification", title: "Document Verification" },
    { [Constants.MONGOOSE_ID]: "Application Submitted", title: "Application Submitted" },
    { [Constants.MONGOOSE_ID]: "Pending with Credit", title: "Pending with Credit" },
    { [Constants.MONGOOSE_ID]: "Offer Received", title: "Offer Received" },
    { [Constants.MONGOOSE_ID]: "Offer Selected", title: "Offer Selected" },
    { [Constants.MONGOOSE_ID]: "Loan Sanctioned", title: "Loan Sanctioned" },
    { [Constants.MONGOOSE_ID]: "Disbursement Documentation", title: "Disbursement Documentation" },
    { [Constants.MONGOOSE_ID]: "Disbursement", title: "Disbursement" },
    {
      [Constants.MONGOOSE_ID]: "Amount Credited/Cheque issued",
      title: "Amount Credited/Cheque issued",
    },
  ];

  const [bankList, setBankList] = useState([]);
  const [codeList, setCodeList] = useState([]);
  const dispatch = useDispatch();

  const handleEditModal = (data) => {
    setEditModal({
      open: true,
      data,
      id: data?.[Constants.MONGOOSE_ID],
      status: data?.status,
      sourceOfLead: data?.sourceOfLead,
      imd: data?.imd,
      bank: data?.bank,
      code: data?.code,
      currentStatus: data?.currentStatus,
      remark: data?.remark,
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({ open: false, ...initialEditModal });
  };

  const { columns, rows } = LoanDataTable(loanData, handleEditModal);

  const fetchDataTable = async () => {
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
  };

  useEffect(() => {
    (async () => {
      fetchDataTable();
      const bankParams = {
        bankStatus: true,
      };
      const codeParams = {
        status: true,
      };
      const [bankRes, codeRes] = await Promise.all([
        dispatch(getAllBanks(paramCreater(bankParams))),
        dispatch(getAllCodes(paramCreater(codeParams))),
      ]);
      if (bankRes.payload.status === 200 && codeRes.payload.status === 200) {
        const tempBankList = bankRes.payload.data.data.map((item) => ({
          [Constants.MONGOOSE_ID]: item[Constants.MONGOOSE_ID],
          title: item.bankName,
        }));
        const tempCodeList = codeRes.payload.data.data.map((item) => ({
          [Constants.MONGOOSE_ID]: item[Constants.MONGOOSE_ID],
          title: item.code,
        }));
        setBankList(tempBankList);
        setCodeList(tempCodeList);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditModal({ ...editModal, [name]: value });
  };

  const handleUpdateLeadData = async () => {
    setEditLoading(true);
    const body = {
      ...(editModal.sourceOfLead !== editModal.data.sourceOfLead && {
        sourceOfLead: editModal.sourceOfLead,
      }),
      ...(editModal.imd !== editModal.data.imd && { imd: editModal.imd }),
      ...(editModal.bank !== editModal.data.bank && { bank: editModal.bank }),
      ...(editModal.code !== editModal.data.code && { code: editModal.code }),
      ...(editModal.currentStatus !== editModal.data.currentStatus && {
        currentStatus: editModal.currentStatus,
      }),
      ...(editModal.remark !== editModal.data.remark && { remark: editModal.remark }),
      ...(editModal.status !== editModal.data.status && { status: editModal.status }),
    };
    const res = await dispatch(updateLeadDataThunk({ id: editModal.id, body }));
    if (res.payload.status === 200) {
      dispatch(
        openSnackbar({
          message: res.payload.data.message,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      handleCloseEditModal();
      fetchDataTable();
    } else {
      setError(res.payload.data.message);
    }
    setEditLoading(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.LEAD_BAY} />
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

      {/* Edit Lead Data */}
      <BasicModal
        open={editModal.open}
        handleClose={handleCloseEditModal}
        title={ModalContent.EDIT_LEAD_DATA}
        actionButton={editLoading ? ButtonTitles.UPDATE_LOADING : ButtonTitles.UPDATE}
        handleAction={handleUpdateLeadData}
      >
        <ConfigDropdown
          label="Source of Lead*"
          name="sourceOfLead"
          id="sourceOfLead"
          value={editModal.sourceOfLead}
          handleChange={(e, value) => handleChange({ target: { name: "sourceOfLead", value } })}
          menu={leadSources}
          error={Boolean(error?.sourceOfLead)}
          helperText={error?.sourceOfLead}
          minWidth={pxToRem(200)}
        />
        <FTextField
          label="IMD*"
          placeholder="Enter IMD"
          id="imd"
          name="imd"
          type="text"
          error={Boolean(error?.imd)}
          helperText={error?.imd}
          value={editModal.imd}
          handleChange={handleChange}
          marginBottom={2}
        />
        <ConfigDropdown
          label="Bank*"
          name="bank"
          id="bank"
          value={editModal.bank}
          handleChange={(e, value) => handleChange({ target: { name: "bank", value } })}
          menu={bankList}
          error={Boolean(error?.bank)}
          helperText={error?.bank}
          minWidth={pxToRem(200)}
        />
        <ConfigDropdown
          label="Code*"
          name="code"
          id="code"
          value={editModal.code}
          handleChange={(e, value) => handleChange({ target: { name: "code", value } })}
          menu={codeList}
          error={Boolean(error?.code)}
          helperText={error?.code}
          minWidth={pxToRem(200)}
        />
        <ConfigDropdown
          label="Current Status*"
          name="currentStatus"
          id="currentStatus"
          value={editModal.currentStatus}
          handleChange={(e, value) => handleChange({ target: { name: "currentStatus", value } })}
          menu={currentStatus}
          error={Boolean(error?.currentStatus)}
          helperText={error?.currentStatus}
          minWidth={pxToRem(200)}
        />
        <FTextField
          label="Remark*"
          placeholder="Enter Remark"
          id="remark"
          name="remark"
          type="text"
          error={Boolean(error?.remark)}
          helperText={error?.remark}
          value={editModal.remark}
          handleChange={handleChange}
          marginBottom={2}
        />
        <ConfigDropdown
          label="Status*"
          name="status"
          id="status"
          value={editModal.status}
          handleChange={(e, value) => handleChange({ target: { name: "status", value } })}
          menu={["open", "close"]}
          error={Boolean(error?.status)}
          helperText={error?.status}
          minWidth={pxToRem(200)}
        />
      </BasicModal>
    </DashboardLayout>
  );
}

export default feedbacks;
