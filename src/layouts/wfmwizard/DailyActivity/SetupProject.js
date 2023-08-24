import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import {
  MenuItem,
  FormControl,
  Select,
  Grid,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import NewProject from "examples/modal/NewProject/NewProject";
import ViewProject from "examples/modal/ViewProject/ViewProject";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import MDTypography from "components/MDTypography";
import Projects from "layouts/wfmwizard/DailyActivity/ProjectTableData/Project";
import Locationdata from "layouts/wfmwizard/DailyActivity/ProjectTableData/Locationdata";
import Teamdata from "layouts/wfmwizard/DailyActivity/ProjectTableData/Teams";
import Activities from "layouts/wfmwizard/DailyActivity/ProjectTableData/Activities";
import Asset from "layouts/wfmwizard/DailyActivity/ProjectTableData/Asset";
import Functions from "layouts/wfmwizard/DailyActivity/ProjectTableData/Functions";
import ReportType from "layouts/wfmwizard/DailyActivity/ProjectTableData/ReportType";
import ProjectString from "layouts/wfmwizard/DailyActivity/ProjectTableData/ProjectStringData";
import Scopes from "layouts/wfmwizard/DailyActivity/ProjectTableData/Scopes";
import Members from "layouts/wfmwizard/DailyActivity/ProjectTableData/Members";
import DeleteModal from "examples/modal/deleteModal/deleteModal";
import { useDispatch } from "react-redux";
import projectCreateThunk, {
  projectListThunk,
  locationCreateThunk,
  locationListByIdThunk,
  projectStringCreateThunk,
  projectStringListThunk,
  assetCreateThunk,
  assetListThunk,
  scopesCreateThunk,
  scopesThunk,
  activityCreateThunk,
  activityThunk,
  teamCreateThunk,
  memberCreateThunk,
  teamThunk,
  memberThunk,
  functionCreateThunk,
  functionListThunk,
  reportTypesList,
  projectsUpdateThunk,
  locationsUpdateThunk,
  projectStringsUpdateThunk,
  assetsUpdateThunk,
  scopesUpdateThunk,
  activitiesUpdateThunk,
  teamUpdateThunk,
  membersUpdateThunk,
  functionUpdateThunk,
  projectsDeleteThunk,
  locationsDeleteThunk,
  projectStringsDeleteThunk,
  assetsDeleteThunk,
  scopesDeleteThunk,
  activitiesDeleteThunk,
  teamsDeleteThunk,
  membersDeleteThunk,
  functionDeleteThunk,
} from "redux/Thunks/FieldsData";
import { openSnackbar } from "redux/Slice/Notification";
import UserListThunk from "redux/Thunks/UserManagement";
import Validators from "utils/Validations";
import Constants, { CustomComponents, defaultData, Colors } from "utils/Constants";
import { useNavigate } from "react-router-dom";
import pxToRem from "assets/theme/functions/pxToRem";
import configThunk from "redux/Thunks/Config";
import MDInput from "components/MDInput";
import FDropdown2 from "components/Dropdown/fDropdown2";

const cardList = [
  {
    cardTitle: "Location",
    content:
      "Create or Change Locations. A Location is a physical structure that is part of a string.",
    isVisible: true,
  },
  {
    cardTitle: "Project String",
    content: "Create or Change Strings. A String consists of one or more Locations and Cables.",
    isVisible: true,
  },
  {
    cardTitle: "Asset",
    content:
      "Create or Change Assets. An Asset connects locations, optionally as part of a string.",
    isVisible: true,
  },
  {
    cardTitle: "Team",
    content: "Create or Change Teams. A Team is assigned to a Project and consists of Members.",
    isVisible: true,
  },
  {
    cardTitle: "Scopes",
    content: "Create or Change Locations. A Scope consists of one or more activities.",
    isVisible: true,
  },
  {
    cardTitle: "Activity",
    content: "Create or Change Activities. A Activity is assigned to a Scope and Project.",
    isVisible: true,
  },
  {
    cardTitle: "Functions",
    content: "Add or Update Project Functions",
    isVisible: true,
  },
  {
    cardTitle: "Member",
    content: "Add or Update Members. A Project can have more than one Member.",
    isVisible: true,
  },
  {
    cardTitle: "Report Type",
    content: "Add or Update Report Type. A Report Type is assigned to a Project.",
    isVisible: false,
  },
];

function SetupProject() {
  const [userList, setUserList] = useState([]);
  const [lists, setLists] = useState({
    project: [],
    location: [],
    projectString: [],
    asset: [],
    scope: [],
    activity: [],
    team: [],
    member: [],
    function: [],
    reportType: [],
  });
  const [dropdownData, setDropdownData] = useState({
    project: [],
    location: [],
    projectString: [],
    asset: [],
    scope: [],
    activity: [],
    team: [],
    member: [],
    function: [],
    reportType: [],
  });
  const [loadingStatus, setLaodingStatus] = useState({
    project: "pending",
    location: "pending",
    projectString: "pending",
    asset: "pending",
    scope: "pending",
    activity: "pending",
    team: "pending",
    member: "pending",
    function: "pending",
  });
  const [editLists, setEditLists] = useState({
    project: {},
    location: {},
    projectString: {},
    asset: {},
    scope: {},
    activity: {},
    team: {},
    member: {},
    function: {},
    reportType: {},
  });
  const [body, setBody] = useState({
    project: {},
    location: {},
    projectString: {},
    asset: {},
    scope: {},
    activity: {},
    team: {},
    member: {},
    function: {},
    reportType: {},
  });
  const [error, setError] = useState({
    project: {},
    location: {},
    projectString: {},
    asset: {},
    scope: {},
    activity: {},
    team: {},
    member: {},
    function: {},
    reportType: {},
  });
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: defaultData.PER_PAGE,
  });
  const [deleteData, setDeleteData] = useState({ openDeleteModal: false, type: "", id: "" });
  const [selectedProjectId, setSelectedProjectid] = useState("");
  const [openProjectList, setOpenProjectList] = useState(false);
  const [modalType, setModalType] = useState("New");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const mongooseId = "_id";
  const navigate = useNavigate();

  const handleProjectChange = (e) => setSelectedProjectid(e.target.value);
  const handleOpenProjectList = () => setOpenProjectList(true);
  const handleCloseProjectList = () => setOpenProjectList(false);

  const [openNewModal, setOpenNewModal] = useState(false);
  const [openlocation, setOpenLocation] = useState(false);
  const [openString, setOpenString] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [openScopes, setOpenScopes] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openFunction, setOpenFunction] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleOpenNewModal = (modal) => {
    if (modal === "Project") {
      setOpenNewModal(true);
    } else if (modal === "Location") {
      setOpenLocation(true);
    } else if (modal === "Project String") {
      setOpenString(true);
    } else if (modal === "Asset") {
      setOpenAsset(true);
    } else if (modal === "Scopes") {
      setOpenScopes(true);
    } else if (modal === "Activity") {
      setOpenActivity(true);
    } else if (modal === "Member") {
      setOpenMember(true);
    } else if (modal === "Team") {
      setOpenTeam(true);
    } else if (modal === "Functions") {
      setOpenFunction(true);
    } else if (modal === "Report Type") {
      navigate("/client/setting/report-type", { state: { openNewReportType: true } });
    }
  };

  const handleCloseNewModal = (modal) => {
    if (modal === "Project") {
      setOpenNewModal(false);
    } else if (modal === "Location") {
      setOpenLocation(false);
    } else if (modal === "ProjectString") {
      setOpenString(false);
    } else if (modal === "Asset") {
      setOpenAsset(false);
    } else if (modal === "Scope") {
      setOpenScopes(false);
    } else if (modal === "Activity") {
      setOpenActivity(false);
    } else if (modal === "Member") {
      setOpenMember(false);
    } else if (modal === "Team") {
      setOpenTeam(false);
    } else if (modal === "Function") {
      setOpenFunction(false);
    }
    setModalType("New");
    const tempBody = { ...body };
    Object.keys(tempBody).forEach((key) => {
      tempBody[key] = {};
    });
    setBody(tempBody);
    setError(tempBody);
  };
  const handleCloseDeleteModal = () => setDeleteData({ openDeleteModal: false, type: "", id: "" });
  const handleDelete = (type, id) => setDeleteData({ openDeleteModal: true, type, id });

  const handleOpenDeleteModal = async () => {
    const { type, id } = deleteData;
    if (type === "Project") {
      const res = await dispatch(projectsDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newProjectList = await dispatch(projectListThunk());
      setLists({
        ...lists,
        project: newProjectList.payload.data,
      });
    } else if (type === "Location") {
      const res = await dispatch(locationsDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newLocationList = await dispatch(locationListByIdThunk(selectedProjectId));
      setLists({
        ...lists,
        location: newLocationList.payload.data,
      });
    } else if (type === "ProjectString") {
      const res = await dispatch(projectStringsDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newProjectStringList = await dispatch(projectStringListThunk(selectedProjectId));
      setLists({
        ...lists,
        projectString: newProjectStringList.payload.data,
      });
    } else if (type === "Asset") {
      const res = await dispatch(assetsDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newAssetList = await dispatch(assetListThunk(selectedProjectId));
      setLists({
        ...lists,
        asset: newAssetList.payload.data,
      });
    } else if (type === "Scope") {
      const res = await dispatch(scopesDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newScopeList = await dispatch(scopesThunk(selectedProjectId));
      setLists({
        ...lists,
        scope: newScopeList.payload.data,
      });
    } else if (type === "Activity") {
      const res = await dispatch(activitiesDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newActivityList = await dispatch(activityThunk(selectedProjectId));
      setLists({
        ...lists,
        activity: newActivityList.payload.data,
      });
    } else if (type === "Team") {
      const res = await dispatch(teamsDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newTeamList = await dispatch(teamThunk(selectedProjectId));
      setLists({
        ...lists,
        team: newTeamList.payload.data,
      });
    } else if (type === "Member") {
      const res = await dispatch(membersDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      setRefresh(!refresh);
    } else {
      const res = await dispatch(functionDeleteThunk(id));
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      setRefresh(!refresh);
    }
    setTablePagination({ ...tablePagination, page: tablePagination.page + 1 });
    handleCloseDeleteModal();
    await dispatch(configThunk());
  };

  // Data table for all cards
  const { projectColumns, projectRows } = Projects(
    lists.project,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { locationColumns, locationRows } = Locationdata(
    lists.location,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { ProjectStringColumns, ProjectStringRows } = ProjectString(
    lists.projectString,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { AssetColumns, AssetRows } = Asset(
    lists.asset,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { teamColumns, teamRows } = Teamdata(
    lists.team,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { membersColumns, membersRows } = Members(
    lists.member,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { ScopesColumns, ScopesRows } = Scopes(
    lists.scope,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { ActivitiesColumns, ActivitiesRows } = Activities(
    lists.activity,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );
  const { FunctionsColumns, FunctionsRows } = Functions(
    lists.function,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );

  const { reportTypeColumns, reportTypeRows } = ReportType(
    lists.reportType,
    handleOpenNewModal,
    setModalType,
    editLists,
    setEditLists,
    handleDelete
  );

  const [openLocationData, setOpenLocationData] = useState(false);
  const handleCloseLocationData = () => setOpenLocationData(false);

  const [openProjectStringData, setOpenProjectStringData] = useState(false);
  const handleCloseProjectStringData = () => setOpenProjectStringData(false);

  const [openAssetData, setOpenAssetData] = useState(false);
  const handleCloseAssetData = () => setOpenAssetData(false);

  const [openTeamsData, setOpenTeamsData] = useState(false);
  const handleCloseTeamsData = () => setOpenTeamsData(false);

  const [openMemberData, setOpenMemberData] = useState(false);
  const handleCloseMemberData = () => setOpenMemberData(false);

  const [openScopesData, setOpenScopesData] = useState(false);
  const handleCloseScopesData = () => setOpenScopesData(false);

  const [openActivitiesData, setOpenActivitiesData] = useState(false);
  const handleCloseActivitiesData = () => setOpenActivitiesData(false);

  const [openFunctionsData, setOpenFunctionsData] = useState(false);
  const handleCloseFunctionsData = () => setOpenFunctionsData(false);

  const [openReportTypeData, setOpenReportTypeData] = useState(false);
  const handleCloseReportTypeData = () => setOpenReportTypeData(false);

  const handleOpenProjectModal = (modal) => {
    if (modal === "Location") {
      setOpenLocationData(true);
    } else if (modal === "Project String") {
      setOpenProjectStringData(true);
    } else if (modal === "Asset") {
      setOpenAssetData(true);
    } else if (modal === "Team") {
      setOpenTeamsData(true);
    } else if (modal === "Member") {
      setOpenMemberData(true);
    } else if (modal === "Scopes") {
      setOpenScopesData(true);
    } else if (modal === "Activity") {
      setOpenActivitiesData(true);
    } else if (modal === "Functions") {
      setOpenFunctionsData(true);
    } else if (modal === "Report Type") {
      setOpenReportTypeData(true);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await dispatch(projectListThunk());
      setLists({ ...lists, project: res.payload.data });
      setLaodingStatus({ ...loadingStatus, project: "fullfilled" });
      const res2 = await dispatch(UserListThunk());
      const users = res2.payload.data.data.filter(
        (user) =>
          user.role?.title !== defaultData.ADMIN_ROLE &&
          user.role?.title !== defaultData.SUPER_ADMIN_ROLE
      );
      setUserList(users);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedProjectId !== "") {
        const paramData = {
          project: selectedProjectId,
        };
        Object.keys(paramData).forEach((key) => {
          if (paramData[key] === "") {
            delete paramData[key];
          }
        });

        const data = new URLSearchParams(paramData);
        const [
          locationRes,
          projectStringRes,
          assetRes,
          scopeRes,
          activityRes,
          teamRes,
          memberRes,
          functionRes,
          reportTypeRes,
        ] = await Promise.all([
          dispatch(locationListByIdThunk(selectedProjectId)),
          dispatch(projectStringListThunk(selectedProjectId)),
          dispatch(assetListThunk(selectedProjectId)),
          dispatch(scopesThunk(selectedProjectId)),
          dispatch(activityThunk(selectedProjectId)),
          dispatch(teamThunk(selectedProjectId)),
          dispatch(memberThunk(selectedProjectId)),
          dispatch(functionListThunk(selectedProjectId)),
          dispatch(reportTypesList(data)),
        ]);
        const dropdownFormat = {
          [Constants.MONGOOSE_ID]: "",
          title: "",
        };
        const tempMember = userList
          .filter(
            (element) => element.role?.title !== "Admin" && element.role?.title !== "superadmin"
          )
          .map((item) => {
            const temp = { ...dropdownFormat };
            temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
            temp.title = `${item?.firstName} ${item?.lastName}`;
            return temp;
          });
        const tempFunction = functionRes.payload.data.map((item) => {
          const temp = { ...dropdownFormat };
          temp[Constants.MONGOOSE_ID] = item?.[Constants.MONGOOSE_ID];
          temp.title = item.functionName;
          return temp;
        });
        setDropdownData({
          ...dropdownData,
          function: tempFunction,
          member: tempMember,
        });
        setLists({
          ...lists,
          location: locationRes.payload.data,
          projectString: projectStringRes.payload.data,
          asset: assetRes.payload.data,
          scope: scopeRes.payload.data,
          activity: activityRes.payload.data,
          team: teamRes.payload.data,
          member: memberRes.payload.data,
          function: functionRes.payload.data,
          reportType: reportTypeRes.payload.data,
        });
        setLaodingStatus({
          ...loadingStatus,
          location: "fullfilled",
          projectString: "fullfilled",
          asset: "fullfilled",
          scope: "fullfilled",
          activity: "fullfilled",
          team: "fullfilled",
          member: "fullfilled",
          function: "fullfilled",
          reportType: "fullfilled",
        });
      }
    })();
  }, [selectedProjectId, refresh]);

  useEffect(() => {
    const updatedBody = { ...body };

    if (Object.keys(editLists.project).length !== 0 && editLists.project.constructor === Object) {
      updatedBody.project = {
        title: editLists.project.title,
        isActive: editLists.project.isActive,
      };
    }
    if (Object.keys(editLists.location).length !== 0 && editLists.location.constructor === Object) {
      updatedBody.location = {
        title: editLists.location.title,
      };
    }
    if (
      Object.keys(editLists.projectString).length !== 0 &&
      editLists.projectString.constructor === Object
    ) {
      updatedBody.projectString = {
        name: editLists.projectString.name,
        fromLocation: editLists.projectString?.fromLocation[Constants.MONGOOSE_ID],
        toLocation: editLists.projectString.toLocation[Constants.MONGOOSE_ID],
      };
    }
    if (Object.keys(editLists.asset).length !== 0 && editLists.asset.constructor === Object) {
      updatedBody.asset = {
        cableName: editLists?.asset?.cableName,
        fromLocation: editLists?.asset?.fromLocation?.[Constants.MONGOOSE_ID],
        toLocation: editLists?.asset?.toLocation?.[Constants.MONGOOSE_ID],
        manufacture: editLists?.asset?.manufacture,
        typeMm2: editLists?.asset?.typeMm2,
        string: editLists?.asset?.string?.[Constants.MONGOOSE_ID],
      };
    }
    if (Object.keys(editLists.scope).length !== 0 && editLists.scope.constructor === Object) {
      updatedBody.scope = {
        name: editLists.scope.name,
        isDoable: editLists.scope.isDoable,
        normDuration: editLists.scope.normDuration,
        sortOrder: editLists.scope.sortOrder,
      };
    }
    if (Object.keys(editLists.activity).length !== 0 && editLists.activity.constructor === Object) {
      updatedBody.activity = {
        name: editLists?.activity?.name,
        scopeId: editLists?.activity?.scopeId?.[Constants.MONGOOSE_ID],
        weight: editLists?.activity?.weight.toString(),
      };
    }
    if (Object.keys(editLists.team).length !== 0 && editLists.team.constructor === Object) {
      updatedBody.team = {
        teamsWfmName: editLists.team.teamsWfmName,
      };
    }
    if (Object.keys(editLists.member).length !== 0 && editLists.member.constructor === Object) {
      updatedBody.member = {
        user: editLists?.member?.user?.[mongooseId],
        function: editLists?.member?.function?.[mongooseId],
      };
    }
    if (Object.keys(editLists.function).length !== 0 && editLists.function.constructor === Object) {
      updatedBody.function = {
        functionName: editLists.function.functionName,
      };
    }

    setBody(updatedBody);
  }, [editLists]);

  const handleChange = (bodyName, e) => {
    if (e.target) {
      const { name, value } = e.target;
      setBody((prevBody) => ({
        ...prevBody,
        [bodyName]: {
          ...prevBody[bodyName],
          [name]: value,
          project: selectedProjectId,
        },
      }));
    }
  };
  const handleCheckboxChange = (bodyName, e, type) => {
    setBody({
      ...body,
      [bodyName]: {
        ...body[bodyName],
        [e.target.name]: e.target.checked,
        ...(type === "New" && { project: selectedProjectId }),
      },
    });
  };

  const validation = (type) => {
    const { project, location, projectString, asset, team, scope, activity, member } = body;
    const tempError = {};

    if (type === "Project") {
      const projectTitle = Validators.validate("basic", project?.title || "");
      if (projectTitle !== "") tempError.title = projectTitle;
    } else if (type === "Location") {
      const locationTitle = Validators.validate("basic", location?.title || "");
      if (locationTitle !== "") tempError.title = locationTitle;
    } else if (type === "ProjectString") {
      const { name, fromLocation, toLocation } = projectString || {};
      const projectStringName = Validators.validate("basic", name || "");
      const projectStringFromLocation = Validators.validate("basic2", fromLocation || "");
      const projectStringToLocation = Validators.validate("basic2", toLocation || "");
      if (projectStringName !== "") tempError.name = projectStringName;
      if (projectStringFromLocation !== "") tempError.fromLocation = projectStringFromLocation;
      if (projectStringToLocation !== "") tempError.toLocation = projectStringToLocation;
    } else if (type === "Asset") {
      const { cableName, fromLocation, toLocation, manufacture, typeMm2, string } = asset || {};
      const cableNameVal = Validators.validate("basic", cableName || "");
      const fromLocationVal = Validators.validate("basic2", fromLocation || "");
      const toLocationVal = Validators.validate("basic2", toLocation || "");
      const manufactureVal = Validators.validate("basic", manufacture || "");
      const typeMm2Val = Validators.validate("basic2", typeMm2 || "");
      const stringVal = Validators.validate("basic2", string || "");
      if (cableNameVal !== "") tempError.cableName = cableNameVal;
      if (fromLocationVal !== "") tempError.fromLocation = fromLocationVal;
      if (toLocationVal !== "") tempError.toLocation = toLocationVal;
      if (manufactureVal !== "") tempError.manufacture = manufactureVal;
      if (typeMm2Val !== "") tempError.typeMm2 = typeMm2Val;
      if (stringVal !== "") tempError.string = stringVal;
    } else if (type === "Team") {
      const teamsWfmNameVal = Validators.validate("basic", team?.teamsWfmName || "");
      if (teamsWfmNameVal !== "") tempError.teamsWfmName = teamsWfmNameVal;
    } else if (type === "Scope") {
      const { name, normDuration, sortOrder } = scope || {};
      const nameVal = Validators.validate("basic", name || "");
      const normDurationVal = Validators.validate("basic2", normDuration || "");
      const sortOrderVal = Validators.validate("basic2", sortOrder || "");
      if (nameVal !== "") tempError.name = nameVal;
      if (normDurationVal !== "") tempError.normDuration = normDurationVal;
      if (sortOrderVal !== "") tempError.sortOrder = sortOrderVal;
    } else if (type === "Activity") {
      const { name, scopeId, weight } = activity || {};
      const nameVal = Validators.validate("basic", name || "");
      const scopeIdVal = Validators.validate("basic2", scopeId || "");
      const weightVal = Validators.validate("basic2", weight || "");
      const inValid = Constants.INVALID_VALUE;
      if (nameVal !== "") tempError.name = nameVal;
      if (scopeIdVal !== "") tempError.scopeId = scopeIdVal;
      if (weightVal !== "") tempError.weight = weightVal;
      if (weight < 0) tempError.weight = inValid;
    } else if (type === "Member") {
      const userVal = Validators.validate("basic2", member?.user || "");
      const functionval = Validators.validate("basic2", member?.function || "");
      if (userVal !== "") tempError.user = userVal;
      if (functionval !== "") tempError.function = functionval;
    } else if (type === "Function") {
      const functionNameVal = Validators.validate("basic", body.function?.functionName || "");
      if (functionNameVal !== "") tempError.functionName = functionNameVal;
    }

    const isValid = Object.keys(tempError).length === 0;
    setError({ ...error, [type.substring(0, 1).toLowerCase() + type.substring(1)]: tempError });
    return isValid;
  };

  const handleReset = () => {
    const tempBody = { ...body };
    Object.keys(tempBody).forEach((key) => {
      tempBody[key] = {};
    });
    setBody(tempBody);
    setError(tempBody);
  };

  const handleCreate = async (type) => {
    setLoading(true);
    const isValid = validation(type);
    if (type === "Project" && isValid) {
      const res = await dispatch(projectCreateThunk(body.project));
      setOpenNewModal(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newProjectList = await dispatch(projectListThunk());
      setLists({
        ...lists,
        project: newProjectList.payload.data,
      });
    } else if (type === "Location" && isValid) {
      const res = await dispatch(locationCreateThunk(body.location));
      setOpenLocation(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newLocationList = await dispatch(locationListByIdThunk(selectedProjectId));
      if (res.payload.status === 400) {
        const temp = { ...body };
        temp.email = Constants.EMAIL_EXIST;
        setBody({
          ...body,
          location: {
            title: temp,
          },
        });
      }
      setLists({
        ...lists,
        location: newLocationList.payload.data,
      });
    } else if (type === "ProjectString" && isValid) {
      const res = await dispatch(projectStringCreateThunk(body.projectString));
      setOpenString(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newProjectStringList = await dispatch(projectStringListThunk(selectedProjectId));
      setLists({
        ...lists,
        projectString: newProjectStringList.payload.data,
      });
    } else if (type === "Asset" && isValid) {
      const res = await dispatch(assetCreateThunk(body.asset));
      setOpenAsset(false);
      handleReset();
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newAssetList = await dispatch(assetListThunk(selectedProjectId));
      setLists({
        ...lists,
        asset: newAssetList.payload.data,
      });
    } else if (type === "Scope" && isValid) {
      const res = await dispatch(scopesCreateThunk(body.scope));
      setOpenScopes(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newScopeList = await dispatch(scopesThunk(selectedProjectId));
      setLists({
        ...lists,
        scope: newScopeList.payload.data,
      });
    } else if (type === "Activity" && isValid) {
      const res = await dispatch(activityCreateThunk(body.activity));
      setOpenActivity(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newActivityList = await dispatch(activityThunk(selectedProjectId));
      setLists({
        ...lists,
        activity: newActivityList.payload.data,
      });
    } else if (type === "Team" && isValid) {
      const res = await dispatch(teamCreateThunk(body.team));
      setOpenTeam(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newTeamList = await dispatch(teamThunk(selectedProjectId));
      setLists({
        ...lists,
        team: newTeamList.payload.data,
      });
    } else if (type === "Member" && isValid) {
      const res = await dispatch(memberCreateThunk(body.member));
      setOpenMember(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      const newMemberList = await dispatch(memberThunk(selectedProjectId));
      setLists({
        ...lists,
        member: newMemberList.payload.data,
      });
    } else if (type === "Function" && isValid) {
      const res = await dispatch(functionCreateThunk(body.function));
      setOpenFunction(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      setRefresh(!refresh);
    }
    setLoading(false);
    setModalType("New");
    if (isValid) {
      handleReset();
      await dispatch(configThunk());
    }
  };
  const handleUpdate = async (type) => {
    setLoading(true);
    const isValid = validation(type);
    if (type === "Project" && isValid) {
      const res = await dispatch(
        projectsUpdateThunk({ body: body.project, id: editLists.project[mongooseId] })
      );
      setOpenNewModal(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        project: {},
      }));
    } else if (type === "Location" && isValid) {
      const res = await dispatch(
        locationsUpdateThunk({ body: body.location, id: editLists.location[mongooseId] })
      );
      setOpenLocation(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        location: {},
      }));
    } else if (type === "ProjectString" && isValid) {
      const res = await dispatch(
        projectStringsUpdateThunk({
          body: body.projectString,
          id: editLists.projectString[mongooseId],
        })
      );
      setOpenString(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));
      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        projectString: {},
      }));
    } else if (type === "Asset" && isValid) {
      const res = await dispatch(
        assetsUpdateThunk({ body: body.asset, id: editLists.asset[mongooseId] })
      );
      setOpenAsset(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));

      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        asset: {},
      }));
    } else if (type === "Scope" && isValid) {
      const res = await dispatch(
        scopesUpdateThunk({ body: body.scope, id: editLists.scope[mongooseId] })
      );
      setOpenScopes(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));

      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        scope: {},
      }));
    } else if (type === "Activity" && isValid) {
      const res = await dispatch(
        activitiesUpdateThunk({ body: body.activity, id: editLists.activity[mongooseId] })
      );
      setOpenActivity(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));

      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        activity: {},
      }));
    } else if (type === "Team" && isValid) {
      const res = await dispatch(
        teamUpdateThunk({ body: body.team, id: editLists.team[mongooseId] })
      );
      setOpenTeam(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));

      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        team: {},
      }));
    } else if (type === "Member" && isValid) {
      const res = await dispatch(
        membersUpdateThunk({ body: body.member, id: editLists.member[mongooseId] })
      );
      setOpenMember(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));

      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        member: {},
      }));
    } else if (type === "Function" && isValid) {
      const res = await dispatch(
        functionUpdateThunk({ body: body.function, id: editLists.function[mongooseId] })
      );
      setOpenFunction(false);
      await dispatch(openSnackbar({ message: res.payload.message, notificationType: "success" }));

      setRefresh(!refresh);
      setBody((prevBody) => ({
        ...prevBody,
        function: {},
      }));
    }
    setLoading(false);
    if (isValid) {
      setModalType("New");
      await dispatch(configThunk());
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <ViewProject
        title="Projects"
        openProjectList={openProjectList}
        handleCloseProjectList={handleCloseProjectList}
      >
        <DataTable
          table={{
            columns: projectColumns,
            rows: projectRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.project}
        />
      </ViewProject>

      <NewProject
        title={modalType === "New" ? "New Project" : "Edit Project"}
        openNewProject={openNewModal}
        handleCloseNewProject={() => handleCloseNewModal("Project")}
        handleSave={() => (modalType === "New" ? handleCreate("Project") : handleUpdate("Project"))}
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Project name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="title"
          placeholder="Project name"
          margin="normal"
          error={Boolean(error.project.title)}
          helperText={error.project.title}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.project?.title}
          onChange={(e) => handleChange("project", e, modalType)}
          fullWidth
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="isActive"
                defaultChecked={modalType === "New" ? null : editLists.project?.isActive}
                onChange={(e) => handleCheckboxChange("project", e, modalType)}
              />
            }
            label="isActive"
          />
        </FormGroup>
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Location" : "Edit Location"}
        openNewProject={openlocation}
        handleCloseNewProject={() => handleCloseNewModal("Location")}
        handleSave={() =>
          modalType === "New" ? handleCreate("Location") : handleUpdate("Location")
        }
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="title"
          placeholder="Name"
          margin="normal"
          error={Boolean(error.location.title)}
          helperText={error.location.title}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          fullWidth
          defaultValue={modalType === "New" ? null : editLists.location?.title}
          onChange={(e) => handleChange("location", e, modalType)}
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New String" : "Edit String"}
        openNewProject={openString}
        handleCloseNewProject={() => handleCloseNewModal("ProjectString")}
        handleSave={() =>
          modalType === "New" ? handleCreate("ProjectString") : handleUpdate("ProjectString")
        }
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <Typography mt={0} align="center">
          {lists?.location.length === 0 ? Constants.PROJECT_STRING_WARNING : ""}
        </Typography>
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="name"
          placeholder="Name"
          margin="normal"
          error={Boolean(error.projectString.name)}
          helperText={error.projectString.name}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.projectString?.name}
          onChange={(e) => handleChange("projectString", e, modalType)}
          fullWidth
        />
        <FDropdown2
          label="From"
          id="from"
          name="fromLocation"
          defaultValue={
            modalType !== "New" ? editLists.projectString?.fromLocation?.[mongooseId] ?? "" : ""
          }
          options={lists?.location || []}
          // options={lists?.location?.map((item) => item?.title)}
          error={error.projectString.fromLocation}
          helperText={error.projectString.fromLocation}
          handleChange={(e) => handleChange("projectString", e)}
          marginBottom={2}
        />
        <FDropdown2
          label="To*"
          id="to"
          name="toLocation"
          defaultValue={
            modalType !== "New" ? editLists.projectString?.toLocation?.[mongooseId] ?? "" : ""
          }
          options={lists?.location || []}
          error={error.projectString.toLocation}
          helperText={error.projectString.toLocation}
          handleChange={(e) => handleChange("projectString", e)}
          marginBottom={2}
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Asset" : "Edit Asset"}
        openNewProject={openAsset}
        handleCloseNewProject={() => handleCloseNewModal("Asset")}
        handleSave={() => (modalType === "New" ? handleCreate("Asset") : handleUpdate("Asset"))}
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <Typography mt={0} align="center">
          {lists?.location.length === 0 && lists?.projectString.length === 0
            ? Constants.ASSET_WARNING
            : ""}
        </Typography>
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Cabel Name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="cableName"
          placeholder="Cabel Name"
          margin="normal"
          error={Boolean(error.asset.cableName)}
          helperText={error.asset.cableName}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.asset?.cableName}
          fullWidth
          onChange={(e) => handleChange("asset", e, modalType)}
          modalType
        />
        <FDropdown2
          label="From"
          id="from"
          name="fromLocation"
          defaultValue={
            modalType !== "New" ? editLists.asset?.fromLocation?.[mongooseId] ?? "" : ""
          }
          options={lists?.location || []}
          error={error.asset.fromLocation}
          helperText={error.asset.fromLocation}
          handleChange={(e) => handleChange("asset", e)}
          marginBottom={2}
        />
        <FDropdown2
          label="To"
          id="to"
          name="toLocation"
          defaultValue={modalType !== "New" ? editLists.asset?.toLocation?.[mongooseId] ?? "" : ""}
          options={lists?.location || []}
          error={error.asset.toLocation}
          helperText={error.asset.toLocation}
          handleChange={(e) => handleChange("asset", e)}
          marginBottom={2}
        />
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Manufacture*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="manufacture"
          placeholder="Manufacture*"
          margin="normal"
          error={Boolean(error.asset.manufacture)}
          helperText={error.asset.manufacture}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.asset?.manufacture}
          fullWidth
          onChange={(e) => handleChange("asset", e, modalType)}
          modalType
        />
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Type mm2*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="typeMm2"
          placeholder="Type mm2*"
          margin="normal"
          error={Boolean(error.asset.typeMm2)}
          helperText={error.asset.typeMm2}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.asset?.typeMm2}
          fullWidth
          onChange={(e) => handleChange("asset", e, modalType)}
          modalType
        />
        <FDropdown2
          label="Project String"
          id="string"
          name="string"
          defaultValue={modalType !== "New" ? editLists.asset?.string?.[mongooseId] ?? "" : ""}
          options={lists?.projectString || []}
          error={error.asset.string}
          helperText={error.asset.string}
          handleChange={(e) => handleChange("asset", e)}
          marginBottom={2}
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Scope" : "Edit Scope"}
        openNewProject={openScopes}
        handleCloseNewProject={() => handleCloseNewModal("Scope")}
        handleSave={() => (modalType === "New" ? handleCreate("Scope") : handleUpdate("Scope"))}
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Scope Name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="name"
          placeholder="Scope Name*"
          margin="normal"
          error={Boolean(error.scope.name)}
          helperText={error.scope.name}
          defaultValue={modalType === "New" ? null : editLists.scope?.name}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          fullWidth
          onChange={(e) => handleChange("scope", e, modalType)}
          modalType
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="isDoable"
                defaultValue={modalType === "New" ? null : editLists.scope?.isDoable}
                onChange={(e) => handleCheckboxChange("scope", e, modalType)}
              />
            }
            label="isDoable"
            variant="body1"
            sx={{ fontWeight: 500 }}
          />
        </FormGroup>
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Norm Duration*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="normDuration"
          placeholder="Norm Duration*"
          margin="normal"
          type="number"
          error={Boolean(error.scope.normDuration)}
          helperText={error.scope.normDuration}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.scope?.normDuration}
          fullWidth
          onChange={(e) => handleChange("scope", e, modalType)}
          modalType
        />
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Sort Order*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="sortOrder"
          placeholder="Sort Order*"
          margin="normal"
          error={Boolean(error.scope.sortOrder)}
          helperText={error.scope.sortOrder}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "New" ? null : editLists.scope?.sortOrder}
          fullWidth
          onChange={(e) => handleChange("scope", e, modalType)}
          modalType
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Team" : "Edit Team"}
        openNewProject={openTeam}
        handleCloseNewProject={() => handleCloseNewModal("Team")}
        handleSave={() => (modalType === "New" ? handleCreate("Team") : handleUpdate("Team"))}
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Teams WFM Name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="teamsWfmName"
          placeholder="Teams WFM Name"
          margin="normal"
          error={Boolean(error.team.teamsWfmName)}
          helperText={error.team.teamsWfmName}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          fullWidth
          defaultValue={modalType === "New" ? null : editLists.team?.teamsWfmName}
          onChange={(e) => handleChange("team", e, modalType)}
          modalType
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Member" : "Edit Member"}
        openNewProject={openMember}
        handleCloseNewProject={() => handleCloseNewModal("Member")}
        handleSave={() => (modalType === "New" ? handleCreate("Member") : handleUpdate("Member"))}
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <Typography mt={0} align="center">
          {lists?.function.length === 0 ? Constants.MEMBER_WARNING : ""}
        </Typography>

        <FDropdown2
          label="Select Member*"
          id="select-member"
          name="user"
          defaultValue={
            modalType === "Update" && openMember ? editLists?.member?.user?.[mongooseId] ?? "" : ""
          }
          // options={userList || []}
          options={dropdownData.member}
          error={error.member.user}
          helperText={error.member.user}
          handleChange={(e) => handleChange("member", e)}
          marginBottom={2}
        />
        <FDropdown2
          label="Select Function*"
          id="select-function"
          name="function"
          defaultValue={
            modalType === "Update" && openMember
              ? editLists?.member?.function?.[mongooseId] ?? ""
              : ""
          }
          // options={lists?.function || []}
          options={dropdownData.function || []}
          error={error.member.function}
          helperText={error.member.function}
          handleChange={(e) => handleChange("member", e)}
          marginBottom={2}
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Activity" : "Edit Activity"}
        openNewProject={openActivity}
        handleCloseNewProject={() => handleCloseNewModal("Activity")}
        handleSave={() =>
          modalType === "New" ? handleCreate("Activity") : handleUpdate("Activity")
        }
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <Typography mt={0} align="center">
          {lists.scope.length === 0 ? Constants.ACTIVITY_WARNING : ""}
        </Typography>
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Activity*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="name"
          placeholder="Activity*"
          margin="normal"
          error={Boolean(error.activity.name)}
          helperText={error.activity.name}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "Update" && openActivity ? editLists.activity?.name : null}
          fullWidth
          onChange={(e) => handleChange("activity", e, modalType)}
        />

        <FDropdown2
          label="Scope Id*"
          id="scopeId"
          name="scopeId"
          defaultValue={modalType !== "New" ? editLists.activity?.scopeId?.[mongooseId] ?? "" : ""}
          displayProperty="name"
          options={lists?.scope || []}
          error={error.activity.scopeId}
          helperText={error.activity.scopeId}
          handleChange={(e) => handleChange("activity", e)}
          marginBottom={2}
        />
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Weight*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="weight"
          placeholder="Weight*"
          margin="normal"
          type="number"
          error={Boolean(error.activity.weight)}
          helperText={error.activity.weight}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={modalType === "Update" && openActivity ? editLists.activity?.weight : null}
          fullWidth
          onChange={(e) => handleChange("activity", e, modalType)}
        />
      </NewProject>

      <NewProject
        title={modalType === "New" ? "New Function" : "Edit Function"}
        openNewProject={openFunction}
        handleCloseNewProject={() => handleCloseNewModal("Function")}
        handleSave={() =>
          modalType === "New" ? handleCreate("Function") : handleUpdate("Function")
        }
        actionButton={loading ? "Loading..." : "Submit"}
      >
        <MDTypography
          variant="caption"
          mt={2}
          mb={1}
          sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
        >
          Project Function Name*
        </MDTypography>
        <MDInput
          sx={{
            marginTop: 0,
            marginBottom: 2,
            "& input": {
              fontSize: "16px",
              color: "#667085",
            },
          }}
          name="functionName"
          placeholder="Project Function Name*"
          margin="normal"
          error={Boolean(error.function.functionName)}
          helperText={error.function.functionName}
          FormHelperTextProps={{
            sx: { marginLeft: 0, color: "#FF2E2E" },
          }}
          defaultValue={
            modalType === "Update" && openFunction ? editLists.function?.functionName : null
          }
          fullWidth
          onChange={(e) => handleChange("function", e, modalType)}
        />
      </NewProject>

      <ViewProject
        title="Location"
        openProjectList={openLocationData}
        handleCloseProjectList={handleCloseLocationData}
      >
        <DataTable
          table={{
            columns: locationColumns,
            rows: locationRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.location}
        />
      </ViewProject>

      <ViewProject
        title="Project String"
        openProjectList={openProjectStringData}
        handleCloseProjectList={handleCloseProjectStringData}
      >
        <DataTable
          table={{
            columns: ProjectStringColumns,
            rows: ProjectStringRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.projectString}
        />
      </ViewProject>

      <ViewProject
        title="Asset"
        openProjectList={openAssetData}
        handleCloseProjectList={handleCloseAssetData}
      >
        <DataTable
          table={{
            columns: AssetColumns,
            rows: AssetRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.asset}
        />
      </ViewProject>

      <ViewProject
        title="Teams"
        openProjectList={openTeamsData}
        handleCloseProjectList={handleCloseTeamsData}
      >
        <DataTable
          table={{
            columns: teamColumns,
            rows: teamRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.team}
        />
      </ViewProject>

      <ViewProject
        title="Members"
        openProjectList={openMemberData}
        handleCloseProjectList={handleCloseMemberData}
      >
        <DataTable
          table={{
            columns: membersColumns,
            rows: membersRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.member}
        />
      </ViewProject>

      <ViewProject
        title="Scopes"
        openProjectList={openScopesData}
        handleCloseProjectList={handleCloseScopesData}
      >
        <DataTable
          table={{
            columns: ScopesColumns,
            rows: ScopesRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.scope}
        />
      </ViewProject>

      <ViewProject
        title="Activity"
        openProjectList={openActivitiesData}
        handleCloseProjectList={handleCloseActivitiesData}
      >
        <DataTable
          table={{
            columns: ActivitiesColumns,
            rows: ActivitiesRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.activity}
        />
      </ViewProject>

      <ViewProject
        title="Functions"
        openProjectList={openFunctionsData}
        handleCloseProjectList={handleCloseFunctionsData}
      >
        <DataTable
          table={{
            columns: FunctionsColumns,
            rows: FunctionsRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.function}
        />
      </ViewProject>
      <ViewProject
        title="Report Type"
        openProjectList={openReportTypeData}
        handleCloseProjectList={handleCloseReportTypeData}
      >
        <DataTable
          table={{
            columns: reportTypeColumns,
            rows: reportTypeRows,
          }}
          backgroundColor={Colors.LIGHT_GRAY} // Specify the background color here
          textColor={Colors.BLACK}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          pagination={{ variant: "gradient", color: "info" }}
          loading={loadingStatus.function}
        />
      </ViewProject>

      <MDBox display="flex" justifyContent="space-between" alignItems="center" fullWidth>
        <PageTitle title="Project" />
      </MDBox>
      <Divider sx={{ marginTop: pxToRem(22) }} />
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <MDBox display="flex wrap" flexWrap="wrap" justifyContent="start" mx={0}>
          <FormControl sx={{ my: 1, minWidth: 250 }}>
            <MDTypography
              variant="caption"
              mb={1}
              sx={{ fontSize: pxToRem(14), fontWeight: 600, color: "#344054" }}
            >
              Select Project
            </MDTypography>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              displayEmpty
              placeholder="selected project"
              sx={{
                height: 40,
                paddingX: "0.65rem",
                fontSize: pxToRem(16),
                fontWeight: 400,
                backgroundColor: "#fff",
              }}
              IconComponent={CustomComponents.DROPDOWN_ICON}
              value={selectedProjectId || ""}
              onChange={handleProjectChange}
            >
              <MenuItem disabled value="">
                Select Project
              </MenuItem>
              {lists.project.map((item) => (
                <MenuItem
                  value={item[mongooseId]}
                  sx={{ fontSize: pxToRem(16), fontWeight: 400, color: "#344054" }}
                >
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>
        <MDBox>
          <CustomButton
            title="Project List"
            background="#191A51"
            icon="calendar_view_day"
            color="#ffffff"
            openModal={handleOpenProjectList}
          />

          <CustomButton
            title="New Project"
            icon="add_circle_outline"
            background="#191A51"
            color="#ffffff"
            openModal={() => handleOpenNewModal("Project")}
          />
        </MDBox>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3} sx={{ display: "flex" }}>
          {cardList
            .filter((item) => item.isVisible)
            .map((val) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                sx={{ display: "flex", flex: "1", minWidth: 0 }}
              >
                <MDBox mb={1.5} sx={{ width: "100%" }}>
                  <Card
                    style={{
                      boxShadow: "none",
                      border: "1px solid #E0E6F5",
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <MDBox sx={{ flex: "1 1 auto" }}>
                      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
                        <MDBox textAlign="right" lineHeight={1.25}>
                          <MDTypography variant="h4" fontWeight="bold" color="text">
                            {val.cardTitle}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox mt={2} ml={1} sx={{ flex: "1 1 auto" }}>
                        <MDTypography fontWeight="light" color={Colors.BLACK} variant="body2" m={1}>
                          {val.content}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox display="flex" justifyContent="flex-end" pt={1} px={2} pb={2}>
                      <CustomButton
                        title="View List"
                        background={selectedProjectId === "" ? "gray" : "#191A51"}
                        icon="calendar_view_day"
                        color="#ffffff"
                        disabled={selectedProjectId === ""}
                        openModal={() => handleOpenProjectModal(val.cardTitle)}
                      />
                      <CustomButton
                        title="Add New"
                        background={selectedProjectId === "" ? "gray" : "#191A51"}
                        icon="add_circle_outline"
                        color="#ffffff"
                        disabled={selectedProjectId === ""}
                        openModal={() => handleOpenNewModal(val.cardTitle)}
                      />
                    </MDBox>
                  </Card>
                </MDBox>
              </Grid>
            ))}
        </Grid>
      </MDBox>
      <DeleteModal
        open={deleteData.openDeleteModal}
        title={`Delete ${deleteData.type.toLowerCase()}`}
        message="Are you sure you want to delete?"
        handleClose={handleCloseDeleteModal}
        handleDelete={handleOpenDeleteModal}
      />
    </DashboardLayout>
  );
}

export default SetupProject;
