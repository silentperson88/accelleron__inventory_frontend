import { Button, Grid, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sessions from "utils/Sessions";
import { resetStateThunk } from "redux/Thunks/Authentication";
import { useDispatch } from "react-redux";

function index({ openLogout, handleCloseLogout }) {
  const [loading, setLoading] = useState(false);
  const disptach = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);

    Sessions.setClear();
    navigate("/authentication/sign-in", { replace: true });
    setLoading(false);
    await disptach(resetStateThunk());
  };
  return (
    <Modal
      open={openLogout}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox sx={style}>
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderRadius="lg"
          sx={{
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            height: pxToRem(72),
            padding: "16px 16px 8px 16px",
            marginBottom: "8px",
          }}
        >
          <MDTypography sx={{ fontSize: pxToRem(20), color: "#191A51", fontWeight: "700" }}>
            Logout
          </MDTypography>
        </MDBox>
        <MDBox
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          sx={{ maxHeight: 500, paddingX: "16px" }}
        >
          <MDTypography
            fontSize="16px"
            fontWeight="400"
            lineHeight="20px"
            sx={{ color: "#475467" }}
          >
            Are you sure you want to logout?
          </MDTypography>
        </MDBox>

        <MDBox px={3} mt={2} mb={3}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Button
              variant="outlined"
              disableRipple
              sx={{
                backgroundColor: "#fff",

                marginRight: pxToRem(14),
                borderRadius: pxToRem(8),
                height: pxToRem(40),
                width: "51px",

                border: "1px solid #d0d5dd",
              }}
              onClick={handleCloseLogout}
            >
              <MDTypography
                fontSize={pxToRem(14)}
                sx={{ fontWeight: 500, fontSize: pxToRem(16), lineHeight: pxToRem(20) }}
              >
                Cancel
              </MDTypography>
            </Button>

            <Button
              variant="contained"
              style={{ boxShadow: "none", textTransform: "none" }}
              disableRipple
              sx={{
                backgroundColor: "#191a51",
                borderRadius: pxToRem(8),
                height: pxToRem(40),
                width: loading ? "100px" : "57px",
                border: "1px solid #d0d5dd",
                boxShadow: "none",
              }}
              onClick={handleLogout}
            >
              <MDTypography
                fontSize={pxToRem(14)}
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: pxToRem(14),
                  lineHeight: pxToRem(20),
                }}
              >
                {loading ? "Loading..." : "Yes"}
              </MDTypography>
            </Button>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}
export default index;
