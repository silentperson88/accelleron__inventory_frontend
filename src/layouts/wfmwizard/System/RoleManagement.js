import React, { useEffect, useState } from "react";

// Material components
import MDBox from "components/MDBox";
import { Autocomplete, Card, Divider, Grid } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Custom components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import DataTable from "examples/Tables/DataTable";
import FilterDropdown from "components/Dropdown/FilterDropdown";
import FilterButton from "components/Buttons/FilterButton";
import BasicModal from "examples/modal/BasicModal/BasicModal";
import ConfirmationModal from "examples/modal/Confirmation/Confirmation";

// function to convert px to rem
import pxToRem from "assets/theme/functions/pxToRem";

// Table Data
import RoleData from "layouts/wfmwizard/System/data/RoleData";

// utils
import Constants, {
  Icons,
  PageTitles,
  ButtonTitles,
  Colors,
  FeatureTags,
  ModalContent,
} from "utils/Constants";

// Feature flag
import { Feature } from "flagged";
import FTextField from "components/Form/FTextField";
import CustomRadio from "components/CustomRadio/CustomRadio";
import Validator from "utils/Validations";
import { useDispatch } from "react-redux";
import RoleListThunk, { CreateNewRole, UpdateRole } from "redux/Thunks/Role";
import { openSnackbar } from "redux/Slice/Notification";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

function roleManagement() {
  // usestate variable for creation modal, data, status modal
  const [modal, setModal] = useState({
    open: false,
    title: ModalContent.NEW_ROLE,
    type: "new",
    loading: false,
  });
  const [role, setRole] = useState({
    list: [],
    editId: "",
    body: { roleName: "", description: "", allProject: "true", accessType: "both" },
    editBody: {},
    errors: {},
    dataLoading: "pending",
  });

  const [confirmation, setConfirmation] = useState({
    open: false,
    editId: "",
    isActive: false,
  });

  const [filters, setFilters] = useState([
    {
      inputLabel: "Project Type",
      list: [
        { [Constants.MONGOOSE_ID]: "All", title: "All" },
        { [Constants.MONGOOSE_ID]: "true", title: "All Projects" },
        { [Constants.MONGOOSE_ID]: "false", title: "Assigned Projects" },
      ],
      selectedValue: "All",
    },
    {
      inputLabel: "Access Type",
      list: [
        { [Constants.MONGOOSE_ID]: "All", title: "All" },
        { [Constants.MONGOOSE_ID]: "both", title: "Both" },
        { [Constants.MONGOOSE_ID]: "web", title: "Web" },
        { [Constants.MONGOOSE_ID]: "mobile", title: "Mobile" },
      ],
      selectedValue: "All",
    },
    {
      inputLabel: "Role Status",
      list: [
        { [Constants.MONGOOSE_ID]: "All", title: "All" },
        { [Constants.MONGOOSE_ID]: "true", title: "Active" },
        { [Constants.MONGOOSE_ID]: "false", title: "In Active" },
      ],
      selectedValue: "All",
    },
  ]);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    perPage: 20,
  });
  const dispatch = useDispatch();

  const handleOpen = (modalTitle, modalType, body = role.body, editId = "") => {
    setModal({
      ...modal,
      open: true,
      title: modalTitle,
      type: modalType,
      loading: false,
    });
    setRole({
      ...role,
      body: {
        roleName: body?.title || "",
        description: body?.description || "",
        allProject: body?.allProject.toString(),
        accessType: body?.accessType,
      },
      editBody: body,
      editId,
    });
  };

  const handleClose = () => {
    setModal({
      ...modal,
      open: false,
      title: ModalContent.NEW_ROLE,
      type: "new",
      loading: false,
    });
    setConfirmation({
      ...confirmation,
      open: false,
      editId: "",
      isActive: false,
    });
    setRole({
      ...role,
      body: { roleName: "", description: "", allProject: "true", accessType: "both" },
      editBody: {},
      editId: "",
      errors: {},
    });
  };

  const handleConfirmationModalOpen = (editId, isActive) => {
    setConfirmation({
      ...confirmation,
      open: true,
      editId,
      isActive,
    });
  };

  const { columns, rows } = RoleData(handleOpen, role.list, handleConfirmationModalOpen);

  const handleFilter = async (filterValue = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      allProject: filterValue[0].selectedValue,
      accessType: filterValue[1].selectedValue,
      active: filterValue[2].selectedValue,
    };
    Object.keys(paramData).forEach((key) => {
      if (paramData[key] === "") {
        delete paramData[key];
      }
    });

    const data = new URLSearchParams(paramData);
    const res = await dispatch(RoleListThunk(data));
    if (res?.payload?.status === 200) {
      setRole({
        ...role,
        list: res?.payload?.data?.data,
        body: { roleName: "", description: "", allProject: "true", accessType: "both" },
        editBody: {},
        errors: {},
        dataLoading: "fullfilled",
      });
    } else {
      await dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleReset = async () => {
    const tempFilters = filters.map((filter) => ({
      ...filter,
      selectedValue: filter.list[0][Constants.MONGOOSE_ID],
    }));
    setFilters(tempFilters);
    handleFilter(tempFilters);
  };

  useEffect(() => {
    (async () => {
      handleFilter();
    })();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = [...filters];
    const index = newFilters.findIndex((val) => val.inputLabel === name);
    newFilters[index].selectedValue = value;
    setFilters(newFilters);
    handleFilter(newFilters);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRole({
      ...role,
      body: {
        ...role.body,
        [name]: value,
      },
    });
  };

  const validateForm = () => {
    const { roleName, allProject, accessType } = role.body;
    const errors = {};

    const roleNameError = Validator.validate("basic", roleName);
    const allProjectError = Validator.validate("basic", allProject);
    const accessTypeError = Validator.validate("basic", accessType);
    if (roleNameError !== "") {
      errors.roleName = roleNameError;
    }

    if (allProjectError !== "") {
      errors.allProject = allProjectError;
    }

    if (accessTypeError !== "") {
      errors.accessType = accessTypeError;
    }

    setRole({
      ...role,
      errors,
    });

    return Object.keys(errors).length === 0;
  };

  const handleCreateRole = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    setModal({
      ...modal,
      loading: true,
    });
    const body = {
      title: role.body.roleName,
      description: role.body.description,
      allProject: role.body.allProject,
      accessType: role.body.accessType,
    };
    const res = await dispatch(CreateNewRole(body));
    if (res.payload.status === 200) {
      handleClose();
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.ROLE_CREATED_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      const err = res.payload?.data?.message;
      setModal({
        ...modal,
        loading: false,
      });
      setRole({
        ...role,
        errors: {
          roleName: err,
        },
      });
    } else {
      setModal({
        ...modal,
        loading: false,
      });
      await dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleUpdateRole = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    setModal({
      ...modal,
      loading: true,
    });
    const body = {
      ...(role.editBody?.title !== role.body.roleName && { title: role.body.roleName }),
      ...(role.editBody?.description !== role.body.description && {
        description: role.body.description,
      }),
      ...(role.editBody?.allProject.toString() !== role.body.allProject && {
        allProject: role.body.allProject,
      }),
      ...(role.editBody?.accessType !== role.body.accessType && {
        accessType: role.body.accessType,
      }),
    };

    const res = await dispatch(UpdateRole({ body, id: role.editId }));
    if (res.payload.status === 200) {
      handleClose();
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.ROLE_UPDATED_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      const err = res.payload?.data?.message;
      setModal({
        ...modal,
        loading: false,
      });
      setRole({
        ...role,
        errors: {
          roleName: err,
        },
      });
      await dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    } else {
      setModal({
        ...modal,
        loading: false,
      });
      await dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleStatus = async () => {
    const body = {
      isActive: confirmation?.isActive,
    };
    const res = await dispatch(UpdateRole({ body, id: confirmation?.editId }));
    handleFilter();
    if (res.payload.status === 200) {
      handleClose();
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.ROLE_UPDATED_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else {
      handleClose();
      await dispatch(
        openSnackbar({
          message: Constants.SOMETHING_WENT_WRONG,
          notificationType: Constants.NOTIFICATION_ERROR,
        })
      );
    }
  };

  const handleReload = async () => {
    setRole((prevState) => ({
      ...prevState,
      dataLoading: "pending",
    }));
    handleFilter();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Page Title and create button */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <PageTitle title={PageTitles.ROLE_MANAGEMENT} />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title={ButtonTitles.NEW_ROLE}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => handleOpen(ModalContent.NEW_ROLE, "new")}
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
      <Divider sx={{ mt: pxToRem(22) }} />

      <Feature name={FeatureTags.ROLE_MANAGEMENT}>
        {/* Filters */}
        <MDBox display="flex wrap" justifyContent="space-between" mx={0}>
          {filters?.map((val) => (
            <FilterDropdown
              label={val.inputLabel}
              name={val.inputLabel}
              defaultValue={val?.selectedValue}
              value={val?.selectedValue}
              handleChange={handleFilterChange}
              menu={val.list}
              key={val.inputLabel.replace(/\s/g, "")}
            />
          ))}
          <FilterButton
            title={ButtonTitles.RESET_FILTER}
            icon={Icons.RESET_FILTER}
            handleClick={handleReset}
          />
        </MDBox>

        {/* Role management table */}
        <MDBox mt={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 25 }}
                  showTotalEntries={false}
                  noEndBorder
                  loading={role.dataLoading}
                  currentPage={tablePagination.page}
                  // handleTablePagination={handleTablePagination}
                />
              </MDBox>
            </Card>
          </Grid>
        </MDBox>

        {/* Create and Update Report type modal */}
        <BasicModal
          open={modal.open}
          handleClose={handleClose}
          title={modal.title}
          actionButton={
            (modal.type === "new" && !modal.loading && ButtonTitles.SUBMIT) ||
            (modal.type === "new" && modal.loading && ButtonTitles.SUBMIT_LOADING) ||
            (modal.type === "update" && !modal.loading && ButtonTitles.UPDATE) ||
            (modal.type === "update" && modal.loading && ButtonTitles.UPDATE_LOADING)
          }
          handleAction={modal.type === "new" ? handleCreateRole : handleUpdateRole}
        >
          {/* Role Name */}
          <MDBox sx={{ mt: pxToRem(8), display: "flex", flexDirection: "column" }}>
            <MDTypography
              variant="body"
              sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054", lineHeight: "20px" }}
            >
              Role Name
            </MDTypography>
            <Autocomplete
              options={[
                "Office Management",
                "Office Crewing",
                "Office Warehouse",
                "Project Management",
                "Project Personnel",
              ]}
              freeSolo
              name="roleName"
              id="roleName"
              variant="standard"
              sx={{
                mt: 1,
                "& .MuiAutocomplete-inputRoot": {
                  padding: "4px",
                },
              }}
              popupIcon={<KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />}
              onChange={(e, value) => handleChange({ target: { name: "roleName", value } })}
              value={role.body.roleName}
              renderInput={(params) => (
                <MDInput
                  {...params}
                  name="roleName"
                  onChange={(e) => handleChange(e)}
                  placeholder="Enter Role Name"
                  error={Boolean(role.errors?.roleName)}
                  helperText={role.errors?.roleName}
                  FormHelperTextProps={{
                    sx: { marginLeft: 0, color: "red" },
                  }}
                />
              )}
            />
          </MDBox>
          {/* Description */}
          <FTextField
            label="Description"
            name="description"
            id="description"
            placeholder="Enter Description"
            type="textarea"
            error={Boolean(role.errors?.description)}
            helperText={role.errors?.description}
            handleChange={handleChange}
            value={role.body.description}
          />

          <MDBox
            sx={{
              mt: pxToRem(8),
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {/* Project Type */}
            <CustomRadio
              label="Project Type"
              name="allProject"
              list={[
                { label: "All Projects", value: "true" },
                { label: "Assigned Projects", value: "false" },
              ]}
              value={role.body.allProject}
              handleChange={handleChange}
            />
            {/* Access Type */}
            <CustomRadio
              label="Access Type"
              name="accessType"
              list={[
                { label: "Both", value: "both" },
                { label: "Web", value: "web" },
                { label: "Mobile", value: "mobile" },
              ]}
              value={role?.body?.accessType}
              handleChange={handleChange}
            />
          </MDBox>
        </BasicModal>

        {/* Confirmation modal for Activate and deactivate role. */}
        <ConfirmationModal
          open={confirmation.open}
          title={ModalContent.ROLE_STATUS}
          message={
            confirmation?.isActive
              ? ModalContent.ROLE_ACTIVE_STATUS_MESSAGE
              : ModalContent.ROLE_INACTIVE_STATUS_MESSAGE
          }
          handleClose={handleClose}
          handleAction={handleStatus}
        />
      </Feature>
    </DashboardLayout>
  );
}

export default roleManagement;
