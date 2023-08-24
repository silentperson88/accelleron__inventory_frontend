import MDTypography from "components/MDTypography";
import React from "react";
import { ModalTitle } from "../style/styles";

function index({ title, color, fontSize }) {
  return (
    <MDTypography
      sx={(theme) => ({ color: { color }, fontSize: { fontSize }, ...ModalTitle(theme) })}
    >
      {title}
    </MDTypography>
  );
}

export default index;
