import React, { useEffect, useState } from "react";

// Material components
import MDBox from "components/MDBox";
import { Card, Divider, Grid } from "@mui/material";

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
import PalletData from "layouts/rackAndPalletManagement/data/palletData";

// utils
import Constants, { Icons, PageTitles, ButtonTitles, Colors, ModalContent } from "utils/Constants";

// Feature flag
import FTextField from "components/Form/FTextField";
// import CustomRadio from "components/CustomRadio/CustomRadio";
import Validator from "utils/Validations";
import { useDispatch } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification.slice";
import createRack, { getPallets, updatePallet, getRacks } from "redux/Thunks/Racks.thunk";
import { paramCreater } from "utils/methods/methods";

function roleManagement() {
  // usestate variable for creation modal, data, status modal
  const [modal, setModal] = useState({
    open: false,
    title: ModalContent.NEW_RACK,
    type: "new",
    loading: false,
  });
  const [pallet, setPallet] = useState({
    list: [],
    editId: "",
    body: { rack: "", palletRow: 0, palletColumn: 0 },
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
      inputLabel: "Rack",
      list: [{ [Constants.MONGOOSE_ID]: "All", title: "All" }],
      selectedValue: "All",
    },
    {
      inputLabel: "Rack Status",
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

  const handleOpen = (modalTitle, modalType, body = pallet.body, editId = "") => {
    setModal({
      ...modal,
      open: true,
      title: modalTitle,
      type: modalType,
      loading: false,
    });
    setPallet({
      ...pallet,
      body: {
        rack: body?.title || "",
        palletRow: body?.palletRow || 0,
        palletColumn: body?.palletColumn || 0,
      },
      editBody: body,
      editId,
    });
  };

  const handleClose = () => {
    setModal({
      ...modal,
      open: false,
      title: ModalContent.NEW_RACK,
      type: "new",
      loading: false,
    });
    setConfirmation({
      ...confirmation,
      open: false,
      editId: "",
      isActive: false,
    });
    setPallet({
      ...pallet,
      body: { rack: "", palletRow: 0, palletColumn: 0 },
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

  const { columns, rows } = PalletData(handleOpen, pallet.list, handleConfirmationModalOpen);

  const handleFilter = async (filterValue = filters) => {
    setTablePagination({ ...tablePagination, page: 0 });
    const paramData = {
      page: 0,
      perPage: tablePagination.perPage,
      rack: filterValue[0].selectedValue === "All" ? "" : filterValue[0].selectedValue,
      isActive: filterValue[1].selectedValue === "All" ? "" : filterValue[1].selectedValue,
    };

    const res = await dispatch(getPallets(paramCreater(paramData)));
    if (res?.payload?.status === 201) {
      console.log("res", res);
      setPallet({
        ...pallet,
        list: res?.payload?.data?.data,
        body: { rack: "", palletRow: 0, palletColumn: 0 },
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
      const res = await dispatch(getRacks());
      if (res?.payload?.status === 201) {
        const rackFiltersList = res?.payload?.data?.data.map((val) => ({
          [Constants.MONGOOSE_ID]: val.rack,
          title: val.rack,
        }));
        const tempFilters = [...filters];
        tempFilters[0].list = [...tempFilters[0].list, ...rackFiltersList];
        setFilters(tempFilters);
      } else {
        await dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
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
    setPallet({
      ...pallet,
      body: {
        ...pallet.body,
        [name]: value,
      },
    });
  };

  const validateForm = () => {
    const { rack, palletRow, palletColumn } = pallet.body;
    const errors = {};

    const rackError = Validator.validate("basic", rack);
    const palletRowError = Validator.validate("number", palletRow);
    const palletColumnError = Validator.validate("number", palletColumn);
    console.log("rackError", rackError);
    console.log("palletRowError", palletRowError);
    console.log("palletColumnError", palletColumnError);
    if (rackError !== "") {
      errors.rack = rackError;
    }

    if (palletRowError !== "") {
      errors.allProject = palletRowError;
    }

    if (palletColumnError !== "") {
      errors.palletColumn = palletColumnError;
    }

    setPallet({
      ...pallet,
      errors,
    });

    return Object.keys(errors).length === 0;
  };

  const handleCreateRole = async () => {
    console.log("pallet", pallet);
    const isValid = validateForm();
    console.log("isValid", isValid);
    if (!isValid) return;
    setModal({
      ...modal,
      loading: true,
    });
    const body = {
      rack: pallet.body.rack,
      palletRow: pallet.body.palletRow,
      palletColumn: pallet.body.palletColumn,
    };
    const res = await dispatch(createRack(body));
    console.log(res);
    if (res.payload.status === 201) {
      handleClose();
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.RACK_CREATED_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      const err = res.payload?.data?.message;
      setModal({
        ...modal,
        loading: false,
      });
      setPallet({
        ...pallet,
        errors: {
          rack: err,
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
      ...(pallet.editBody?.title !== pallet.body.rack && { title: pallet.body.rack }),
      ...(pallet.editBody?.palletRow !== pallet.body.palletRow && {
        palletRow: pallet.body.palletRow,
      }),
      ...(pallet.editBody?.palletColumn !== pallet.body.palletColumn && {
        palletColumn: pallet.body.palletColumn,
      }),
    };

    const res = await dispatch(updatePallet({ body, id: pallet.editId }));
    if (res.payload.status === 200) {
      handleClose();
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.RACK_UPDATED_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    } else if (res.payload.status === 400) {
      const err = res.payload?.data?.message;
      setModal({
        ...modal,
        loading: false,
      });
      setPallet({
        ...pallet,
        errors: {
          rack: err,
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
    const res = await dispatch(updatePallet({ body, id: confirmation?.editId }));
    handleFilter();
    if (res.payload.status === 200) {
      handleClose();
      handleFilter();
      await dispatch(
        openSnackbar({
          message: Constants.RACK_UPDATED_SUCCESSFULLY,
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
    setPallet((prevState) => ({
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
        <PageTitle title={PageTitles.RACK_PALLET_MANAGEMENT} />
        <MDBox display="flex" flexDirection="row">
          <CustomButton
            title={ButtonTitles.NEW_RACK}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => handleOpen(ModalContent.NEW_RACK, "new")}
          />
          <CustomButton
            title={ButtonTitles.NEW_PALLET}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
            openModal={() => handleOpen(ModalContent.NEW_RACK, "new")}
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
                loading={pallet.dataLoading}
                currentPage={tablePagination.page}
                // handleTablePagination={handleTablePagination}
              />
            </MDBox>
          </Card>
        </Grid>
      </MDBox>

      {/* Create Rack */}
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
        <MDBox
          sx={{
            mt: pxToRem(8),
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FTextField
            label="Rack Name"
            name="rack"
            id="rack"
            placeholder="Enter Rack Name"
            type="text"
            error={Boolean(pallet.errors?.rack)}
            helperText={pallet.errors?.rack}
            handleChange={handleChange}
            value={pallet.body.rack}
          />
          <FTextField
            label="Number of Rows"
            name="palletRow"
            id="palletRow"
            placeholder="Enter Number of Rows"
            type="number"
            error={Boolean(pallet.errors?.palletRow)}
            helperText={pallet.errors?.palletRow}
            handleChange={handleChange}
            value={pallet.body.palletRow}
          />
          <FTextField
            label="Number of Columns"
            name="palletColumn"
            id="palletColumn"
            placeholder="Enter Number of Rows"
            type="number"
            error={Boolean(pallet.errors?.palletColumn)}
            helperText={pallet.errors?.palletColumn}
            handleChange={handleChange}
            value={pallet.body.palletColumn}
          />
        </MDBox>
      </BasicModal>

      {/* Create a Pallet */}
      {/* <BasicModal
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
        <MDBox sx={{ mt: pxToRem(8), display: "flex", flexDirection: "column" }}>
          <MDTypography
            variant="body"
            sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054", lineHeight: "20px" }}
          >
            Rack Name
          </MDTypography>
          <Autocomplete
            options={[]}
            freeSolo
            name="rack"
            id="rack"
            variant="standard"
            sx={{
              mt: 1,
              "& .MuiAutocomplete-inputRoot": {
                padding: "4px",
              },
            }}
            popupIcon={<KeyboardArrowDownIcon fontSize="medium" sx={{ color: "#667085" }} />}
            onChange={(e, value) => handleChange({ target: { name: "rack", value } })}
            value={pallet.body.rack}
            renderInput={(params) => (
              <MDInput
                {...params}
                name="rack"
                onChange={(e) => handleChange(e)}
                placeholder="Enter Rack Name"
                error={Boolean(pallet.errors?.rack)}
                helperText={pallet.errors?.rack}
                FormHelperTextProps={{
                  sx: { marginLeft: 0, color: "red" },
                }}
              />
            )}
          />
        </MDBox>
        <MDBox
          sx={{
            mt: pxToRem(8),
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FTextField
            label="Rack Name"
            name="rack"
            id="rack"
            placeholder="Enter Rack Name"
            type="text"
            error={Boolean(pallet.errors?.rack)}
            helperText={pallet.errors?.rack}
            handleChange={handleChange}
            value={pallet.body.rack}
          />
          <FTextField
            label="Number of Rows"
            name="palletRow"
            id="palletRow"
            placeholder="Enter Number of Rows"
            type="number"
            error={Boolean(pallet.errors?.palletRow)}
            helperText={pallet.errors?.palletRow}
            handleChange={handleChange}
            value={pallet.body.palletRow}
          />
          <FTextField
            label="Number of Columns"
            name="palletColumn"
            id="palletColumn"
            placeholder="Enter Number of Rows"
            type="number"
            error={Boolean(pallet.errors?.palletColumn)}
            helperText={pallet.errors?.palletColumn}
            handleChange={handleChange}
            value={pallet.body.palletColumn}
          />
        </MDBox>
      </BasicModal> */}

      {/* Confirmation modal for Activate and deactivate pallet. */}
      <ConfirmationModal
        open={confirmation.open}
        title={ModalContent.RACK_STATUS}
        message={
          confirmation?.isActive
            ? ModalContent.RACK_ACTIVE_STATUS_MESSAGE
            : ModalContent.ROLE_INACTIVE_STATUS_MESSAGE
        }
        handleClose={handleClose}
        handleAction={handleStatus}
      />
    </DashboardLayout>
  );
}

export default roleManagement;
