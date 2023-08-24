import React, { useEffect, useState } from "react";

// Material ui Components
import { Divider, Grid, Icon, IconButton, Tab, Tabs } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Custom Components
import CustomDrawer from "components/Drawer/CustomDrawer";
import Frame from "assets/images/Frame.png";
import pxToRem from "assets/theme/functions/pxToRem";
import StockHistory from "examples/Drawers/Equiupment/StockHistory";
import DataTable from "examples/Tables/DataTable";
import Pdf from "assets/images/pdf.svg";
// Redux
import { useDispatch } from "react-redux";
import { equipmentGetByIdThunk } from "redux/Thunks/Equipment";

// Constant
import { Icons, Colors, defaultData } from "utils/Constants";
import moment from "moment";

const StockHistoryList = [
  {
    srNo: "Sr. No.",
    date: "21-07-2023 10:34 am",
    orderType: "Purchases",
    quantity: "100",
    stocks: "Out",
    remarks: "Remarks",
  },
  {
    srNo: "Sr. No.",
    date: "21-07-2023 10:34 am",
    orderType: "Sales",
    quantity: "10",
    stocks: "Out",
    remarks: "Remarks",
  },
];

const equipmentDetailDrawer = ({ equipmentAnchor, equipmentId, closeDrawer, handleViewImage }) => {
  const [currentTab, setCurentTab] = useState(0);
  const [equipmentData, setEquipmentData] = useState({});
  const dispatch = useDispatch();

  const { stocksColumns, stocksRow } = StockHistory(StockHistoryList);

  useEffect(() => {
    (async () => {
      const res = await dispatch(equipmentGetByIdThunk(equipmentId));
      if (res.payload.status === 200) {
        setEquipmentData(res?.payload?.data?.data);
      }
    })();
  }, [equipmentId]);
  const productInfo = (key, value) => (
    <Grid item xs={6} lg={4} key={key.toLocaleLowerCase()}>
      <MDBox display="flex" flexDirection="column" alignItems="start" key={key}>
        <MDTypography
          sx={{
            mt: 1,
            color: "#475467",
            fontFamily: "Inter",
            fontSize: pxToRem(14),
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: pxToRem(20),
          }}
        >
          {key}
        </MDTypography>
        <MDTypography
          sx={{
            mt: 1,
            color: "var(--default-tier-brand-1, #191A51)",
            fontFamily: "Inter",
            fontSize: pxToRem(16),
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: pxToRem(20),
          }}
        >
          {value}
        </MDTypography>
      </MDBox>
    </Grid>
  );

  const equipmentDocuments = (name, url, size, endDate) => (
    <Grid item xl={5}>
      <MDBox display="flex" border="1px solid #E0E6F5" borderRadius="8px" p={1}>
        <img
          src={name && name.includes(".pdf") ? Pdf : url || Frame}
          alt="Preview"
          height="60px"
          width="60px"
          style={{
            border: "1px solid #D0D5DD",
            borderRadius: "8px",
            marginTop: "5px",
            marginLeft: "4px",
          }}
        />

        <MDBox ml={2} mt={0}>
          <MDTypography display="block" variant="caption" sx={{ textTransform: "capitalize" }}>
            {name}
          </MDTypography>
          {endDate && (
            <MDTypography display="block" variant="caption" color="text">
              {`End Data: ${moment(endDate).format(defaultData.WEB_DATE_FORMAT)}`}
            </MDTypography>
          )}
          <MDTypography display="block" variant="caption" color="text">
            {size}
          </MDTypography>
        </MDBox>
        {url && (
          <Icon
            fontSize="medium"
            sx={{ ml: "auto", cursor: "pointer" }}
            justifyContent="flex-end"
            onClick={() => handleViewImage(url)}
          >
            {Icons.VIEW}
          </Icon>
        )}
      </MDBox>
    </Grid>
  );

  return (
    <CustomDrawer defaultAnchor={equipmentAnchor}>
      {Object.keys(equipmentData).length > 0 ? (
        <>
          <MDBox
            px={pxToRem(24)}
            display="flex"
            justifyContent="start"
            alignItems="center"
            height={pxToRem(74)}
          >
            <IconButton mr={2} aria-label="fingerprint" color="info" onClick={closeDrawer}>
              {Icons.CLOSE}
            </IconButton>
            <MDTypography
              sx={{
                color: "var(--gray-900, #101828)",
                fontFamily: "Inter",
                fontSize: pxToRem(20),
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: pxToRem(28),
                textAlign: "center",
              }}
            >
              {equipmentData?.name}
            </MDTypography>
          </MDBox>
          <Divider />

          <MDBox
            mt={3}
            px={pxToRem(32)}
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent={{ xs: "center", md: "start" }}
            alignItems={{ xs: "center", md: "flex-start" }}
          >
            <img
              src={equipmentData?.equipmentImage?.[0]?.url || Frame}
              alt="frame"
              width={100}
              height={100}
            />
            <MDBox
              ml={{ xs: 0, md: pxToRem(24) }}
              display="flex"
              flexDirection="column"
              justifyContent={{ xs: "center", md: "start" }}
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <MDTypography
                variant="h4"
                fontWeight="medium"
                mb={1}
                width={{ xs: "100%", sm: "auto" }}
                textAlign={{ xs: "center", lg: "left" }}
              >
                Equipment Details
              </MDTypography>
              <Grid container spacing={2}>
                {productInfo("Name", equipmentData?.name)}
                {productInfo("Equipment Number", equipmentData?.equipmentNumber)}
                {productInfo("Serial Number", equipmentData?.serialNumber)}
                {productInfo(
                  "Price/Value",
                  equipmentData?.value
                    ? `${equipmentData?.equipmentType?.currencyUnit?.symbol} ${equipmentData?.value}`
                    : `${equipmentData?.equipmentType?.currencyUnit?.symbol} ${equipmentData?.equipmentType?.price}`
                )}
                {productInfo(
                  "Rental Price",
                  equipmentData?.equipmentType?.quantityType?.priceType === "buy"
                    ? "N/A"
                    : `${equipmentData?.equipmentType?.currencyUnit?.symbol} ${equipmentData?.equipmentType?.price}`
                )}
                {productInfo(
                  "Weight",
                  `${equipmentData?.weight} ${equipmentData?.equipmentType?.equipmentUnit?.abbreviation}`
                )}
                {productInfo("Available Stock", equipmentData?.quantity)}
                {productInfo("Type", equipmentData?.equipmentType?.type)}
                {productInfo("Category", equipmentData?.equipmentType?.equipmentCategory?.name)}
                {productInfo(
                  "Has code",
                  `${equipmentData?.equipmentType.hsCode?.name} (${equipmentData?.equipmentType.hsCode?.code})`
                )}
                {productInfo("Quantity Type", equipmentData?.equipmentType?.quantityType?.name)}
                {productInfo("Warehouse", equipmentData?.warehouse?.name)}
                {productInfo("Warehouse Location", equipmentData?.equipmentLocationInWarehouse)}
                {productInfo("Current Location", equipmentData?.equipmentCurrentLocation)}
                {productInfo("Status", equipmentData?.isActive ? "Active" : "Inactive")}
                {productInfo("QR Number", equipmentData?.qrCode)}
                {/*  */}
              </Grid>
            </MDBox>
          </MDBox>

          {/* Tabs */}
          <MDBox my={pxToRem(24)} mx={pxToRem(32)}>
            <Tabs
              value={currentTab}
              onChange={(e, newTab) => {
                setCurentTab(newTab);
              }}
              aria-label="Product detail Tabs"
              sx={{
                background: "transparent",
                width: "max-content",
                "& .css-1t4ppgo-MuiTabs-flexContainer": {
                  columnGap: pxToRem(24),
                },
              }}
            >
              <Tab
                label="Documents"
                value={0}
                sx={{
                  borderBottom: currentTab === 0 ? `2px solid #FF5E13` : "none",
                  borderRadius: 0,
                }}
              />
              <Tab
                label="Stock History"
                value={1}
                sx={{
                  borderBottom: currentTab === 1 ? `2px solid #FF5E13` : "none",
                  borderRadius: 0,
                }}
              />
            </Tabs>

            {/* Document Pannel */}
            <MDBox mt={pxToRem(24)} mx={pxToRem(32)}>
              {currentTab === 0 && (
                <Grid container spacing={2} display="flex" flexDirection="column">
                  <Grid>
                    <MDBox mb={2}>
                      <MDTypography
                        display="block"
                        variant="caption"
                        fontWeight="medium"
                        mb={1}
                        mt={1}
                      >
                        {`Certificates (${equipmentData?.certificateType?.title})`}
                      </MDTypography>
                      {equipmentDocuments(
                        equipmentData?.certificate?.name,
                        equipmentData?.certificate?.url,
                        equipmentData?.certificate?.size,
                        equipmentData?.certificateType?.endDate
                      )}
                    </MDBox>
                  </Grid>
                  <MDBox mb={2}>
                    <MDTypography
                      display="block"
                      variant="caption"
                      fontWeight="medium"
                      mb={1}
                      mt={1}
                    >
                      MSDS
                    </MDTypography>

                    <MDBox display="flex" justifyContent="space-between" flexDirection="row">
                      {equipmentData?.msds?.map((item) =>
                        equipmentDocuments(item?.name, item?.url, item?.size)
                      )}
                    </MDBox>
                  </MDBox>
                </Grid>
              )}
              {currentTab === 1 && (
                <DataTable
                  table={{ columns: stocksColumns, rows: stocksRow }}
                  backgroundColor={Colors.LIGHT_GRAY2}
                  textColor={Colors.BLACK}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 10 }}
                  showTotalEntries={false}
                  pagination={{ variant: "gradient", color: "info" }}
                  loading="fullfilled"
                />
              )}
            </MDBox>
          </MDBox>
        </>
      ) : (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "inherit" }}
        >
          {Icons.LOADING2}
        </MDBox>
      )}
    </CustomDrawer>
  );
};

export default equipmentDetailDrawer;
