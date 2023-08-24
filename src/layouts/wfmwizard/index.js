import { Divider, Grid, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import PageTitle from "examples/NewDesign/PageTitle";
import { PageTitles } from "utils/Constants";
import { useSelector } from "react-redux";

function index() {
  const { cards = [] } = useSelector((state) => state.setting);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageTitle title={PageTitles.SETTINGS} color="#101828" />
      <Divider sx={{ marginTop: 3 }} />
      <MDBox py={3} mt={3}>
        <Grid container spacing={3} sx={{ display: "flex" }}>
          {cards
            .filter((val) => val.isVisible)
            .map((val) => (
              <Grid item xs={12} sm={6} md={6} lg={4} sx={{ display: "flex" }}>
                <MDBox mb={1.5} sx={{ flex: "1 1 auto" }}>
                  <Card
                    sx={{
                      boxShadow: "none",
                      border: "1px solid #E0E6F5",
                      minHeight: "280px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <MDBox display="flex" pt={1} px={2}>
                      <MDBox
                        bgColor={val.logoBgr}
                        borderRadius="xl"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="4rem"
                        height="4rem"
                        p="1rem"
                        mt={-3}
                      >
                        <Icon fontSize="medium">
                          <img src={val.logo} alt="complex" />
                        </Icon>
                      </MDBox>
                      <MDBox flexGrow={1} textAlign="right" lineHeight={1.25} p={1}>
                        <MDTypography variant="h4" fontWeight="bold" sx={{ color: "#191D31" }}>
                          {val.cardTitle}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox mt={2} mb={2} flexGrow={1}>
                      <List>
                        {val.menu.length > 0 ? (
                          val.menu
                            .filter((item) => item.isVisible)
                            .map((item) => (
                              <ListItem
                                disablePadding
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="comments"
                                    sx={{ marginRight: 2 }}
                                  >
                                    {item.icon}
                                  </IconButton>
                                }
                              >
                                <ListItemButton component={Link} to={item.link}>
                                  <ListItemText>
                                    <MDTypography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ color: "#667085" }}
                                    >
                                      {item.menuTitle}
                                    </MDTypography>
                                  </ListItemText>
                                </ListItemButton>
                              </ListItem>
                            ))
                        ) : (
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemText>
                                <MDTypography variant="body2" gutterBottom>
                                  Coming Soon....
                                </MDTypography>
                              </ListItemText>
                            </ListItemButton>
                          </ListItem>
                        )}
                      </List>
                    </MDBox>
                  </Card>
                </MDBox>
              </Grid>
            ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
export default index;
