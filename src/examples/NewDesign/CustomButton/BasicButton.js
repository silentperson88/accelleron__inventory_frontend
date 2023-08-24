import { Button, Icon } from "@mui/material";
import pxToRem from "assets/theme/functions/pxToRem";
import MDTypography from "components/MDTypography";
import React from "react";

function basicButton({
  title = "",
  icon,
  background,
  color,
  action,
  disabled = false,
  border = false,
  borderColor = "var(--gray-300, #D0D5DD)",
}) {
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
        paddingX: pxToRem(16),
        border: border ? `1px solid ${borderColor}` : "none",
      }}
      onClick={() => action()}
    >
      <Icon fontSize={pxToRem(14)} sx={{ color }}>
        {icon}
      </Icon>
      {title && (
        <MDTypography
          fontSize={pxToRem(14)}
          sx={{ color, marginLeft: pxToRem(8.6), lineHeight: pxToRem(20) }}
        >
          {title}
        </MDTypography>
      )}
    </Button>
  );
}

export default basicButton;
