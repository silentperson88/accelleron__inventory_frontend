// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import pattern from "assets/images/illustrations/pattern-tree.svg";

function MasterCard({ type, color, number, holder, expires, handleAction, logo }) {
  const numbers = [...`${number}`];

  if (numbers.length < 16 || numbers.length > 16) {
    throw new Error(
      "Invalid value for the prop number, the value for the number prop shouldn't be greater than or less than 16 digits"
    );
  }

  // const num1 = numbers.slice(0, 4).join("");
  // const num2 = numbers.slice(4, 8).join("");
  // const num3 = numbers.slice(8, 12).join("");
  // const num4 = numbers.slice(12, 16).join("");

  return (
    <Card
      sx={({ palette: { gradients }, functions: { linearGradient }, boxShadows: { xl } }) => ({
        background: gradients[color]
          ? linearGradient(gradients[color].main, gradients[color].state)
          : linearGradient(gradients.dark.main, gradients.dark.state),
        boxShadow: xl,
        position: "relative",
      })}
    >
      <MDBox
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        opacity={0.2}
        sx={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
        }}
      />
      <MDBox
        position="relative"
        zIndex={2}
        p={2}
        sx={{
          cursor: "pointer",
        }}
        onClick={() => handleAction(type)}
      >
        <MDTypography variant="h6" color="white" fontWeight="medium" textTransform="capitalize">
          {holder}
        </MDTypography>
        <MDBox display="flex" justifyContent="center" alignItems="center">
          {logo ? (
            <img src={logo} alt="logo" width="12%" height="20%" style={{ objectFit: "contain" }} />
          ) : null}
          <MDTypography
            variant="h5"
            color="white"
            fontWeight="medium"
            sx={{ mt: 3, mb: 3, ml: 2, pb: 1, w: 100, textAlign: "center" }}
          >
            {type}
            {/* {num1}&nbsp;&nbsp;&nbsp;{num2}&nbsp;&nbsp;&nbsp;{num3}&nbsp;&nbsp;&nbsp;{num4} */}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" alignItems="center">
            <MDBox mr={3} lineHeight={1}>
              <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                {holder ? "Card Holder" : ""}
              </MDTypography>
              <MDTypography
                variant="h6"
                color="white"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {holder}
              </MDTypography>
            </MDBox>
            <MDBox lineHeight={1}>
              <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                {expires ? "Expires" : ""}
              </MDTypography>
              <MDTypography variant="h6" color="white" fontWeight="medium">
                {expires}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of MasterCard
MasterCard.defaultProps = {
  color: "dark",
  type: "",
  handleAction: () => {},
};

// Typechecking props for the MasterCard
MasterCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  number: PropTypes.number.isRequired,
  holder: PropTypes.string.isRequired,
  expires: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleAction: PropTypes.func,
  logo: PropTypes.string.isRequired,
};

export default MasterCard;
