import React, { useEffect, useState } from "react";
// Material Dashboard 2 React components
import { Grid } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Components
import pxToRem from "assets/theme/functions/pxToRem";
import DateTime from "components/DateTime/DateTime";
import FDropdown from "components/Dropdown/FDropdown";
import ImageUpload from "components/ImageUpload/imageUpload";
import FTextField from "components/Form/FTextField";
// utils
import Constants, { defaultData } from "utils/Constants";

// libraries
import moment from "moment";
import ReactDatePicker from "react-datepicker";

// Redux
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function productDocument({ data, setData, updateEquipment }) {
  const { checkEquipmentId } = useParams();
  const [checkFieldLength, setCheckFieldLength] = useState("");
  const ConfigData = useSelector((state) => state.config);
  const requiredList = [
    "photo",
    "certificate",
    "msds",
    "certificateValidateDate",
    "rentalPrice",
    "certificateType",
  ];
  useEffect(() => {
    if (checkEquipmentId) {
      const temp = { ...data };
      ConfigData?.equipmentConfig?.properties?.imageSpecificationAndPrice.forEach((val) => {
        if (
          val.type === "text" ||
          val.type === "number" ||
          val.type === "images" ||
          val.type === "date"
        ) {
          temp[val.id] = updateEquipment?.[val.id];
        }
        if (val.type === "options" && val.parentFieldId === "") {
          temp[val.id] = updateEquipment?.[val.id][Constants.MONGOOSE_ID];
        }
      });
      setData({ ...temp });
    }
  }, [checkEquipmentId]);
  useEffect(() => {
    if (ConfigData.equipmentLoading === "fulfilled") {
      setCheckFieldLength(ConfigData?.equipmentConfig?.properties?.equipment.length);
    }
  }, [ConfigData.equipmentLoading]);
  const handleConfigChange = (name, value, id) => {
    if (!requiredList.includes(name)) {
      setData((prevData) => {
        const temp = { ...prevData };
        if (!temp.dynamicFields) {
          temp.dynamicFields = [];
        }
        const index = temp.dynamicFields.findIndex((val) => val.fieldId === id);
        if (index >= 0 && value !== "") {
          temp.dynamicFields[index].value = [value];
        } else if (index >= 0 && value === "") {
          temp.dynamicFields.splice(index, 1);
        } else {
          const dynamicFieldValueObject = {
            title: name,
            value: [value],
            fieldId: id,
          };
          temp.dynamicFields.push(dynamicFieldValueObject);
        }
        return temp;
      });
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleImageChange = (name, imageValues) => {
    if (Array.isArray(imageValues)) {
      const imageInfoArray = imageValues.map((item) => ({
        url: item.url,
        size: item.size,
        name: item.name,
      }));

      setData((prevData) => ({
        ...prevData,
        [name]: name === "certificate" ? imageInfoArray[0] : imageInfoArray,
      }));
    } else if (imageValues) {
      const imageInfo = {
        url: imageValues.url,
        size: imageValues.size,
        name: imageValues.name,
      };

      setData((prevData) => ({
        ...prevData,
        [name]: [imageInfo],
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: [],
      }));
    }
  };

  const handleImageCancel = (fieldName, updatedImageUrl) => {
    const newImageUrlArray = updatedImageUrl || data[fieldName];

    const filteredImageUrlArray = newImageUrlArray.filter((img) => img.url !== "Frame");

    setData((prevData) => ({
      ...prevData,
      [fieldName]: filteredImageUrlArray,
    }));
  };
  return (
    <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
      <Grid item xs={12}>
        <MDTypography
          sx={{
            fontSize: pxToRem(24),
            fontWeight: 600,
            color: "#667085",
            padding: "12px 0px",
          }}
        >
          Equipment Documents
        </MDTypography>
      </Grid>
      {ConfigData?.equipmentConfig?.properties?.imageSpecificationAndPrice?.length > 0
        ? ConfigData?.equipmentConfig?.properties?.imageSpecificationAndPrice?.map((item) => {
            const obj = Object.keys(data).includes(item.id);
            const fieldValue = obj ? data?.[item.id] : "";
            switch (item.type) {
              case "images":
                return (
                  <Grid item lg={6} sm={12} key={item.id}>
                    <ImageUpload
                      label={item?.IsRequired ? `${item.title}*` : item.title}
                      name={item?.id}
                      onImageUpload={(imageValues) => handleImageChange(item?.id, imageValues)}
                      onImageCancel={(updatedImageUrl) =>
                        handleImageCancel(item?.id, updatedImageUrl)
                      }
                      {...(fieldValue !== "" && {
                        data: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
                      })}
                      type={item?.type}
                      formats={["image/jpeg", "image/jpg", "image/png", "application/pdf"]}
                      maxImageCount={item?.id?.includes("certificate") ? 1 : 3}
                      error={Boolean(data?.errors[item.id])}
                      helperText={data?.errors[item.id]}
                    />
                  </Grid>
                );
              case "options":
                return (
                  <Grid item lg={checkFieldLength % 2 === 0 ? 6 : 12} sm={12} key={item.id}>
                    <FDropdown
                      label={item?.IsRequired ? `${item.title}*` : item.title}
                      menu={item?.options.map((val) => ({
                        [Constants.MONGOOSE_ID]: val?.id,
                        title: val?.title,
                      }))}
                      value={fieldValue}
                      name={item?.id}
                      id={item?.id}
                      disabled={item?.parentFieldId !== ""}
                      handleChange={(e, value, id) => handleConfigChange(e, value, id)}
                      defaultValue=""
                      error={Boolean(data?.errors[item.id])}
                      helperText={data?.errors[item.id]}
                    />
                  </Grid>
                );
              case "text":
                return (
                  <Grid item lg={6} sm={12} key={item.id}>
                    <FTextField
                      label={item?.IsRequired ? `${item.title}*` : item.title}
                      placeholder={item?.hint}
                      name={item?.id}
                      id={item?.id}
                      type="text"
                      value={fieldValue}
                      error={Boolean(data?.errors[item.id])}
                      helperText={data?.errors[item.id]}
                      handleChange={(e) => handleConfigChange(item?.id, e.target.value, item?.id)}
                    />
                  </Grid>
                );
              case "date":
                return (
                  <Grid item lg={6} sm={12} key={item.id}>
                    <MDBox sx={{ minWidth: "100%", mt: 0, mr: 1, zIndex: 9999 }} display="flex">
                      <ReactDatePicker
                        selected={
                          (data?.[item.id] && moment(data?.[item.id].split(".")[0]).toDate()) ||
                          null
                        }
                        onChange={(date) =>
                          handleConfigChange(
                            item.id,
                            moment(date).format(defaultData.DATABSE_DATE_FORMAT).toString(),
                            item.questionId ? item.questionId : item.id
                          )
                        }
                        customInput={
                          <DateTime
                            value={fieldValue}
                            item={item}
                            label={`${item?.title}${item?.IsRequired ? "*" : ""}`}
                            errors={data.errors?.[item.id]}
                            helperText={data.errors?.[item.id]}
                            placeholder="mm/dd/yyyy"
                          />
                        }
                        placeholderText="mm/dd/yyyy"
                        dateFormat={defaultData.REACTDATETIMEPICKER_DATE_FORMAT}
                      />
                    </MDBox>
                  </Grid>
                );
              case "number":
                return (
                  <Grid item lg={6} sm={12} key={item.id}>
                    <FTextField
                      label={item?.IsRequired ? `${item.title}*` : item.title}
                      placeholder={item?.hint}
                      name={item?.id}
                      value={fieldValue}
                      id={item?.id}
                      type="number"
                      error={Boolean(data?.errors[item.id])}
                      helperText={data?.errors[item.id]}
                      handleChange={(e) => handleConfigChange(item?.id, e.target.value, item?.id)}
                    />
                  </Grid>
                );

              default:
                return null;
            }
          })
        : null}
    </Grid>
  );
}

export default productDocument;
