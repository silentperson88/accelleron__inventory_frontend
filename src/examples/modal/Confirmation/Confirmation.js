import { Button, Grid, Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React, { useEffect, useState } from "react";
import pxToRem from "assets/theme/functions/pxToRem";
import { Icons, ButtonTitles } from "utils/Constants";

function confirmation({
  open,
  title,
  message,
  handleClose,
  handleAction,
  negativeButton = ButtonTitles.NEGATIVE_BUTTON,
  positiveButton = ButtonTitles.POSITIVE_BUTTON,
  positiveLoadingButton = ButtonTitles.POSITIVE_LOADING_BUTTON,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [open]);
  const handlePositiveAction = () => {
    setLoading(true);
    handleAction();
  };
  return (
    <Modal
      open={open}
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
            {title}
          </MDTypography>
          <Icon sx={{ cursor: "pointer", color: "beige" }} fontSize="medium" onClick={handleClose}>
            {Icons.CROSS}
          </Icon>
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
            {message}
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
              onClick={handleClose}
            >
              <MDTypography
                fontSize={pxToRem(14)}
                sx={{ fontWeight: 500, fontSize: pxToRem(16), lineHeight: pxToRem(20) }}
              >
                {negativeButton}
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
              onClick={handlePositiveAction}
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
                {loading ? positiveLoadingButton : positiveButton}
              </MDTypography>
            </Button>
          </Grid>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default confirmation;
