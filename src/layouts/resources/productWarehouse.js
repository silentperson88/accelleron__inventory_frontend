// Material Dashboard 2 React components
import { Button, Grid, Icon, InputAdornment } from "@mui/material";
import MDBox from "components/MDBox";

// Components
import pxToRem from "assets/theme/functions/pxToRem";
import FDropdown from "components/Dropdown/FDropdown";
import DateTime from "components/DateTime/DateTime";
import FTextField from "components/Form/FTextField";

// libraries
import ReactDatePicker from "react-datepicker";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import QRCode from "qrcode.react";

// Redux
import { useSelector } from "react-redux";

// utils
import Constants, { defaultData, Icons } from "utils/Constants";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function productWarehouse({ warehouseData, setWarehouseData, updateEquipment }) {
  const location = useLocation();
  const { checkEquipmentId } = useParams();
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const ConfigData = useSelector((state) => state.config);
  useEffect(() => {
    if (checkEquipmentId) {
      const temp = { ...warehouseData };
      ConfigData?.equipmentConfig?.properties?.warehouseInfo.forEach((val) => {
        if (
          val.type === "text" ||
          val.type === "number" ||
          val.type === "date" ||
          val.type === "qr-code"
        ) {
          temp[val.id] = updateEquipment?.[val.id];
        }
        if (val.type === "options") {
          temp[val.id] =
            updateEquipment?.[val.id][Constants.MONGOOSE_ID] || updateEquipment?.[val.id];
        }
      });
      setWarehouseData({ ...temp });
    }
  }, [checkEquipmentId]);
  const downloadQRCode = () => {
    const qrComponent = document.querySelector("canvas");

    const padding = 5;

    const qrCanvas = document.createElement("canvas");
    qrCanvas.width = qrComponent.width + padding * 2;
    qrCanvas.height = qrComponent.height + padding * 2;

    const context = qrCanvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
    context.drawImage(qrComponent, padding, padding);

    const link = document.createElement("a");
    link.href = qrCanvas.toDataURL("image/png");
    link.setAttribute("download", "QR.png");
    link.click();
  };

  const printQRCode = () => {
    const canvas = document.querySelector("canvas");

    if (canvas) {
      const image = canvas.toDataURL("image/png");

      const printContainer = document.createElement("div");
      printContainer.innerHTML = `
          <html>
            <head>
              <title>Print QR Code</title>
              <style>
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #print-content,
                  #print-content * {
                    visibility: visible;
                  }
                  #print-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  #print-content img {
                    max-width: 90%;
                    max-height: 90%;
                  }
                }
              </style>
            </head>
            <body>
              <div id="print-content">
                <img src="${image}" width="200px" height="200px"/>
              </div>
            </body>
          </html>
        `;

      document.body.appendChild(printContainer);

      setTimeout(() => {
        window.print();
        document.body.removeChild(printContainer);
      }, 500);
    } else {
      console.error('Canvas element with id "#qr-code-canvas" not found');
    }
  };
  const requiredList = [
    "warehouse",
    "equipmentLocationInWarehouse",
    "equipmentLocationFromDate",
    "equipmentCurrentLocation",
    "quantity",
    "qrCode",
  ];
  const handleConfigChange = (name, value, id) => {
    if (!requiredList.includes(name)) {
      setWarehouseData((prevData) => {
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
      setWarehouseData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  const generateUUID = () => {
    const newUUID = uuidv4("input-string", uuidv4.DNS);
    setQRCodeValue(newUUID);
    handleConfigChange("qrCode", newUUID, "");
    return newUUID;
  };
  useEffect(() => {
    if (!checkEquipmentId) {
      generateUUID();
    }
    setShowQRCode(true);
  }, [location.pathname]);
  const generateQRCode = () => {
    generateUUID();
    setShowQRCode(true);
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
          Warehouse Info
        </MDTypography>
      </Grid>
      {ConfigData?.equipmentConfig?.properties?.warehouseInfo?.length > 0
        ? ConfigData?.equipmentConfig?.properties?.warehouseInfo?.map((item) => {
            const fieldValue = warehouseData[item.id] || "";
            switch (item.type) {
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
                      error={Boolean(warehouseData?.errors[item.id])}
                      helperText={warehouseData?.errors[item.id]}
                      handleChange={(e) => handleConfigChange(item?.id, e.target.value, item?.id)}
                    />
                  </Grid>
                );
              case "options":
                return (
                  <Grid item lg={item?.id === "warehouse" ? 12 : 6} sm={12} key={item.id}>
                    <FDropdown
                      label={item?.IsRequired ? `${item.title}*` : item.title}
                      menu={item?.options.map((val) => ({
                        [Constants.MONGOOSE_ID]: val?.id,
                        title: val?.title,
                      }))}
                      name={item?.id}
                      id={item?.id}
                      error={warehouseData.errors && warehouseData.errors[item.id]}
                      helperText={warehouseData.errors && warehouseData.errors[item.id]}
                      defaultValue=""
                      value={fieldValue}
                      handleChange={(e, value, id) => handleConfigChange(e, value, id)}
                    />
                  </Grid>
                );
              case "date":
                return (
                  <Grid item lg={6} sm={12} key={item.id}>
                    <MDBox sx={{ minWidth: "100%", mt: 0, mr: 1, zIndex: 9999 }} display="flex">
                      <ReactDatePicker
                        selected={
                          (warehouseData?.[item.id] &&
                            moment(warehouseData?.[item.id].split(".")[0]).toDate()) ||
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
                            item={item}
                            value={fieldValue}
                            label={`${item?.title}${item?.IsRequired ? "*" : ""}`}
                            errors={warehouseData.errors?.[item.id]}
                            helperText={warehouseData.errors?.[item.id]}
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
                      id={item?.id}
                      value={fieldValue}
                      type="number"
                      error={Boolean(warehouseData?.errors[item.id])}
                      helperText={warehouseData?.errors[item.id]}
                      handleChange={(e) => handleConfigChange(item?.id, e.target.value, item?.id)}
                    />
                  </Grid>
                );
              case "qr-code":
                return (
                  <>
                    <Grid item lg={12} sm={12}>
                      <MDTypography
                        sx={{
                          fontSize: pxToRem(24),
                          fontWeight: 600,
                          color: "#667085",
                          padding: "12px 0px",
                        }}
                      >
                        QR code
                      </MDTypography>
                    </Grid>
                    <Grid item lg={6} sm={12}>
                      <MDTypography
                        variant="caption"
                        mb={1}
                        sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
                      >
                        QR Code Number
                      </MDTypography>
                      <MDInput
                        sx={{
                          marginTop: 0,
                          "& input": {
                            fontSize: "16px",
                            color: "#667085",
                          },
                        }}
                        name={item?.id}
                        value={checkEquipmentId ? fieldValue : qrCodeValue}
                        onChange={
                          !checkEquipmentId
                            ? (e) => handleConfigChange(item?.id, e.target.value, item?.id)
                            : undefined
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {!checkEquipmentId && (
                                <Button
                                  size="medium"
                                  sx={{
                                    borderLeft: "1px solid #D0D5DD",
                                    borderRadius: "0px",
                                    height: "22px",
                                  }}
                                  onClick={generateQRCode}
                                >
                                  <Icon>{Icons.QR}</Icon>&nbsp;Regenerate
                                </Button>
                              )}
                            </InputAdornment>
                          ),
                        }}
                        placeholder={item?.hint}
                        fullWidth
                        error={Boolean(warehouseData?.errors[item.id])}
                        helperText={warehouseData?.errors[item.id]}
                      />
                    </Grid>
                    <Grid item lg={6} sm={12}>
                      <MDBox
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        {showQRCode && (
                          <QRCode
                            value={checkEquipmentId ? fieldValue : qrCodeValue}
                            size={50}
                            fgColor="#000000"
                          />
                        )}
                        <MDButton
                          variant="contained"
                          color="info"
                          style={{ textTransform: "none", boxShadow: "none", marginLeft: "16px" }}
                          onClick={downloadQRCode}
                        >
                          <Icon>{Icons.DOWNLOAD2}</Icon>&nbsp; QR
                        </MDButton>
                        <MDButton
                          variant="outlined"
                          color="info"
                          style={{ textTransform: "none", boxShadow: "none", marginLeft: "16px" }}
                          onClick={printQRCode}
                        >
                          <Icon>{Icons.PRINT}</Icon>&nbsp; QR
                        </MDButton>
                      </MDBox>
                    </Grid>
                  </>
                );
              default:
                return null;
            }
          })
        : null}
    </Grid>
  );
}

export default productWarehouse;
