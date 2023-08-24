import { Modal, TextField } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";

function index({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox bgColor="info" p={3} textAlign="center" borderRadius="8px">
          <MDTypography variant="h4" color="white" bgColor="info" fontWeight="regular">
            Update Additional Detail
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
                name="secondaryemail"
                label="Secondary Email"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="mobile"
                label="Mobile"
                margin="normal"
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="nationality"
                label="Nationality"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="motherlang"
                label="Mother Language"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="birthdate"
                label="Birth Date"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ marginBottom: 2 }}
                name="placeofbirth"
                label="Place of Birth"
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

export default index;
