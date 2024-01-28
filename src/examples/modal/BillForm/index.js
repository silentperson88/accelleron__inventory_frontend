import { Grid, Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ModalTitle from "examples/NewDesign/ModalTitle";
import pxToRem from "assets/theme/functions/pxToRem";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { utilityBillForm } from "redux/Thunks/Config";
import FTextField from "components/Form/FTextField";
import ReactDatePicker from "react-datepicker";
import DateTime from "components/DateTime/DateTime";
import ConfigDropdown from "components/Dropdown/ConfigDropdown";

import Constants, { defaultData, Icons } from "utils/Constants";
import moment from "moment";
import payBill from "redux/Thunks/BillPayment";
import { openSnackbar } from "redux/Slice/Notification";

function index({ open, handleClose, title, actionButton = "Submit" }) {
  const [billForm, setBillForm] = useState({});
  const [billBody, setBillBody] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validate = () => {
    let temp = {};
    temp = { ...temp, ...errors };

    billForm?.screens?.properties?.forEach((item) => {
      const value = billBody[item.id];
      if (item?.IsRequired && value === "") {
        temp[item.id] = "This field is required";
      }
    });
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleChange = (name, value) => {
    setBillBody({ ...billBody, [name]: value });
  };

  const handlePay = async () => {
    if (validate()) {
      const res = await dispatch(payBill(billBody));
      if (res.payload.status === 200) {
        handleClose();
        dispatch(
          openSnackbar({
            message: res.payload.data.data.message,
            notificationType: Constants.NOTIFICATION_SUCCESS,
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: Constants.SOMETHING_WENT_WRONG,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
      const tempType = title.split(" ");
      const type = `${tempType[0].charAt(0).toUpperCase()}${tempType[0].slice(1)}`;
      const res = await dispatch(utilityBillForm(type));
      setBillForm(res.payload.data.data);
    })();
  }, [title]);

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
          mb={1}
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
          sx={{
            maxHeight: 500,
            overflowY: "scroll",
            overflowX: "hidden",
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {Object.keys(billForm).length > 0 ? (
            <MDBox
              sx={{
                width: "100%",
                gap: pxToRem(16),
              }}
            >
              <Grid container spacing={2}>
                {billForm?.screens.properties.map((item) => {
                  switch (item.type) {
                    case "text":
                    case "number":
                    case "email":
                      return (
                        <Grid mb={1} item xs={12}>
                          <FTextField
                            label={item?.IsRequired ? `${item.title}*` : item.title}
                            placeholder={item.hint}
                            name={item.id}
                            id={item.id}
                            type={item.type}
                            width="100%"
                            error={Boolean(errors?.[item.id])}
                            helperText={errors?.[item.id]}
                            value={billBody?.[item.id]}
                            handleChange={(e) => handleChange(item.id, e.target.value)}
                          />
                        </Grid>
                      );
                    case "date":
                      return (
                        <Grid item xs={12}>
                          <ReactDatePicker
                            selected=""
                            onChange={(date) =>
                              handleChange(
                                item.id,
                                moment(date)
                                  .format(defaultData.DATABASE_24_HOURS_FORMAT)
                                  .toString(),
                                item.questionId ? item.questionId : item.id
                              )
                            }
                            customInput={
                              <DateTime
                                item={item}
                                error={Boolean(errors?.[item.id])}
                                label={`${item?.title}${item?.IsRequired ? "*" : ""}`}
                                width={344}
                              />
                            }
                            dateFormat={defaultData.REACTDATETIMEPICKER_24_HOURS_FORMAT}
                          />
                        </Grid>
                      );

                    case "dropdown":
                      return (
                        <Grid mb={1} item xs={12}>
                          <ConfigDropdown
                            label={item?.IsRequired ? `${item.title}*` : item.title}
                            name={item?.id}
                            id={item?.id}
                            value={billBody?.[item.id]}
                            handleChange={handleChange}
                            menu={item.options}
                            error={Boolean(errors?.[item.id])}
                            helperText={errors?.[item.id]}
                            minWidth={pxToRem(200)}
                          />
                        </Grid>
                      );
                    default:
                      return null;
                  }
                })}
              </Grid>
            </MDBox>
          ) : (
            <MDBox
              py={5}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%" }}
            >
              {Icons.LOADING2}
            </MDBox>
          )}
        </MDBox>
        <MDBox px={2} mb={2} mr={1}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item xs={0}>
              <MDButton
                variant="contained"
                color="info"
                onClick={handlePay}
                style={{ boxShadow: "none", textTransform: "none" }}
              >
                {actionButton}
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}
export default index;
