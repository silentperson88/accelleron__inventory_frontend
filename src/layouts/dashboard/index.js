// Material Dashboard 2 React components
import { Button, Card, Divider, Menu, MenuItem } from "@mui/material";
import MDBox from "components/MDBox";

// Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import FilterDropdown from "components/Dropdown/FilterDropdown";

// Data
import authorsTableData from "layouts/dashboard/data/safetyCardData";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSafetyCardThunk } from "redux/Thunks/SafetyCard";
import UpdateSafetyCardForm from "examples/modal/UpdateSafetyCardForm";
import SafetyCardForm from "examples/modal/SafetyCardForm/SafetyCardForm";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import PageTitle from "examples/NewDesign/PageTitle";
import filterThunk, {
  projectListThunk,
  locationListThunk,
  severityListThunk,
  likelihoodThunk,
  exportSafetyCardThunk,
} from "redux/Thunks/Filter";
import {
  updateList,
  loadSafetyCardData,
  reloadData,
  removeSafetyCard,
} from "redux/Slice/SafetyCard";
import Constants, {
  Icons,
  PageTitles,
  ButtonTitles,
  LicensePermission,
  Colors,
  defaultData,
} from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";
import { openSnackbar } from "redux/Slice/Notification";

function Dashboard() {
  const mongooseId = "_id";
  const [openSafeModal, setOpenSafeModal] = useState(false);
  const [openUnsafeModal, setOpenUnsafeModal] = useState(false);
  const [openNCRModal, setOpenNCRModal] = useState(false);
  const [openIncidentModal, setOpenIncidentModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [updateSafetyCard, setUpdateSafetyCard] = useState({});
  const [updateSafetyCardId, setUpdateSafetyCardId] = useState("");
  const [deleteData, setDeleteData] = useState({
    open: false,
    id: "",
    title: "",
    message: "",
  });
  const [dynamicFiltersdata, setDynamicFiltersdata] = useState([
    {
      inputLabel: "Project",
      list: [{ [mongooseId]: "all", title: "All" }],
      selectedValue: "all",
    },

    {
      inputLabel: "Location",
      list: [{ [mongooseId]: "all", title: "All" }],
      selectedValue: "all",
    },
    {
      inputLabel: "Severity",
      list: [{ [mongooseId]: "all", title: "All", color: Colors?.PRIMARY1 }],
      selectedValue: "all",
    },
    {
      inputLabel: "Likelihood",
      list: [{ [mongooseId]: "all", title: "All", color: Colors?.PRIMARY1 }],
      selectedValue: "all",
    },
  ]);
  const [staticFiltersdata, setStaticFiltersdata] = useState([
    {
      inputLabel: "Created",
      list: ["All", "Today", "This Week", "This Month", "This Year"],
      selectedValue: "All",
    },
    {
      inputLabel: "Type",
      list: ["All", "Safe", "Unsafe", "NCR", "Incident"],
      selectedValue: "All",
    },

    {
      inputLabel: "Status",
      list: ["All", "Open", "Submitted", "In Discussion", "Closed"],
      selectedValue: "All",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.DATE_ON_SINGLE_API_CALL,
  });
  const [next, setNext] = useState(0);

  const dispatch = useDispatch();
  const safetyCards = useSelector((state) => state.safetCard);
  const permissions = useSelector((state) => state.License.permissions);
  const ConfigData = useSelector((state) => state.config);
  const screens = ConfigData?.screens;

  const handleOpenExportMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseExportMenu = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = (item) => {
    const id = "_id";
    setUpdateSafetyCardId(item[id]);
    const temp = {
      title: item?.title ? item?.title : "",
      project: (item.project && { id: item.project[id] || "", title: item.project.title }) || {
        id: "",
        title: "",
      },
      defaultProject: (item.defaultProject && {
        id: item?.defaultProject[id],
        title: item?.defaultProject.title,
      }) || {
        id: "",
        title: "",
      },
      location: (item.location && {
        id: item.location[id] || "",
        title: item.location?.title || "",
      }) || {
        id: "",
        title: "",
      },
      category: (item.category && {
        id: item.category[id] || "",
        title: item?.category?.categoryName,
      }) || {
        id: "",
        title: "",
      },
      severity: (item.severity && {
        id: item.severity[id] || "",
        title: item.severity.title || "",
      }) || {
        id: "",
        title: "",
      },
      likelihood: (item.likelihood && {
        id: item.likelihood[id] || "",
        title: item.likelihood.title,
      }) || {
        id: "",
        title: "",
      },
      type: (item.type && { id: item.type[id] || "", title: item.type.title }) || {
        id: "",
        title: "",
      },
      time: item.time ? item.time : "",
      images: item.images ? item.images : [],
      subject: item.subject ? item.subject : "",
      description: item.description ? item.description : "",
      actionsTaken: item.actionsTaken ? item.actionsTaken : "",
      statusUpdate: item.statusUpdate ? item.statusUpdate : "",
      status: item.status ? item.status : "Open",
      cardType: item?.cardType ? item?.cardType : "",
      dynamicFields: item.dynamicFields ? item.dynamicFields : [],
    };
    setUpdateSafetyCard({ ...temp });
    setOpenEdit(true);
  };

  const handleDeleteOpen = (item) => {
    setDeleteData({
      open: true,
      id: item[Constants.MONGOOSE_ID],
      title: `Delete ${item.cardType.charAt(0)}${item.cardType.slice(1)} card`,
      message: `Are you sure you want to delete this ${item.cardType} card?`,
    });
  };

  const { columns, rows } = authorsTableData(handleEditOpen, handleDeleteOpen);

  const handleFilter = async (dynamicData = dynamicFiltersdata, staticData = staticFiltersdata) => {
    setTablePagination({ ...tablePagination, page: 0 });
    setNext(0);
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      project: dynamicData[0].selectedValue,
      location: dynamicData[1].selectedValue,
      severity: dynamicData[2].selectedValue,
      likelihood: dynamicData[3].selectedValue,
      cardType: staticData[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      created: staticData[0].selectedValue.toLowerCase().replace(/ /g, "_"),
      status: staticData[2].selectedValue.replace(/ /g, "_").toLowerCase(),
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    const res = await dispatch(filterThunk(data));
    await dispatch(updateList(res.payload.data));
  };

  useEffect(() => {
    (async () => {
      handleFilter(dynamicFiltersdata, staticFiltersdata);
      const tempProjectList = await dispatch(projectListThunk());
      const tempLocationList = await dispatch(locationListThunk());
      const tempSeverityList = await dispatch(severityListThunk());
      const tempLikelihoodList = await dispatch(likelihoodThunk());
      const temp = [
        {
          inputLabel: "Project",
          list: [{ [mongooseId]: "all", title: "All" }, ...tempProjectList.payload.data],
          selectedValue: "all",
        },

        {
          inputLabel: "Location",
          list: [
            { [mongooseId]: "all", title: "All" },
            ...tempLocationList.payload.data.filter(
              (item) => item.title !== "" && item.title !== undefined && item.title !== null
            ),
            { [mongooseId]: "otherLocation", title: "Other Location" },
          ],
          selectedValue: "all",
        },
        {
          inputLabel: "Severity",
          list: [
            { [mongooseId]: "all", title: "All", color: Colors?.PRIMARY1 },
            ...tempSeverityList.payload.data,
          ],
          selectedValue: "all",
        },
        {
          inputLabel: "Likelihood",
          list: [
            { [mongooseId]: "all", title: "All", color: Colors?.PRIMARY1 },
            ...tempLikelihoodList.payload.data,
          ],
          selectedValue: "all",
        },
      ];
      setDynamicFiltersdata(temp);
    })();
  }, []);

  useEffect(() => {
    if (!openEdit) {
      setUpdateSafetyCardId("");
      setUpdateSafetyCard({});
    }
  }, [openEdit]);

  const handleDynamicFilter = async (e) => {
    const temp = [...dynamicFiltersdata];
    const index = temp.findIndex((item) => item.inputLabel === e.target.name);
    temp[index].selectedValue = e.target.value;
    setDynamicFiltersdata(temp);
    await handleFilter(temp, staticFiltersdata);
  };

  const handleStaticFilter = async (e) => {
    const temp = [...staticFiltersdata];
    const index = temp.findIndex((item) => item.inputLabel === e.target.name);
    temp[index].selectedValue = e.target.value;
    setStaticFiltersdata(temp);
    await handleFilter(dynamicFiltersdata, temp);
  };

  const handleExport = async (format) => {
    setAnchorEl(null);
    const data = new URLSearchParams({
      project: dynamicFiltersdata[0].selectedValue,
      cardType: staticFiltersdata[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      location: dynamicFiltersdata[1].selectedValue,
      severity: dynamicFiltersdata[2].selectedValue,
      likelihood: dynamicFiltersdata[3].selectedValue,
      created: staticFiltersdata[0].selectedValue.toLowerCase().replace(/ /g, "_"),
      stage: staticFiltersdata[2].selectedValue.toLowerCase().replace(/ /g, "_"),
      format: format === "pdf" ? "pdf" : "excel",
    });
    const currentDate = new Date();

    const filename = `reynard_safety_card_${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.${format}`;

    const res = await dispatch(exportSafetyCardThunk(data));
    const url = window.URL.createObjectURL(res.payload);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleReset = async () => {
    const resetStaticFiltersdata = staticFiltersdata.map((filter) => ({
      ...filter,
      selectedValue: filter.list[0],
    }));
    const resetDynamicFiltersdata = dynamicFiltersdata.map((filter) => ({
      ...filter,
      selectedValue: filter.list[0][mongooseId],
    }));
    setStaticFiltersdata(resetStaticFiltersdata);
    setDynamicFiltersdata(resetDynamicFiltersdata);
    await handleFilter(resetDynamicFiltersdata, resetStaticFiltersdata);
  };

  const handleTablePagination = async () => {
    const data = new URLSearchParams({
      page: next + 1,
      perPage: tablePagination.perPage,
      project: dynamicFiltersdata[0].selectedValue,
      cardType: staticFiltersdata[1].selectedValue.toLowerCase().replace(/ /g, "_"),
      location: dynamicFiltersdata[1].selectedValue,
      severity: dynamicFiltersdata[2].selectedValue,
      likelihood: dynamicFiltersdata[3].selectedValue,
      created: staticFiltersdata[0].selectedValue.toLowerCase().replace(/ /g, "_"),
      stage: staticFiltersdata[2].selectedValue.toLowerCase().replace(/ /g, "_"),
    });
    const res = await dispatch(filterThunk(data));
    await dispatch(loadSafetyCardData(res.payload.data));
    setNext(res.payload.data.length > 0 ? next + 1 : next);
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteSafetyCardThunk(deleteData.id));
    if (res.payload.status === 200) {
      dispatch(
        openSnackbar({
          message: Constants.SAFETY_CARD_DELETE_SUCCESS,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
      await dispatch(removeSafetyCard(deleteData.id));
    } else {
      dispatch(
        openSnackbar({
          message: Constants.SAFETY_CARD_DELETE_ERROR,
          status: Constants.NOTIFICATION_ERROR,
        })
      );
    }
    setDeleteData({ ...deleteData, open: false });
  };

  // Realod Table Data
  const handleReload = async () => {
    await dispatch(reloadData());
    handleFilter();
  };
  const safetyCardArray = [
    {
      title: ButtonTitles.NEW_SAFE,
      permission: LicensePermission.SAFE_CARD,
      icon: Icons.NEW,
      background: Colors.SUCCESS,
      color: Colors.WHITE,
      openModal: setOpenSafeModal,
    },
    {
      title: ButtonTitles.NEW_UNSAFE,
      permission: LicensePermission.UNSAFE_CARD,
      icon: Icons.NEW,
      background: Colors.ERROR,
      color: Colors.WHITE,
      openModal: setOpenUnsafeModal,
    },
    {
      title: ButtonTitles.NEW_NCR,
      permission: LicensePermission.NCR_CARD,
      icon: Icons.NEW,
      background: Colors.PRIMARY,
      color: Colors.WHITE,
      openModal: setOpenNCRModal,
    },
    {
      title: ButtonTitles.NEW_INCIDENT,
      permission: LicensePermission.INCIDENT_CARD,
      icon: Icons.NEW,
      background: Colors.PRIMARY,
      color: Colors.WHITE,
      openModal: setOpenIncidentModal,
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        display="flex"
        flexDirection={{ md: "row", sm: "column" }}
        justifyContent={{ md: "space-between" }}
        alignItems={{ lg: "space-between", sm: "center" }}
      >
        <PageTitle title={PageTitles.SAFETY_CARD} />
        <MDBox mt={{ lg: 0, sm: 2 }} display="flex" flexWrap="wrap">
          {safetyCardArray.map((item) => {
            const permissionExists = permissions.some((per) => per.permission === item.permission);
            const screen = screens.find((screenbutton) =>
              screenbutton.name.includes(item.permission)
            );

            const showButton =
              (screen && screen?.screensInfo.agreement?.create) || permissionExists;

            if (showButton) {
              return (
                <CustomButton
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  background={item.background}
                  color={item.color}
                  openModal={item.openModal}
                />
              );
            }

            return null;
          })}
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
      <Divider sx={{ marginTop: pxToRem(22) }} />
      <MDBox display="flex wrap" justifyContent="space-between" mx={0}>
        {dynamicFiltersdata?.map((val) => (
          <FilterDropdown
            label={val.inputLabel}
            name={val.inputLabel}
            defaultValue={val?.selectedValue}
            value={val?.selectedValue}
            handleChange={handleDynamicFilter}
            menu={val.list}
            key={val.inputLabel}
          />
        ))}
        {staticFiltersdata?.map((val) => (
          <FilterDropdown
            filterKey={val.inputLabel}
            label={val.inputLabel}
            name={val.inputLabel}
            defaultValue={val?.selectedValue}
            value={val?.selectedValue}
            handleChange={handleStaticFilter}
            menu={val.list}
            key={val.inputLabel}
          />
        ))}
        <Button
          sx={{
            mr: 2,
            mt: pxToRem(45),
            ml: 0,
            mb: 0,
            minWidth: 150,
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
            },
            fontSize: pxToRem(14),
            textTransform: "capitalize",
            alignSelf: "flex-end",
          }}
          variant="outlined"
          color="info"
          onClick={handleReset}
          startIcon={Icons.RESET_FILTER}
        >
          {ButtonTitles.RESET_FILTER}
        </Button>
        <Button
          sx={{
            m: 2,
            mt: pxToRem(45),
            ml: 0,
            mb: 0,
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
            },
            fontSize: pxToRem(14),
            textTransform: "capitalize",
            width: pxToRem(130),
          }}
          variant="outlined"
          color="info"
          onClick={handleOpenExportMenu}
          startIcon={Icons.EXPORT}
        >
          {ButtonTitles.EXPORT}
        </Button>
      </MDBox>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseExportMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleExport("xlsx")}>CSV</MenuItem>
        <MenuItem onClick={() => handleExport("pdf")}>PDF</MenuItem>
      </Menu>

      <MDBox mt={3} mb={3}>
        <Card sx={{ boxShadow: "none", height: "auto" }}>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={{ defaultValue: defaultData.PER_PAGE }}
            showTotalEntries={false}
            noEndBorder
            loading={safetyCards.loading}
            licenseRequired
            currentPage={tablePagination.page}
            handleTablePagination={handleTablePagination}
            handleCurrentPage={(page) => setTablePagination({ ...tablePagination, page })}
          />
        </Card>
      </MDBox>

      {/* Safe card Form */}
      {openSafeModal && (
        <SafetyCardForm
          screenIndex={0}
          cardType="Safe"
          openSafetyModal={openSafeModal}
          setOpenSafetyModal={setOpenSafeModal}
          bgColor="#029E3B"
          handleReset={handleReset}
        />
      )}

      {/* Unsafe card Form */}
      {openUnsafeModal && (
        <SafetyCardForm
          screenIndex={1}
          cardType="Unsafe"
          openSafetyModal={openUnsafeModal}
          setOpenSafetyModal={setOpenUnsafeModal}
          bgColor="#9D0202"
          handleReset={handleReset}
        />
      )}

      {/* NCR Card Form */}
      {openNCRModal && (
        <SafetyCardForm
          screenIndex={2}
          cardType="Ncr"
          openSafetyModal={openNCRModal}
          setOpenSafetyModal={setOpenNCRModal}
          bgColor="#191A51"
          handleReset={handleReset}
        />
      )}

      {/* Incident Card Form */}
      {openIncidentModal && (
        <SafetyCardForm
          screenIndex={3}
          cardType="Incident"
          openSafetyModal={openIncidentModal}
          setOpenSafetyModal={setOpenIncidentModal}
          bgColor="#191A51"
          handleReset={handleReset}
        />
      )}

      {/* Update Card Modal */}
      {openEdit && (
        <UpdateSafetyCardForm
          selectedCardId={updateSafetyCardId}
          safetyCardData={updateSafetyCard}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
        />
      )}

      {/* Delete modal for safetry card */}
      {deleteData.open && (
        <DeleteModal
          open={deleteData.open}
          title={deleteData.title}
          message={deleteData.message}
          handleClose={() => setDeleteData({ ...deleteData, open: false })}
          handleDelete={handleDelete}
        />
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
