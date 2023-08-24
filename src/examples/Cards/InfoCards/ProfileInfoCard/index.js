// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import MDAvatar from "components/MDAvatar";
import pxToRem from "assets/theme/functions/pxToRem";

function ProfileInfoCard({ title, description, info, social, shadow, logo, website }) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <MDBox
      key={label}
      display="flex"
      alignContent="center"
      py={2}
      pr={2}
      sx={{ borderBottom: "1px solid #E0E6F5" }}
    >
      <MDTypography
        sx={{
          fontSize: pxToRem(16),
          fontWeight: "500",
          color: "#667085",
          textTransform: "capitalize",
        }}
        textTransform="capitalize"
        width={title === "Medical" || title === "GDRP" ? "55%" : "35%"}
      >
        {label} &nbsp;
      </MDTypography>
      <MDTypography
        sx={{
          fontSize: pxToRem(16),
          fontWeight: "600",
          color: "#191D31",
        }}
      >
        &nbsp;{values[key]}
      </MDTypography>
    </MDBox>
  ));

  const renderLogo = (
    <MDBox key={logo} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        Logo: &nbsp;
      </MDTypography>
      <MDAvatar size="xs" fontSize={2} src={logo} alt="Avatar" />
    </MDBox>
  );

  const renderUrl = (
    <MDBox key={website} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        Website: &nbsp;
      </MDTypography>
      <Link href={website} fontSize="small" underline="none" variant="string" color="text">
        {website}
      </Link>
    </MDBox>
  );

  // Render the card social media icons
  const renderSocial = social.map(({ link, icon, color }) => (
    <MDBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography
          variant="h5"
          fontWeight="medium"
          sx={{ color: "#667085" }}
          textTransform="capitalize"
        >
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>
          {renderItems}
          {logo !== "" ? renderLogo : null}
          {website !== "" ? renderUrl : null}
          <MDBox display="flex" py={1} pr={2}>
            {renderSocial.length > 0 ? (
              <MDBox>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  social: &nbsp;
                </MDTypography>
                {renderSocial}
              </MDBox>
            ) : null}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
  social: [],
  logo: "",
  website: "",
  description: "",
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  social: PropTypes.arrayOf(PropTypes.object),
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
  logo: PropTypes.string,
  website: PropTypes.string,
};

export default ProfileInfoCard;
