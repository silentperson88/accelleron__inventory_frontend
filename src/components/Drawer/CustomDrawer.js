import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import MDBox from "components/MDBox";
import pxToRem from "assets/theme/functions/pxToRem";
import { useTheme } from "@emotion/react";

const customDrawer = ({ defaultAnchor, children }) => {
  const theme = useTheme();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  // set the default value of anchor
  // use for opening the drawer in left, right, bottom, top direction
  useEffect(() => {
    setState({ ...state, ...defaultAnchor });
  }, [defaultAnchor]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <MDBox>
      {["left", "right", "top", "bottom"].map((anchor) => (
        <Drawer
          key={anchor}
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          PaperProps={{
            style: {
              width: pxToRem(900), // Default width for larger screens
              [theme.breakpoints.up("md")]: {
                width: pxToRem(900), // Dynamic width for md and above
              },
              [theme.breakpoints.up("xs")]: {
                width: "100%", // Dynamic width for xs and above
              },
              height: "100%",
              margin: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          {children}
        </Drawer>
      ))}
    </MDBox>
  );
};

export default customDrawer;
