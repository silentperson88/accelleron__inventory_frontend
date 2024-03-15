import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";

// Custom Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PageTitle from "examples/NewDesign/PageTitle";
import SafetyCardForm from "examples/modal/SafetyCardForm/SafetyCardForm";

// Constant
import Constants, { PageTitles, defaultData } from "utils/Constants";

// Redux component
import MasterCard from "examples/Cards/MasterCard";
import { Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import loanConfigThunk from "redux/Thunks/LoanFormConfig";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";

// Logos
import perosnalLoan from "assets/images/icons/personal-loan.png";
import carLoan from "assets/images/icons/car-loan.png";
import homeLoan from "assets/images/icons/home-loan.png";
import education from "assets/images/icons/education.png";
import creditCardLoan from "assets/images/icons/credit-card.png";
import bussinessLoan from "assets/images/icons/loan-against-property.png";

function ProfileForm() {
  const [open, setOpen] = useState({
    open: false,
    screenIndex: 0,
    cardType: "Incident",
    bgColor: "#191A51",
  });
  const loanSlice = useSelector((state) => state.loan);
  const cardColor = ["primary", "secondary", "info", "success", "warning", "error"];
  const productLogos = [
    {
      id: defaultData.CREDIT_CARD_SCREEN_ID,
      logo: creditCardLoan,
    },
    {
      id: defaultData.PERSONAL_LOAN_SCREEN_ID,
      logo: perosnalLoan,
    },
    {
      id: defaultData.BUSINESS_LOAN_SCREEN_ID,
      logo: bussinessLoan,
    },
    {
      id: defaultData.CAR_LOAN_SCREEN_ID,
      logo: carLoan,
    },
    {
      id: defaultData.HOME_LOAN_SCREEN_ID,
      logo: homeLoan,
    },
    {
      id: defaultData.EDUCATION_LOAN_SCREEN_ID,
      logo: education,
    },
  ];
  const dispatch = useDispatch();

  const handleLoanForm = (formIndex) => {
    setOpen({
      open: true,
      screenIndex: formIndex,
      cardType: "Incident",
      bgColor: "#191A51",
    });
  };

  const handleReset = () => {
    setOpen({
      open: false,
      screenIndex: 0,
      cardType: "Incident",
      bgColor: "#191A51",
    });
  };
  useEffect(() => {
    (async () => {
      const res = await dispatch(loanConfigThunk());
      if (res.payload.status !== 200) {
        dispatch(
          openSnackbar({
            message: Constants.MOBILE_USERS_ERROR,
            notificationType: Constants.NOTIFICATION_ERROR,
          })
        );
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" justifyContent="space-between">
        <PageTitle title={PageTitles.LOAN_DASHBOARD} />
      </MDBox>
      <MDBox px={3} py={2}>
        <Grid container spacing={2}>
          {loanSlice.screens.map((screen, index) => (
            <Grid item xs={12} md={6} mb={2} px={2}>
              <MasterCard
                color={cardColor[index]}
                type={screen.name}
                number={4562112245947852}
                holder=""
                expires=""
                handleAction={() => handleLoanForm(index)}
                logo={productLogos.find((logo) => logo.id === screen.id).logo}
              />
            </Grid>
          ))}
        </Grid>
        {open.open && (
          <SafetyCardForm
            screenIndex={open.screenIndex}
            cardType={open.cardType}
            openSafetyModal={open.open}
            setOpenSafetyModal={setOpen}
            bgColor={open.bgColor}
            handleReset={handleReset}
          />
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default ProfileForm;
