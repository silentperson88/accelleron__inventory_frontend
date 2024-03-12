/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { useState } from "react";

function Upload({ name, company, email, vat, noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = process.env.REACT_APP_BACKEND_URL;
  const onSubmitHandle = async (file) => {
    if (file === null) {
      setError("No file selected");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    console.log(file);
    formData.append("uploadfile", file);

    try {
      const response = await fetch(
        `${url}/users/upload-file`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("please upload valid excel file");
      }
      console.log(response);

      // await fetchData();
    } catch (error) {
      setError(error?.message || "An error occurred while uploading file");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);
      await onSubmitHandle(selectedFile);
    };

    return null;

  };

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "transparent"}
      borderRadius="lg"
      p={3}
      mb={noGutter ? 0 : 1}
      mt={2}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox mb={1}>
          <MDInput
            type="file"
            name="excelFile"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            required
            fullWidth
          />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Bill
Upload.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Upload.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Upload;
