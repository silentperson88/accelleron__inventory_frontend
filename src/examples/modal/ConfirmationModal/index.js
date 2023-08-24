import { Grid, Icon, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import ModalTitle from "examples/NewDesign/ModalTitle";
import { ButtonTitles, Icons } from "utils/Constants";

function index({ open, handleClose, title, handleAction }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [open]);

  const handleApproveReject = () => {
    setLoading(true);
    const data = {
      action: title === "Approve Permission" ? "approve" : "reject",
      reason,
    };
    handleAction(data);
  };
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox
          key="box"
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
          py={2}
          sx={{ maxHeight: 500 }}
        >
          <MDTypography>
            {title === "Approve Permission"
              ? "Are you sure you want to approve permission?"
              : "Are you sure you want to reject permission?"}
          </MDTypography>
          {title === "Reject Permission" ? (
            <TextField
              name="reason"
              label="Comment"
              multiline
              rows={4}
              onChange={(e) => setReason(e.target.value)}
            />
          ) : null}
        </MDBox>
        <MDBox px={2} mb={2}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item xs={2}>
              {title === "Approve Permission" ? (
                <MDButton variant="contained" color="info" onClick={handleApproveReject}>
                  {!loading ? ButtonTitles.APPROVE_LICENSE : ButtonTitles.LOADING}
                </MDButton>
              ) : (
                <MDButton variant="contained" color="info" onClick={handleApproveReject}>
                  {!loading ? ButtonTitles.REJECT_LICENSE : ButtonTitles.LOADING}
                </MDButton>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}
export default index;
