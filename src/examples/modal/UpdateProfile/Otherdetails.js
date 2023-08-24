import { Modal, TextField } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

function Otherdetails({ openOther, handleCloseOther }) {
  return (
    <Modal
      open={openOther}
      onClose={handleCloseOther}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox bgColor="info" p={3} textAlign="center" borderRadius="8px">
          <MDTypography variant="h4" color="white" bgColor="info" fontWeight="regular">
            Update Other Details
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
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="maritalstatus"
                label="Marital Status"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="ssn"
                label="SSN"
                margin="normal"
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="bllodgroup"
                label="Blood Group"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="allergies"
                label="Allergies"
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
        </MDBox>
        <MDButton variant="contained" color="info" fullWidth>
          Update
        </MDButton>
      </MDBox>
    </Modal>
  );
}
Otherdetails.defaultProps = {
  openOther: "",
  handleCloseOther: "",
};
Otherdetails.propTypes = {
  openOther: PropTypes.string,
  handleCloseOther: PropTypes.string,
};
export default Otherdetails;
