import { Grid, Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import ModalTitle from "examples/NewDesign/ModalTitle";
import { Icons } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";

function index({ openEdit, handleCloseEdit, title, children, handleRequest }) {
  return (
    <Modal
      open={openEdit}
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
          <Icon
            sx={{ cursor: "pointer", color: "beige" }}
            fontSize="medium"
            onClick={handleCloseEdit}
          >
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
        <MDBox px={2} mb={2}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid xs={2}>
              <MDButton
                variant="contained"
                color="info"
                onClick={handleRequest}
                style={{ boxShadow: "none", textTransform: "none" }}
              >
                Request
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}
export default index;
