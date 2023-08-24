import React, { useState } from "react";

// Material ui Components
import MDBox from "components/MDBox";
import { Tab, Tabs } from "@mui/material";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import CustomButton from "examples/NewDesign/CustomButton";
import DataTable from "examples/Tables/DataTable";
import OrderRequestData from "layouts/wfmwizard/Warehouse/data/OrderRequestData";
import pxToRem from "assets/theme/functions/pxToRem";

// Cosntants
import { Colors, Icons, ButtonTitles, PageTitles, FeatureTags } from "utils/Constants";
import { Feature } from "flagged";

const StockHistoryList = [
  {
    srNo: "Sr. No.",
    orderId: "125484121",
    raisedBy: "John",
    quantity: 100,
    requestedEquipment: [
      {
        name: "Microscope",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/0jxwzaKdBdciQxh_microscope.png",
        requestedQuantity: 10,
      },
      {
        name: "Tape",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/a47RPxqLaNAS92U_tape.jpg",
        requestedQuantity: 50,
      },
      {
        name: "Megger",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/NFxbCI5faGygmOl_megger.png",
        requestedQuantity: 70,
      },
      {
        name: "Microscope2",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/NFxbCI5faGygmOl_megger.png",
        requestedQuantity: 400,
      },
      {
        name: "Microscope3",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/0jxwzaKdBdciQxh_microscope.png",
        requestedQuantity: 2,
      },
      {
        name: "Microscope4",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/0jxwzaKdBdciQxh_microscope.png",
        requestedQuantity: 30,
      },
      {
        name: "Tape",
        url: "https://reynard-dev-fb469d2.sfo3.cdn.digitaloceanspaces.com/images/images/a47RPxqLaNAS92U_tape.jpg",
        requestedQuantity: 1,
      },
    ],
    reqItems: 50,
    availStock: 100,
    location: "Rotterdam",
  },
];

const tabsList = ["Pending", "Approved", "Rejected", "On Site", "All"];

function OrderRequests() {
  const [currentTab, setCurentTab] = useState(0);

  const { orderColumns, orderRow } = OrderRequestData(StockHistoryList);

  return (
    <DashboardLayout>
      <MDBox>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="space-between">
          <PageTitle title={PageTitles.ORDER_REQUEStS} />
          <CustomButton
            key="equipment-sample-file-export"
            title={ButtonTitles.NEW_REQUEST}
            icon={Icons.NEW}
            background={Colors.PRIMARY}
            color={Colors.WHITE}
          />
        </MDBox>
      </MDBox>
      <Feature name={FeatureTags.WAREHOUSE}>
        <MDBox
          my={pxToRem(24)}
          sx={{
            backgroundColor: Colors.WHITE,
          }}
        >
          <MDBox
            mx={pxToRem(32)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexShrink: 0,
              borderBottom: `${pxToRem(2)} solid #EAECF0`,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={(e, newTab) => {
                setCurentTab(newTab);
              }}
              aria-label="Product detail Tabs"
              sx={{
                paddingY: pxToRem(0),
                background: "transparent",
                width: "max-content",
                borderRadius: 0,
                "& .css-1t4ppgo-MuiTabs-flexContainer": {
                  columnGap: pxToRem(26),
                },
              }}
            >
              {tabsList.map((tab, index) => (
                <Tab
                  key={tab}
                  label={tab}
                  value={index}
                  sx={{
                    paddingY: pxToRem(14),
                    paddingX: pxToRem(24),
                    borderBottom: currentTab === index ? `2px solid ${Colors.PRIMARY}` : "none",
                    borderRadius: 0,
                    color: `${currentTab === 0 ? "red" : "yellow"}`,
                    fontFamily: "Inter",
                    fontSize: pxToRem(18),
                    fontStyle: "normal",
                    fontWeight: `${currentTab === index ? "600" : null}`,
                    lineHeight: pxToRem(24),
                  }}
                />
              ))}
            </Tabs>
          </MDBox>

          <MDBox mt={pxToRem(24)}>
            <DataTable
              table={{ columns: orderColumns, rows: orderRow }}
              isSorted={false}
              entriesPerPage={{ defaultValue: 10 }}
              showTotalEntries={false}
              loading="fullfilled"
            />
          </MDBox>
        </MDBox>
      </Feature>
    </DashboardLayout>
  );
}

export default OrderRequests;
