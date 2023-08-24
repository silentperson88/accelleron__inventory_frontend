/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useEffect, useState } from "react";

import {
  Card,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import "react-datepicker/dist/react-datepicker.css";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import TeamMember from "layouts/dalShiftDetails/data/teamMember";
import Activity from "layouts/dalShiftDetails/data/activityData";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import DataTable from "examples/Tables/DataTable";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NewActivity from "examples/modal/ActivityForm";
import ConfigDropdown from "components/Dropdown/ConfigDropdown";

import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";
import pxToRem from "assets/theme/functions/pxToRem";
import { Feature } from "flagged";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import jwtDecode from "jwt-decode";
import Sessions from "utils/Sessions";
import {
  updateShiftThunk,
  createShiftMemberThunk,
  shiftActivityListThunk,
  deleteShifActivityThunk,
  deleteTeamMemberThunk,
  updateShiftMemberThunk,
  shiftByIdThunk,
} from "redux/Thunks/DalShift";
import {
  memberThunk,
  functionListThunk,
  locationListByIdThunk,
  assetListThunk,
  activityThunk,
} from "redux/Thunks/FieldsData";

// Constant
import Constants, {
  Icons,
  ModalContent,
  PageTitles,
  ButtonTitles,
  Colors,
  CardTitles,
  FeatureTags,
  defaultData,
} from "utils/Constants";
import UserListThunk from "redux/Thunks/UserManagement";
import FTextField from "components/Form/FTextField";

function shiftDetails() {
  const [currentShift, setCurrentShift] = useState({});
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [openEditActivityModal, setOpenEditActivityModal] = useState(false);
  const [updateActivityCardId, setUpdateActivityCardId] = useState("");
  const [updateActivityCard, setUpdateActivityCard] = useState({});
  const [isValidShift, setIsValidShift] = useState(false);
  const [openTeamMember, setOpenTeamMember] = useState({
    open: false,
    title: "Add Member",
    button: "Submit",
    type: "add",
    loading: false,
  });
  const [teamMemberData, setTeamMemberData] = useState({
    memberList: [],
    functionList: [],
    selectedData: {},
    body: {},
    error: {},
  });
  const [activityData, setActivityData] = useState({
    activityList: [],
    selectedData: {},
    body: {},
    error: {},
    locationList: [],
    CabelList: [],
    activitiesList: [],
  });
  const [shiftActivityLoading, setShiftActivityLoading] = useState("pending");
  const [selectedId, setSelectedId] = useState("");
  const [openDeleteTeamMemberModal, setOpenDeleteTeamMemberModal] = useState(false);
  const [openDeleteActivityModal, setOpenDeleteActivityModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const shiftData = useSelector((state) => state?.dalShift);
  const ConfigData = useSelector((state) => state.config);
  const permission = ConfigData?.screens?.[5]?.screensInfo?.agreement;
  const dispatch = useDispatch();
  const mongooseId = "_id";
  const [shiftStatus, setShiftStatus] = useState({
    currentStatus: "Open",
    options: ["Open", "Submitted", "In Discussion", "Closed"],
  });

  const updateShiftList = async () => {
    const res = await dispatch(shiftByIdThunk(id));
    if (res.payload.status !== 200) {
      navigate("/client/shifts");
    }
  };

  useEffect(() => {
    (async () => {
      if (shiftData?.shiftList.length > 0) {
        const i = shiftData?.shiftList.findIndex((item) => item[mongooseId] === id);
        if (i !== -1) {
          setCurrentShift(shiftData.shiftList[i]);
          const tempStatus = shiftData?.shiftList[i]?.status
            .split("_")
            .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`);

          setShiftStatus({
            ...shiftStatus,
            currentStatus: tempStatus.join(" "),
          });
          setIsValidShift(true);
        } else {
          const deocdedToken = jwtDecode(Sessions.userToken);
          navigate(deocdedToken.role !== defaultData.SUPER_ADMIN_ROLE && "/client/shifts");
          setIsValidShift(false);
        }
      } else {
        updateShiftList();
      }
    })();
  }, [shiftData]);

  useEffect(() => {
    const fetchData = async () => {
      let tempMemberList = [];
      let tempFunctionList = [];

      if (currentShift?.projects?.[0].defaultIdentifier === defaultData.DEFAULT_DATA_IDENTIFIER) {
        const paramObject = {
          isActive: true,
        };
        const param = new URLSearchParams(paramObject);
        const [res2, shiftActivityList] = await Promise.all([
          dispatch(UserListThunk(param)),
          dispatch(shiftActivityListThunk(currentShift?.[mongooseId])),
        ]);

        const users = res2.payload.data.data.filter(
          (user) =>
            user.role?.title.toLowerCase() !== defaultData.ADMIN_ROLE &&
            user.role?.title.toLowerCase() !== defaultData.SUPER_ADMIN_ROLE
        );

        tempMemberList = users.map((user) => ({
          [Constants.MONGOOSE_ID]: user[mongooseId],
          title: `${user.firstName} ${user.lastName}`,
        }));

        setActivityData({
          ...activityData,
          activityList: shiftActivityList.payload.data.data,
        });
        setShiftActivityLoading("fullfilled");
      } else {
        const [memberRes, functionRes, locationList, cableList, activitiesList, shiftActivityList] =
          await Promise.all([
            dispatch(memberThunk(currentShift?.projects[0][mongooseId])),
            dispatch(functionListThunk(currentShift?.projects[0][mongooseId])),
            dispatch(locationListByIdThunk(currentShift?.projects[0][mongooseId])),
            dispatch(assetListThunk(currentShift?.projects[0][mongooseId])),
            dispatch(activityThunk(currentShift?.projects[0][mongooseId])),
            dispatch(shiftActivityListThunk(currentShift?.[mongooseId])),
          ]);

        tempMemberList = memberRes.payload.data.map((user) => ({
          [Constants.MONGOOSE_ID]: user[mongooseId],
          title: `${user.user.firstName} ${user.user.lastName}`,
        }));

        tempFunctionList = functionRes.payload.data.map((user) => ({
          [Constants.MONGOOSE_ID]: user[mongooseId],
          title: user.functionName,
        }));

        setActivityData({
          ...activityData,
          activityList: shiftActivityList.payload.data.data,
          locationList: locationList.payload.data,
          cableList: cableList.payload.data,
          activitiesList: activitiesList.payload.data,
        });
        setShiftActivityLoading("fullfilled");
      }

      setTeamMemberData({
        ...teamMemberData,
        memberList: tempMemberList,
        functionList: tempFunctionList,
      });
    };

    if (isValidShift) {
      fetchData();
    }
  }, [isValidShift]);

  const handleOpenTeamMember = (value, type = "new") => {
    if (type === "new") {
      setOpenTeamMember({ open: true, title: "Add Member", button: "Submit", type: "add" });
    } else {
      setTeamMemberData((prevState) => ({
        ...prevState,
        selectedData: value,
      }));
      setOpenTeamMember({ open: true, title: "Update Member", button: "Update", type: "update" });
    }
  };

  const handleCloseTeamMember = () => {
    setOpenTeamMember({ ...openTeamMember, open: false });
    setTeamMemberData((prevData) => ({
      ...prevData,
      selectedData: {},
      body: {},
      error: {},
    }));
  };

  const handleCloseDeleteTeamMemberModal = () => setOpenDeleteTeamMemberModal(false);
  const handleCloseDeleteActivityModal = () => setOpenDeleteActivityModal(false);

  const handleOpenDeleteTeamMember = (memberId) => {
    setSelectedId(memberId);
    setOpenDeleteTeamMemberModal(true);
  };
  const handleOpenDeleteActivity = (activityId) => {
    setSelectedId(activityId);
    setOpenDeleteActivityModal(true);
  };

  const calculateDuration = (timeArray) => {
    if (timeArray.length <= 1) {
      return [0, 0]; // Base case: return 0 when there is only one or zero elements in the array
    }

    const startTime = moment(timeArray[0]);
    const endTime = moment(timeArray[1]);
    const duration = moment.duration(endTime.diff(startTime));

    const remainingTime = calculateDuration(timeArray.slice(1));
    const hours = Math.floor(duration.asHours()) + remainingTime[0];
    const minutes = Math.floor(duration.asMinutes() % 60) + remainingTime[1];

    const adjustedHours = hours + Math.floor(minutes / 60);
    const adjustedMinutes = minutes % 60;

    return [adjustedHours, adjustedMinutes];
  };

  const handleDuration = (timeArray) => {
    const duration = calculateDuration(timeArray);
    return `${duration[0]}hrs ${duration[1]}min`;
  };

  const { teamMemberColumn, teamMemberRow } = TeamMember(
    handleOpenTeamMember,
    handleOpenDeleteTeamMember,
    currentShift
  );

  const handleOpenEditActivty = (item) => {
    const aid = "_id";
    setUpdateActivityCardId(item[aid]);
    if (currentShift?.projects?.[0].defaultIdentifier === defaultData.DEFAULT_DATA_IDENTIFIER) {
      const temp = {
        activity: item?.activity ? item?.activity?.name : "",
        location: item?.location ? item?.location?.title : "",
        cable: item?.cable ? item?.cable?.cableName : "",
        endTime: item?.endTime ? item?.endTime : "",
        comments: item?.comments ? item?.comments : "",
      };
      setUpdateActivityCard({ ...temp });
    } else {
      const temp = {
        activity: (item?.activity && {
          id: item?.activity?.[Constants.MONGOOSE_ID],
          title: item?.activity?.name,
        }) || {
          id: "",
          title: "",
        },
        location: (item?.location && {
          id: item?.location?.[Constants.MONGOOSE_ID],
          title: item?.location?.title,
        }) || { id: "", title: "" },
        cable: (item?.cable && {
          id: item?.cable?.[Constants.MONGOOSE_ID],
          title: item?.cable?.cableName,
        }) || { id: "", title: "" },
        endTime: item?.endTime ? item?.endTime : "",
        comments: item?.comments ? item?.comments : "",
      };
      setUpdateActivityCard({ ...temp });
    }
    setOpenEditActivityModal(true);
  };
  const { activityColumns, activityRows } = Activity(
    handleOpenDeleteActivity,
    activityData.activityList,
    handleOpenEditActivty,
    currentShift?.startDate,
    handleDuration
  );

  const handleDeleteTeamMember = async () => {
    const res = await dispatch(deleteTeamMemberThunk(selectedId));
    if (res.payload.status === 200) {
      await dispatch(
        openSnackbar({ message: Constants.MEMBER_DELETE_SUCCESS, notificationType: "success" })
      );
      updateShiftList();
    } else {
      await dispatch(
        openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
      );
    }
    setOpenDeleteTeamMemberModal(false);
  };
  const handleDeleteActivity = async () => {
    const res = await dispatch(deleteShifActivityThunk(selectedId));
    if (res.payload.status === 200) {
      await dispatch(
        openSnackbar({ message: Constants.ACTIVITY_DELETE_SUCCESS, notificationType: "success" })
      );
      const res2 = await dispatch(shiftActivityListThunk(currentShift[mongooseId]));
      setActivityData({ ...activityData, activityList: res2.payload.data.data });
    } else {
      await dispatch(
        openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
      );
    }
    setOpenDeleteActivityModal(false);
  };

  const handleteamMemberChange = (name, value) => {
    setTeamMemberData((prevState) => ({
      ...prevState,
      body: { ...prevState.body, [name]: value },
    }));
  };

  const handleShiftStatus = async (e) => {
    const newStatus = e.target.value;
    const data = {
      shiftId: currentShift[mongooseId],
      body: {
        status: newStatus.replace(" ", "_").toLowerCase(),
      },
    };
    const res = await dispatch(updateShiftThunk(data));
    if (res.payload.status === 200) {
      const tempStatus = newStatus.replace("_", " ");
      setShiftStatus({
        ...shiftStatus,
        currentStatus: tempStatus,
      });
      updateShiftList();
      await dispatch(
        openSnackbar({ message: Constants.STATUS_UPDATE_SUCCESS, notificationType: "success" })
      );
    }
  };
  const teamMemberValidation = () => {
    const { body } = teamMemberData;
    const error = {};

    if (!body?.member) {
      error.member = "Member is required";
    }
    if (!body?.function) {
      error.function = "Function is required";
    }

    const isValid = Object.keys(error).length === 0;
    setTeamMemberData({ ...teamMemberData, error });
    return isValid;
  };
  const memberUpdateValidation = () => {
    const { body } = teamMemberData;
    const error = {};
    Object.keys(body).forEach((key) => {
      if (body[key] === "") {
        error[key] = "Required";
      }
    });
    const isValid = Object.keys(error).length === 0;
    setTeamMemberData({ ...teamMemberData, error });
    return isValid;
  };
  const handleAddTeamMember = async () => {
    setOpenTeamMember({ ...openTeamMember, loading: true });
    const isValid = teamMemberValidation();
    if (isValid) {
      const body = { ...teamMemberData.body, shift: currentShift[mongooseId] };
      const res = await dispatch(createShiftMemberThunk(body));
      if (res.payload.status === 200) {
        updateShiftList();
        await dispatch(
          openSnackbar({ message: Constants.MEMBER_ADD_SUCCESS, notificationType: "success" })
        );
      } else {
        dispatch(
          openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
        );
      }
      setOpenTeamMember({ ...openTeamMember, open: false, loading: false });
      setTeamMemberData((prev) => ({ ...prev, errors: {}, body: {} }));
    } else {
      setOpenTeamMember({ ...openTeamMember, loading: false });
    }
  };
  const handleUpdateTeamMember = async () => {
    setOpenTeamMember({ ...openTeamMember, loading: true });
    const isValid = memberUpdateValidation();
    if (isValid) {
      const body = {
        body: { ...teamMemberData.body },
        memberId: teamMemberData.selectedData[mongooseId],
      };
      const res = await dispatch(updateShiftMemberThunk(body));
      if (res.payload.status === 200) {
        updateShiftList();
        await dispatch(
          openSnackbar({ message: Constants.MEMBER_UPDATE_SUCCESS, notificationType: "success" })
        );
      } else {
        dispatch(
          openSnackbar({ message: Constants.SOMETHING_WENT_WRONG, notificationType: "error" })
        );
      }
      setOpenTeamMember({ ...openTeamMember, open: false, loading: false });
      setTeamMemberData({
        ...teamMemberData,
        body: {},
        error: {},
      });
    } else {
      setOpenTeamMember({ ...openTeamMember, loading: false });
    }
  };

  const dropdownIcon = () => <KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />;

  const handleReload = async () => {
    setShiftActivityLoading("pending");
    await dispatch(shiftActivityListThunk(currentShift?.[mongooseId]));
    setShiftActivityLoading("fullfilled");
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageTitle title={PageTitles.SHIFT_DETAILS} />

      <Feature name={FeatureTags.SHIFT_DETAILS}>
        {isValidShift ? (
          <>
            {/* Shift detail Card and team Member */}
            <Card id="delete-account" sx={{ mt: 3, px: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MDBox mb={2}>
                    <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography p={pxToRem(7)} variant="h6" fontWeight="medium">
                        {CardTitles.SHIFT}
                      </MDTypography>
                    </MDBox>
                    <MDBox
                      borderRadius="lg"
                      alignItems="center"
                      sx={{
                        border: ({ borders: { borderWidth, borderColor } }) =>
                          `${borderWidth[1]} solid ${borderColor}`,
                      }}
                    >
                      <MDBox
                        borderRadius="lg"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          py: pxToRem(10),
                          px: pxToRem(24),
                          height: pxToRem(55),
                          borderBottomRightRadius: 0,
                          borderBottomLeftRadius: 0,
                          background: Colors.PRIMARY,
                          color: Colors.WHITE,
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="medium" color="white">
                          {CardTitles.SHIFT_OVERVIEW}
                        </MDTypography>
                      </MDBox>
                      <MDBox
                        borderRadius="lg"
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                        sx={{
                          py: pxToRem(4),
                          px: pxToRem(24),
                          height: pxToRem(49),
                          borderBottom: "0.0625rem solid #E0E6F5",
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="medium" width="60%">
                          Project
                        </MDTypography>
                        <MDBox
                          color="secondary"
                          sx={{
                            fontSize: pxToRem(14),
                            fontWeight: 400,
                            textTransform: "capitalize",
                          }}
                        >
                          {currentShift?.projects?.[0].defaultIdentifier ===
                          defaultData.DEFAULT_DATA_IDENTIFIER
                            ? `${currentShift?.defaultProject?.title} (${currentShift?.projects[0].title})`
                            : currentShift?.projects[0].title}
                        </MDBox>
                      </MDBox>
                      <MDBox
                        borderRadius="lg"
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                        sx={{
                          py: pxToRem(4),
                          px: pxToRem(24),
                          height: pxToRem(49),
                          borderBottom: "0.0625rem solid #E0E6F5",
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="medium" width="60%">
                          Team
                        </MDTypography>
                        <MDBox
                          lineHeight={1}
                          color="secondary"
                          sx={{
                            fontSize: pxToRem(14),
                            fontWeight: 400,
                            textTransform: "capitalize",
                          }}
                        >
                          {currentShift?.teams[0]?.teamsWfmName}
                        </MDBox>
                      </MDBox>
                      <MDBox
                        borderRadius="lg"
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                        sx={{
                          py: pxToRem(4),
                          px: pxToRem(24),
                          height: pxToRem(49),
                          borderBottom: "0.0625rem solid #E0E6F5",
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="medium" width="60%">
                          Start Time
                        </MDTypography>
                        <MDBox
                          lineHeight={1}
                          color="secondary"
                          sx={{ fontSize: pxToRem(14), fontWeight: 400 }}
                        >
                          {moment(currentShift?.startDate).format(defaultData.WEB_24_HOURS_FORMAT)}
                        </MDBox>
                      </MDBox>
                      <MDBox
                        borderRadius="lg"
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                        sx={{
                          py: pxToRem(4),
                          px: pxToRem(24),
                          height: pxToRem(49),
                          borderBottom: "0.0625rem solid #E0E6F5",
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="medium" width="60%">
                          Shift duration(hours)
                        </MDTypography>
                        <MDBox
                          lineHeight={1}
                          color="secondary"
                          sx={{ fontSize: pxToRem(14), fontWeight: 400 }}
                        >
                          {`${handleDuration([
                            currentShift?.startDate?.split(".")[0],
                            ...activityData.activityList.map(
                              (item) => item?.endTime?.split(".")[0]
                            ),
                          ])}`}
                        </MDBox>
                      </MDBox>
                      <MDBox
                        borderRadius="lg"
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                        sx={{
                          py: pxToRem(4),
                          px: pxToRem(24),
                          height: pxToRem(70),
                          borderBottom: "0.0625rem solid #E0E6F5",
                        }}
                      >
                        <MDTypography variant="h6" fontWeight="medium" width="60%">
                          Status
                        </MDTypography>
                        <MDBox
                          lineHeight={1}
                          color="secondary"
                          sx={{ fontSize: pxToRem(14), fontWeight: 400 }}
                        >
                          <FormControl sx={{ minWidth: 100 }} size="small">
                            <Select
                              displayEmpty
                              disabled={!permission?.update}
                              labelId="demo-select-small"
                              id="demo-select-small"
                              name="Select Status"
                              sx={{ height: 40, textTransform: "capitalize" }}
                              value={shiftStatus?.currentStatus}
                              onChange={handleShiftStatus}
                              IconComponent={dropdownIcon}
                            >
                              {shiftStatus.options.map((item) => (
                                <MenuItem
                                  key={item}
                                  value={item}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Team member table */}
                  <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography variant="h6" fontWeight="medium">
                      {CardTitles.TEAM_MEMBERS}
                    </MDTypography>
                    <MDBox display="flex" flexDirection="row">
                      <CustomButton
                        title={ButtonTitles.NEW_MEMBER}
                        icon={Icons.NEW}
                        background={Colors.PRIMARY}
                        color={Colors.WHITE}
                        openModal={handleOpenTeamMember}
                      />
                    </MDBox>
                  </MDBox>
                  <MDBox>
                    <Grid item xs={12}>
                      <MDBox>
                        <DataTable
                          table={{ columns: teamMemberColumn, rows: teamMemberRow }}
                          isSorted={false}
                          entriesPerPage={{ defaultValue: 5 }}
                          showTotalEntries={false}
                          noEndBorder
                          loading={shiftData.loading}
                          licenseRequired
                        />
                      </MDBox>
                    </Grid>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>

            {/* Activity  table */}
            <Card id="delete-account" sx={{ mt: 3, px: 2, py: 2 }}>
              <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  {CardTitles.ACTIVITY}
                </MDTypography>
                <MDBox display="flex" flexDirection="row">
                  {permission?.create && (
                    <CustomButton
                      title="Activity"
                      icon="add_circle_outline"
                      background="#191A51"
                      color="#ffffff"
                      openModal={setOpenActivityModal}
                    />
                  )}
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
              <MDBox mt={1}>
                <Grid item xs={12}>
                  <Card>
                    <MDBox>
                      <DataTable
                        table={{ columns: activityColumns, rows: activityRows }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                        loading={shiftActivityLoading}
                        licenseRequired
                      />
                    </MDBox>
                  </Card>
                </Grid>
              </MDBox>
            </Card>

            {/* Team member */}
            <BasicModal
              minWidth={600}
              open={openTeamMember.open}
              handleClose={handleCloseTeamMember}
              title={openTeamMember.title}
              actionButton={
                (openTeamMember.type === "add" && !openTeamMember.loading && ButtonTitles.SUBMIT) ||
                (openTeamMember.type === "add" &&
                  openTeamMember.loading &&
                  ButtonTitles.SUBMIT_LOADING) ||
                (openTeamMember.type === "update" &&
                  !openTeamMember.loading &&
                  ButtonTitles.UPDATE) ||
                (openTeamMember.type === "update" &&
                  openTeamMember.loading &&
                  ButtonTitles.UPDATE_LOADING)
              }
              handleAction={
                openTeamMember.type === "add" ? handleAddTeamMember : handleUpdateTeamMember
              }
            >
              <ConfigDropdown
                label="Member*"
                name="member"
                id="member"
                defaultValue={
                  (openTeamMember.type === "update" &&
                    (currentShift?.projects?.[0].defaultIdentifier ===
                    defaultData.DEFAULT_DATA_IDENTIFIER
                      ? teamMemberData.selectedData?.members?.user
                      : teamMemberData.selectedData?.members?.users.fullName || "")) ||
                  ""
                }
                handleChange={handleteamMemberChange}
                menu={teamMemberData.memberList}
                error={Boolean(teamMemberData.error?.member)}
                helperText={teamMemberData.error?.member}
                minWidth={pxToRem(550)}
              />
              <MDBox sx={{ mt: 2 }}>
                {currentShift?.projects?.[0].defaultIdentifier ===
                defaultData.DEFAULT_DATA_IDENTIFIER ? (
                  <FTextField
                    label="Functions*"
                    placeholder="Enter Functions"
                    name="function"
                    id="function"
                    type="text"
                    error={Boolean(teamMemberData.error?.function)}
                    helperText={teamMemberData.error?.function}
                    value={
                      (openTeamMember.type !== "update" && teamMemberData.body?.function) ||
                      (openTeamMember.type === "update" &&
                        (teamMemberData.body.function ??
                          teamMemberData.selectedData?.members?.functions?.functionName)) ||
                      ""
                    }
                    handleChange={(e) => handleteamMemberChange("function", e.target.value)}
                  />
                ) : (
                  <ConfigDropdown
                    label="Functions*"
                    name="function"
                    id="function"
                    defaultValue={
                      openTeamMember.type === "update"
                        ? teamMemberData.selectedData?.members?.functions?.functionName
                        : ""
                    }
                    handleChange={handleteamMemberChange}
                    menu={teamMemberData.functionList}
                    error={Boolean(teamMemberData.error?.function)}
                    helperText={teamMemberData.error?.function}
                    minWidth={pxToRem(550)}
                  />
                )}
              </MDBox>
            </BasicModal>

            {/* Delete modal for Team member */}
            <DeleteModal
              open={openDeleteTeamMemberModal}
              title={ModalContent.SHIFT_DETAILS_MEMBER_DELETE_TITLE}
              message="Are you sure you want to delete this member?"
              handleClose={handleCloseDeleteTeamMemberModal}
              handleDelete={handleDeleteTeamMember}
            />

            {/* Delete modal for activity */}
            <DeleteModal
              open={openDeleteActivityModal}
              title="Delete Activity from the Shift"
              message="Are you sure you want to delete this Activity?"
              handleClose={handleCloseDeleteActivityModal}
              handleDelete={handleDeleteActivity}
            />

            {/* Add modal for activity */}
            <NewActivity
              title="New Activity"
              open={openActivityModal}
              setOpen={setOpenActivityModal}
              currentShift={currentShift}
              setActivityDatas={setActivityData}
              isDefaultShift={
                currentShift?.projects?.[0].defaultIdentifier ===
                defaultData.DEFAULT_DATA_IDENTIFIER
              }
            />

            {/* Update modal for activity */}
            <NewActivity
              title="Update Activity"
              open={openEditActivityModal}
              setOpen={setOpenEditActivityModal}
              currentShift={currentShift}
              selectedCardId={updateActivityCardId}
              activityCardData={updateActivityCard}
              setActivityDatas={setActivityData}
              isDefaultShift={
                currentShift?.projects?.[0].defaultIdentifier ===
                defaultData.DEFAULT_DATA_IDENTIFIER
              }
            />
          </>
        ) : (
          <MDBox py={5} display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress color="info" />
          </MDBox>
        )}
      </Feature>
    </DashboardLayout>
  );
}

export default shiftDetails;
