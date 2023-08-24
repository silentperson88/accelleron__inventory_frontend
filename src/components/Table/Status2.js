import MDBox from "components/MDBox";

const status2 = ({ color, bgColor, title }) => (
  <MDBox
    color={color}
    bgColor={bgColor}
    variant="contained"
    borderRadius="lg"
    opacity={1}
    p={1}
    width="62px"
    height="24px"
    textAlign="right"
    display="flex"
    alignItems="center"
    justifyContent="space-around"
  >
    {title}
  </MDBox>
);

export default status2;
