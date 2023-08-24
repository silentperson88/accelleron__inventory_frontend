import { Modal, TextField } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import MDTypography from "components/MDTypography";

function Sitelocation({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox bgColor="error" p={3} textAlign="center" borderRadius="8px" variant="gradient">
          <MDTypography variant="h5" color="white" bgColor="info" fontWeight="regular">
            New Site/Location
          </MDTypography>
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
          <TextField
            sx={{ marginBottom: 2 }}
            name="hsesitename"
            label="HSE Site Name"
            margin="normal"
            fullWidth
          />
          <TextField
            sx={{ marginBottom: 2 }}
            name="iconurl"
            label="Icon URL"
            margin="normal"
            fullWidth
          />
        </MDBox>
        <MDButton variant="gradient" color="error" fullWidth>
          Add
        </MDButton>
      </MDBox>
    </Modal>
  );
}
Sitelocation.defaultProps = {
  open: "",
  handleClose: "",
};
Sitelocation.propTypes = {
  open: PropTypes.string,
  handleClose: PropTypes.string,
};
export default Sitelocation;
