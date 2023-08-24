// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import getAllCategories, { deleteCardThunk } from "redux/Thunks/CardCategory";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import SetupCardCategoryModal from "examples/modal/HealthAndSafety/SetupCardCategoryModal";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import { openSnackbar } from "redux/Slice/Notification";
import TableData from "layouts/wfmwizard/HealthandSafety/data/TableData";
import Constants, { ModalContent, Icons, Colors, defaultData } from "utils/Constants";
import { Divider } from "@mui/material";
import pxToRem from "assets/theme/functions/pxToRem";

function SetupCardCategory() {
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("pending");
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [cardData, setCardData] = useState([]);
  const handleCloseConfirm = () => setOpenConfirm(false);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };
  const handleOpenEdit = (element) => {
    setCardData(element);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    (async () => {
      setTablePagination({
        ...tablePagination,
        page: 0,
      });
      setNext(0);
      const data = new URLSearchParams({
        page: 0,
        perPage: tablePagination.perPage,
      });
      const res = await dispatch(getAllCategories(data));
      setLoadingStatus("fullfilled");
      setCategoryList(res.payload.data.data);
    })();
  }, [updateList]);

  const handleDelete = async () => {
    const res = await dispatch(deleteCardThunk(deleteId));
    if (res.payload.status === 200) {
      handleCloseConfirm();
      const index = categoryList.findIndex(
        (element) => element[Constants.MONGOOSE_ID] === deleteId
      );
      const temp = [...categoryList];
      temp.splice(index, 1);
      setCategoryList(temp);
      await dispatch(
        openSnackbar({
          message: Constants.CATEGORY_DELETE_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    }
  };
  const handleReload = async () => {
    setLoadingStatus("pending");
    await dispatch(getAllCategories({ page: 0, perPage: 100 }));
    setLoadingStatus("fullfilled");
  };
  const { columns, rows } = TableData(handleOpenEdit, categoryList, handleOpenConfirm);

  const handleTablePagination = async () => {
    const data = new URLSearchParams({
      page: next + 1,
      perPage: tablePagination.perPage,
    });
    const res = await dispatch(getAllCategories(data));
    if (res.payload.status === 200) {
      setCategoryList([...categoryList, ...res.payload.data.data]);
      setNext(res.payload.data.data.length > 0 ? next + 1 : next);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between" alignItems="center" fullWidth>
        <PageTitle title="Card Categories Setup" />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title="Category"
            icon="add_circle_outline"
            background="#191A51"
            color="#ffffff"
            openModal={setOpen}
          />
          <Divider
            orientation="vertical"
            sx={{
              backgroundColor: "var(--gray-300, #D0D5DD)",
              height: "auto",
              marginLeft: pxToRem(16),
              marginRight: 0,
            }}
          />
          <BasicButton
            icon={Icons.RELOAD}
            background={Colors.WHITE}
            border
            color={Colors.BLACK}
            action={handleReload}
          />
        </MDBox>
      </MDBox>
      <SetupCardCategoryModal
        title="New Card"
        open={open}
        setOpen={setOpen}
        updateList={updateList}
        setUpdateList={setUpdateList}
      />
      <MDBox mt={3} mb={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus}
          currentPage={tablePagination.page}
          handleTablePagination={handleTablePagination}
          handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
        />
      </MDBox>
      <SetupCardCategoryModal
        title="Update Card"
        open={openEdit}
        data={cardData}
        setOpen={handleCloseEdit}
        updateList={updateList}
        setUpdateList={setUpdateList}
        setCategoryList={setCategoryList}
        categoryList={categoryList}
      />

      <DeleteModal
        open={openConfirm}
        title={ModalContent.CARD_CATEGORY_DELETE_TITLE}
        message={ModalContent.CARD_CATEGORY_DELETE_MESSAGE}
        handleClose={handleCloseConfirm}
        handleDelete={handleDelete}
      />
    </DashboardLayout>
  );
}

export default SetupCardCategory;
