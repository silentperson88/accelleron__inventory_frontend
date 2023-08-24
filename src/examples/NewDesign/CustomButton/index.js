import { useTheme } from "@emotion/react";
import { Button, Icon, useMediaQuery } from "@mui/material";
import pxToRem from "assets/theme/functions/pxToRem";
import MDTypography from "components/MDTypography";
import React from "react";

function index({
  title,
  icon,
  width,
  background,
  color,
  openModal,
  disabled = false,
  border = false,
}) {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Button
      disableRipple
      disabled={disabled}
      sx={{
        marginLeft: pxToRem(16),
        backgroundColor: background,
        borderRadius: pxToRem(8),
        "&:hover": {
          backgroundColor: background,
        },
        height: pxToRem(40),
        width: { width },
        paddingX: pxToRem(16),
        border: border ? `1px solid ${color}` : "none",
        marginBottom: (md && 0) || (sm && !md && pxToRem(16)),
      }}
      onClick={() => openModal(true)}
    >
      <Icon fontSize={pxToRem(14)} sx={{ color }}>
        {icon}
      </Icon>
      <MDTypography
        fontSize={pxToRem(14)}
        sx={{ color, marginLeft: pxToRem(8.6), lineHeight: pxToRem(20) }}
      >
        {title}
      </MDTypography>
    </Button>
  );
}

export default index;
