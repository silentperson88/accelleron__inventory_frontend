import React, { useEffect, useState } from "react";

// Material Components
import { Divider, Grid, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import { styled } from "@mui/material/styles";

// Custom components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import PageTitle from "examples/NewDesign/PageTitle";
import FTextField from "components/Form/FTextField";
import ConfigDropdown from "components/Dropdown/ConfigDropdown";

// Utils
import Constants, { FeatureTags, Icons, defaultData } from "utils/Constants";

// Material Dashboard 2 React helper functions
import { useDispatch, useSelector } from "react-redux";

// 3rd party lib
import { Feature } from "flagged";
import { useParams } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import DateTime from "components/DateTime/DateTime";
import loanConfigThunk from "redux/Thunks/LoanFormConfig";

const StyledMDBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),

  borderRadius: theme.spacing(1),
  border: "1px solid #E0E6F5",
  background: "var(--base-white, #FFF)",

  /* Shadow/sm */
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",

  padding: theme.spacing(`${pxToRem(30)} ${pxToRem(200)}`), // Default padding for all breakpoints
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(100)}`), // Adjust padding for small screens and below
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(50)}`), // Adjust padding for small screens and below
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(`${pxToRem(30)} ${pxToRem(0)}`), // Adjust padding for extra-small screens
  },
}));

// disable eslint for this line

function index() {
  const [form, setForm] = useState({});
  const dispatch = useDispatch();
  const loanSlice = useSelector((state) => state.loan);
  const { formIndex } = useParams();

  //   const navigate = useNavigate();

  useEffect(() => {
    if (loanSlice.loading === Constants.FULFILLED) {
      setForm(loanSlice.screens[formIndex].screensInfo);
    } else if (loanSlice.loading === Constants.IDLE) dispatch(loanConfigThunk());
  }, [loanSlice]);

  return (
    <DashboardLayout xPadding={0}>
      <MDBox px={3}>
        <DashboardNavbar />
        <PageTitle title="Form" />
        <Divider sx={{ marginTop: 2 }} />
      </MDBox>
      <Feature name={FeatureTags.LOAN_FORM}>
        <MDBox px={3}>
          <StyledMDBox>
            <MDBox
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: pxToRem(16),
              }}
            >
              <MDTypography
                sx={{
                  width: "100%",
                  color: "#667085",
                  fontFamily: "Inter",
                  fontSize: 20,
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: pxToRem(16),
                  textTransform: "capitalize",
                  textAlign: "center",
                }}
              >
                {/* {formType.replaceAll("-", " ")} */}
                ww
              </MDTypography>
              {form && Object.keys(form).length > 0 ? (
                <MDBox
                  sx={{
                    width: "100%",
                    gap: pxToRem(16),
                  }}
                >
                  <Grid container spacing={2}>
                    {form.properties.map((item) => {
                      switch (item.type) {
                        case "text":
                        case "number":
                        case "email":
                          return (
                            <Grid mb={1} item xs={12}>
                              <FTextField
                                label={item?.IsRequired ? `${item.title}*` : item.title}
                                placeholder={item.hint}
                                name={item.id}
                                id={item.id}
                                type={item.type}
                                width="100%"
                                // error={Boolean(warehouseErrors?.warehouseName)}
                                // helperText={warehouseErrors?.warehouseName}
                                // value={warehouseBody?.warehouseName}
                                // handleChange={handleChange}
                              />
                            </Grid>
                          );
                        case "date":
                          return (
                            <Grid item xs={12}>
                              <ReactDatePicker
                                selected=""
                                // onChange={(date) =>
                                //   handleChange(
                                //     item.id,
                                //     moment(date)
                                //       .format(defaultData.DATABASE_24_HOURS_FORMAT)
                                //       .toString(),
                                //     item.questionId ? item.questionId : item.id
                                //   )
                                // }
                                customInput={
                                  <DateTime
                                    item={item}
                                    // error={Boolean(warehouseErrors?.warehouseName)}
                                    label={`${item?.title}${item?.IsRequired ? "*" : ""}`}
                                    width={344}
                                  />
                                }
                                dateFormat={defaultData.REACTDATETIMEPICKER_24_HOURS_FORMAT}
                              />
                            </Grid>
                          );

                        case "dropdown":
                          return (
                            <Grid mb={1} item xs={12}>
                              <ConfigDropdown
                                label={item?.IsRequired ? `${item.title}*` : item.title}
                                name={item?.id}
                                id={item?.id}
                                value=""
                                // handleChange={handleChange}
                                menu={item.options}
                                // error={Boolean(warehouseErrors?.warehouseName)}
                                // helperText={warehouseErrors?.warehouseName}
                                minWidth={pxToRem(565)}
                              />
                            </Grid>
                          );
                        default:
                          return null;
                      }
                    })}
                  </Grid>
                </MDBox>
              ) : (
                <Grid container spacing={2}>
                  <MDBox py={5} display="flex" justifyContent="center" alignItems="center">
                    {Icons.LOADING2}
                  </MDBox>
                </Grid>
              )}
            </MDBox>
          </StyledMDBox>

          <MDBox
            sx={{
              marginTop: 3,
              backgroundColor: "#fff",
              height: "71px",
              padding: "12px 32px 16px 32px",
              border: "1px solid #E0E6F5",
            }}
          >
            {/* <MDBox sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {updateWarehouse && (
                <MDButton
                  variant="outlined"
                  color="info"
                  style={{ textTransform: "none", boxShadow: "none" }}
                  sx={{ marginRight: "16px" }}
                  onClick={handleCancel}
                >
                  {ButtonTitles.CANCEL}
                </MDButton>
              )}
              <MDButton
                variant="contained"
                color="info"
                style={{ textTransform: "none", boxShadow: "none" }}
                onClick={handleAction}
                disabled
              >
                {(!loading && !updateWarehouse && ButtonTitles.SUBMIT) ||
                  (loading && !updateWarehouse && ButtonTitles.SUBMIT_LOADING) ||
                  (!loading && updateWarehouse && ButtonTitles.UPDATE) ||
                  (loading && updateWarehouse && ButtonTitles.UPDATE_LOADING)}
              </MDButton>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Feature>
    </DashboardLayout>
  );
}

export default index;
