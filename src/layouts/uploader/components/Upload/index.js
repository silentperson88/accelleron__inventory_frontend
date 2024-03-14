// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { useState } from "react";

function upload({ setRes }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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
    formData.append("uploadfile", file);

    try {
      const response = await fetch(`${url}/upload-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("please upload valid excel file");
      }

      setRes(true);
    } catch (error) {
      setError(error?.message || "An error occurred while uploading file");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile !== null) {
      await onSubmitHandle(selectedFile);
    }

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
      mb={1}
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

export default upload;
