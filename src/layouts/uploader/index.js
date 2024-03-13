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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Billing page components
import UploaderInformation from "layouts/uploader/components/UploaderInformation";

import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useEffect, useState } from "react";

function Uploader() {
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [res, setRes] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  const { columns, rows } = authorsTableData(data);

  const url = process.env.REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}/users/data`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const { success, artist } = await response.json();

      if (!success) {
        throw new Error("Failed to fetch data");
      }

      console.log(artist.length === 0);

      if (artist.length === 0) {
        setHeader([]);
        setData([]);
      };

      const requiredData = artist.map(
        (art, index) => ({
          No: index + 1,
          _id: art?._id,
          speciality: art?.speciality,
          about: art?.about,
          name: art?.name,
          email: art?.email,
        })
      );

      if (requiredData.length > 0) {
        const headers = Object.keys(requiredData[0]);
        setHeader(headers);
        setData(requiredData);
      }
    } catch (error) {
      setError(error?.message || "An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (res) {
      fetchData()
    }
  }, [res]);

  console.log(data)
  console.log(header)

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <UploaderInformation setRes={setRes} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      {/* table */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Excel Sheet
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Uploader;
