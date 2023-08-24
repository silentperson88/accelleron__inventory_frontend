import { Grid, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function userBulkUpload({ openBulk, handleCloseBulk }) {
  return (
    <Modal
      open={openBulk}
      onClose={handleCloseBulk}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox bgColor="info" p={3} textAlign="center">
          <MDTypography variant="h5" color="white" bgColor="info" fontWeight="regular">
            Bulk Uplaod
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
          <MDTypography>Bulk Upload your Excel file containing new Staff Members.</MDTypography>
          <MDBox bgColor="#e0e0e0" borderRadius="lg">
            <MDTypography m={1}>Download Template</MDTypography>
            <MDTypography fontWeight="light" color="black" variant="body2" m={1}>
              Fill in the columns in the template format provided. Columns - Contact First Name,
              Last Name, Email, Phone, Nationality, Birth Date, Job Title, Unit Supervisor emails,
              Unit Department, Service Line, Job Grade, Access
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox px={2} mb={2}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid xs={2}>
              <MDButton variant="outlined" color="info">
                Done
                <input hidden accept="image/*" multiple type="file" />
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default userBulkUpload;
