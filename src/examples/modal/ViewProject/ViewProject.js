import { Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import ModalTitle from "examples/NewDesign/ModalTitle";
import { Icons } from "utils/Constants";
import pxToRem from "assets/theme/functions/pxToRem";

function index({ openProjectList, handleCloseProjectList, title, children }) {
  return (
    <Modal
      open={openProjectList}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={{ ...style, maxWidth: 900 }}>
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
            onClick={handleCloseProjectList}
          >
            {Icons.CROSS}
          </Icon>
        </MDBox>
        <MDBox
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={4}
          sx={{
            maxHeight: 500,
            overflowY: "scroll",
            overflowX: "scroll",
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {children}
        </MDBox>
      </MDBox>
    </Modal>
  );
}
export default index;
