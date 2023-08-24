import { Grid, Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ModalTitle from "examples/NewDesign/ModalTitle";
import pxToRem from "assets/theme/functions/pxToRem";
import { Icons } from "utils/Constants";

function basicModal({
  open,
  handleClose,
  title,
  children,
  actionButton,
  handleAction,
  minWidth = 700,
}) {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={{ ...style, minWidth }}>
        <MDBox
          bgColor="info"
          p={3}
          mb={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
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
          {children}
        </MDBox>
        <MDBox px={2} mb={2} mr={1}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item xs={0}>
              <MDButton
                variant="contained"
                color="info"
                onClick={handleAction}
                style={{ textTransform: "none", boxShadow: "none" }}
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
export default basicModal;
