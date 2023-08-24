import MDTypography from "components/MDTypography";
import React from "react";
import PageTitle from "../style/styles";

function index({ title }) {
  return (
    <MDTypography sx={(theme) => ({ color: "#101828", ...PageTitle(theme) })}>{title}</MDTypography>
  );
}

export default index;
