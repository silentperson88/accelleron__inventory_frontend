import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import FeedbackData from "layouts/feedback/data/FeedbackData";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import FilterDropdown from "components/Dropdown/FilterDropdown";

// Constant
import Constants, {
  ButtonTitles,
  Icons,
  ModalContent,
  defaultData,
  Colors,
  PageTitles,
} from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";

// Redux component
import { openSnackbar } from "redux/Slice/Notification";
import { useDispatch, useSelector } from "react-redux";
import getAllfeedbacks, { deleterFeedback } from "redux/Thunks/feedback";
import UserListThunk from "redux/Thunks/UserManagement";
import { reloadData } from "redux/Slice/Feedback";

function feedbacks() {
  const [filters, setFilters] = useState([
    {
      inputLabel: "Types",
      list: [
        "All",
        "Complaint",
        "Compliment",
        "Feature Request",
        "Harassment",
        "Idea",
        "Problem",
        "Question",
      ],
      selectedValue: "All",
    },
    {
      inputLabel: "Subjects",
      list: ["All", "Employment", "Hardware", "Software"],
      selectedValue: "All",
    },
    {
      inputLabel: "Submitted By",
      list: [{ [Constants.MONGOOSE_ID]: "all", title: "All" }],
      selectedValue: "all",
    },
  ]);
  const feedbackList = useSelector((state) => state.feedback);

  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);
  const [feedbackData, setFeedbackData] = useState({
    openDeleteModal: false,
    deleteId: "",
    deleteloading: false,
    listLoading: "pending",
  });
  const dispatch = useDispatch();

  const handleCloseDeleteModal = () => setFeedbackData({ ...feedbackData, openDeleteModal: false });
  const handleOpenDeleteModal = (feedbackId) =>
    setFeedbackData({ ...feedbackData, openDeleteModal: true, deleteId: feedbackId });

  const { columns, rows } = FeedbackData(feedbackList.list, handleOpenDeleteModal);

  const handleFilter = async (filterVale = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      type: filterVale[0].selectedValue.toLowerCase().replace(/ /g, "_"),
      subject: filterVale[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      createdBy: filterVale[2].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    await dispatch(getAllfeedbacks(data));
  };

  useEffect(() => {
    (async () => {
      handleFilter();
      const temp = [...filters];
      const users = await dispatch(UserListThunk());
      const userList = users.payload.data.data.reduce((acc, user) => {
        if (
          user.role?.accessType !== defaultData.WEB_ACCESSTYPE &&
          user.role?.title !== defaultData.SUPER_ADMIN_ROLE &&
          user.role?.title !== defaultData.ADMIN_ROLE
        ) {
          acc.push({
            [Constants.MONGOOSE_ID]: user[Constants.MONGOOSE_ID],
            title: `${user.firstName}${user.lastName}`,
          });
        }
        return acc;
      }, []);
      filters[2].list = [...filters[2].list, ...userList];
      setFilters(temp);
    })();
  }, []);

  const handleFilterChange = (e) => {
    const temp = [...filters];
    const { value } = e.target;
    const index = filters.findIndex((filter) => filter.inputLabel === e.target.name);
    temp[index].selectedValue = value;
    setFilters(temp);
    handleFilter(temp);
  };

  const handleResetFilter = () => {
    const temp = filters.map((filter) => ({
      ...filter,
      selectedValue: filter.list[0][Constants.MONGOOSE_ID] || filter.list[0],
    }));
    setFilters(temp);
    handleFilter(temp);
  };

  const handleDeleteFeedback = async () => {
    setFeedbackData({ ...feedbackData, deleteloading: true });
    const res = await dispatch(deleterFeedback(feedbackData.deleteId));
    if (res.status === 200) {
      dispatch(
        openSnackbar({
          message: Constants.FEEDBACK_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      setFeedbackData({ ...feedbackData, deleteloading: false, openDeleteModal: false });
      handleFilter();
    } else {
      dispatch(
        openSnackbar({
          message: Constants.FEEDBACK_DELETE_ERROR,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
      setFeedbackData({ ...feedbackData, deleteloading: false, openDeleteModal: false });
    }
  };

  const handleTablePagination = async () => {
    const paramData = {
      page: next + 1,
      perPage: tablePagination.perPage,
      type: filters[0].selectedValue.toLowerCase().replace(/ /g, "_"),
      subject: filters[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      createdBy: filters[2].selectedValue.toLowerCase().replace(/ /g, "_"),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    const res = await dispatch(getAllfeedbacks(data));
    if (res.payload.status === 200) {
      setNext(res.payload.data.data.length > 0 ? next + 1 : next);
    }
  };

  const handleReload = async () => {
    await dispatch(reloadData());
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.FEEDBACK} />
        <BasicButton
          icon={Icons.RELOAD}
          background={Colors.WHITE}
          border
          color={Colors.BLACK}
          action={handleReload}
        />
      </MDBox>
      <MDBox display="flex" justifyContent="space-between" mt={2} mx={0}>
        <MDBox display="flex wrap" flexWrap="wrap" justifyContent="start" mt={2} mx={0}>
          {filters &&
            filters.map((val) => (
              <FilterDropdown
                label={val.inputLabel}
                name={val.inputLabel}
                defaultValue={val?.selectedValue}
                value={val?.selectedValue}
                handleChange={handleFilterChange}
                menu={val.list}
                key={val.inputLabel}
              />
            ))}
          <Button
            sx={{
              mt: pxToRem(45),
              mr: 1,
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#fff",
              },
              fontSize: pxToRem(14),
              textTransform: "capitalize",
            }}
            variant="outlined"
            color="info"
            startIcon={Icons.RESET_FILTER}
            onClick={handleResetFilter}
          >
            {ButtonTitles.RESET_FILTER}
          </Button>
        </MDBox>
      </MDBox>
      <MDBox mt={2}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
          showTotalEntries={false}
          noEndBorder
          loading={feedbackList?.loading}
          currentPage={tablePagination.page}
          handleTablePagination={handleTablePagination}
          handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
        />
      </MDBox>

      {/* Delete Modal */}
      <DeleteModal
        open={feedbackData.openDeleteModal}
        title={ModalContent.FEEDBACK_DELETE_TITLE}
        message={ModalContent.FEEDBACK_DELETE_MESSAGE}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteFeedback}
      />
    </DashboardLayout>
  );
}

export default feedbacks;
