// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { Modal, FormGroup, FormControlLabel, Checkbox, Grid, Icon } from "@mui/material";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import style from "assets/style/Modal";
import { CreateNewCard, updateCategoryCardThunk } from "redux/Thunks/CardCategory";
import configThunk from "redux/Thunks/Config";
import ModalTitle from "examples/NewDesign/ModalTitle";
import pxToRem from "assets/theme/functions/pxToRem";
import { openSnackbar } from "redux/Slice/Notification";
import Constants, { Icons, ButtonTitles } from "utils/Constants";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

function setupCardCategoryModal({
  open,
  setOpen,
  updateList,
  setUpdateList,
  title,
  data,
  setCategoryList,
  categoryList,
}) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setValues([]);
    setErrors([]);
    setOpen(false);
    setLoading(false);
  };
  const validate = () => {
    const newErrors = {};

    if (!values) {
      return false;
    }
    if (!values.categoryName) {
      newErrors.categoryName = "Category Name is required";
    } else if (values.categoryName.trim() === "") {
      newErrors.categoryName = "Empty Space is not allowed";
    }
    setErrors(newErrors);
    return Object.values(newErrors).filter((val) => val !== "").length === 0;
  };
  const handleChange = (e) => {
    if (e.target.value !== "") {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    } else {
      const tempValue = { ...values };
      delete tempValue[e.target.name];
      setValues(tempValue);
    }
  };

  const handleChangeCheckbox = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validate();
    if (val) {
      setLoading(true);
      const body = {
        categoryName: values.categoryName.trim(),
        isVisibleForIncidentCard: values.isVisibleForIncidentCard,
        isVisibleForSafeCard: values.isVisibleForSafeCard,
        isVisibleForUnsafeCard: values.isVisibleForUnsafeCard,
      };
      const res = await dispatch(CreateNewCard(body));
      if (res.payload.status === 200) {
        handleClose();
        await dispatch(configThunk());
        dispatch(
          openSnackbar({
            message: Constants.CATEGORY_UPDATE_SUCCESSFULLY,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
        setUpdateList(!updateList);
      } else if (res.payload.status === 400) {
        const temp = { ...errors };
        temp.categoryName = Constants.Card_EXIST;
        setErrors(temp);
      }
      setLoading(false);
    }
  };
  const mongooseId = "_id";
  const handleUpdate = async () => {
    setLoading(true);
    const b = {
      body: values,
      id: data[mongooseId],
    };
    const res = await dispatch(updateCategoryCardThunk(b));
    if (res.payload.status === 200) {
      handleClose();
      const index = categoryList.findIndex((element) => element[mongooseId] === data[mongooseId]);
      const temp = [...categoryList];
      const updatedData = res.payload.data.data;
      temp[index] = updatedData;
      setCategoryList(temp);
      await dispatch(configThunk());
      dispatch(
        openSnackbar({
          message: Constants.CATEGORY_UPDATE_SUCCESSFULLY,
          notificationType: Constants.NOTIFICATION_SUCCESS,
        })
      );
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox
          bgColor="info"
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="lg"
          sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
        >
          <ModalTitle title={title} color="white" />
          <Icon sx={{ cursor: "pointer", color: "beige" }} fontSize="medium" onClick={handleClose}>
            {Icons.CROSS}
          </Icon>
        </MDBox>
        <MDBox
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          px={3}
          py={2}
          sx={{
            maxHeight: 500,
            overflowY: "scroll",
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <MDTypography
            variant="caption"
            mt={2}
            mb={1}
            sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
          >
            Category Name*
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
            name="categoryName"
            placeholder="Category Name"
            value={values.categoryName}
            onChange={handleChange}
            error={Boolean(errors.categoryName)}
            helperText={errors.categoryName}
            FormHelperTextProps={{
              sx: { marginLeft: 0, color: "#FF2E2E" },
            }}
            margin="normal"
            defaultValue={title === "Update Card" ? data.categoryName : null}
            fullWidth
          />
          <FormGroup>
            <FormControlLabel
              name="isVisibleForIncidentCard"
              label="Visible for Incident Cards?"
              control={
                <Checkbox
                  onChange={handleChangeCheckbox}
                  defaultChecked={data?.isVisibleForIncidentCard}
                  checked={values?.isVisibleForIncidentCard}
                />
              }
            />
            <FormControlLabel
              name="isVisibleForSafeCard"
              control={
                <Checkbox
                  onChange={handleChangeCheckbox}
                  defaultChecked={data?.isVisibleForSafeCard}
                  checked={values?.isVisibleForSafeCard}
                />
              }
              label="Visible for Safe Cards?"
            />
            <FormControlLabel
              name="isVisibleForUnsafeCard"
              control={
                <Checkbox
                  onChange={handleChangeCheckbox}
                  defaultChecked={data?.isVisibleForUnsafeCard}
                  checked={values?.isVisibleForUnsafeCard}
                />
              }
              label="Visible for Unsafe Cards?"
            />
          </FormGroup>
        </MDBox>
        <MDBox px={2} mb={2}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid xs={2}>
              {title === "Update Card" ? (
                <MDButton
                  variant="contained"
                  onClick={handleUpdate}
                  color="info"
                  style={{ textTransform: "none", boxShadow: "none" }}
                >
                  {loading ? ButtonTitles.UPDATE_LOADING : ButtonTitles.UPDATE}
                </MDButton>
              ) : (
                <MDButton
                  variant="contained"
                  onClick={handleSubmit}
                  color="info"
                  style={{ textTransform: "none", boxShadow: "none" }}
                >
                  {loading ? ButtonTitles.SUBMIT_LOADING : ButtonTitles.SUBMIT}
                </MDButton>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default setupCardCategoryModal;
