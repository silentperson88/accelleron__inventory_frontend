import { Box, Checkbox, Chip, FormControlLabel, List, Modal, Paper } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import style from "assets/style/Modal";
import Add from "@mui/icons-material/Add";

function licensePermissions({ licenseList, Licenses, setLicense }) {
  const [openLicense, setOpenLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState([
    {
      _id: "",
      name: "Select License",
    },
  ]);
  const mongooseId = "_id";

  const options = licenseList.map((option) => {
    const license = option.name.toUpperCase();
    return {
      license: /[0-9]/.test(license) ? "0-9" : license,
      ...option,
    };
  });

  const handleOpen = () => {
    setOpenLicense(true);
  };
  const handleClose = () => {
    setOpenLicense(false);
  };

  const handleDelete = (chipToDelete) => () => {
    setSelectedLicense((license) =>
      license.filter((chip) => chip[mongooseId] !== chipToDelete[mongooseId])
    );
    const temp = [...Licenses];
    if (temp.some((val) => val.permission.some((item) => item === chipToDelete[mongooseId]))) {
      const index = temp.findIndex((val) =>
        val.permission.some((item) => item === chipToDelete[mongooseId])
      );
      if (temp[index].permission.length === 1) {
        temp.splice(index, 1);
      } else {
        const index2 = temp[index].permission.findIndex((val) => val === chipToDelete[mongooseId]);
        temp[index].permission.splice(index2, 1);
      }
    }
    setLicense(temp);
  };

  const handleMultiplePermissions = (event, item) => {
    let temp = [...selectedLicense];
    const tempLicense = [...Licenses];
    if (!event.target.checked) {
      item.permissions.forEach((element) => {
        if (temp.some((val) => val[mongooseId] === element[mongooseId])) {
          temp = temp.filter((lic) => lic[mongooseId] !== element[mongooseId]);
        }
      });
      const index = tempLicense.findIndex((element) => element.licence === item[mongooseId]);
      tempLicense.splice(index, 1);
    } else {
      item.permissions.forEach((element) => {
        if (!temp.some((val) => val[mongooseId] === element[mongooseId])) {
          temp.unshift({ [mongooseId]: element[mongooseId], name: element.name });
        }
      });
      const lic = {
        licence: item[mongooseId],
        permission: item.permissions.map((val) => val[mongooseId]),
      };
      tempLicense.push(lic);
    }
    setLicense(tempLicense);
    setSelectedLicense(temp);
  };

  const handlePermission = (event, item) => {
    let temp = [...selectedLicense];
    const tempLicense = [...Licenses];
    if (!event.target.checked) {
      temp = temp.filter((element) => element[mongooseId] !== event.target.id);
      const index = tempLicense.findIndex((element) => element.licence === item[mongooseId]);
      const tempPermission = tempLicense[index].permission.filter((val) => val !== event.target.id);
      if (tempPermission.length === 0) {
        tempLicense.splice(index, 1);
      } else {
        tempLicense[index].permission = tempPermission;
      }
    } else {
      temp.unshift({ [mongooseId]: event.target.id, name: event.target.name });
      const index = tempLicense.findIndex((element) => element.licence === item[mongooseId]);
      if (index < 0) {
        tempLicense.push({
          licence: item[mongooseId],
          permission: [event.target.id],
        });
      } else {
        tempLicense[index].permission.push(event.target.id);
      }
    }
    setLicense(tempLicense);
    setSelectedLicense(temp);
  };

  return (
    <MDBox>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "start",
          flexWrap: "wrap",
          listStyle: "none",
          flexDirection: "row",
          border: "0px",
          pb: 1,
          ml: 0,
          boxShadow: "none",
          mt: 3,
        }}
        component="ul"
      >
        {selectedLicense.map((data) => {
          let icon;

          if (data.name === "Select License") {
            icon = <Add key={data.name} />;
          }

          return (
            <List dense key={data?.name}>
              <Chip
                color={data.name === "Select License" ? "success" : "info"}
                sx={{ marginLeft: 1 }}
                icon={icon}
                label={data.name}
                onClick={data.name === "Select License" ? handleOpen : undefined}
                onDelete={data.name === "Select License" ? undefined : handleDelete(data)}
              />
            </List>
          );
        })}
      </Paper>
      <Modal
        open={openLicense}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <MDBox sx={{ ...style, width: 400 }}>
          <MDBox bgColor="info" p={3} textAlign="center" borderRadius="8px">
            <MDTypography
              id="child-modal-title"
              variant="h4"
              color="white"
              bgColor="info"
              fontWeight="regular"
            >
              License
            </MDTypography>
          </MDBox>
          <MDBox
            px={2}
            py={2}
            sx={{
              maxHeight: 500,
              overflowY: "scroll",
              "::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {options &&
              options.map((item) => (
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  key={item?.license}
                >
                  <FormControlLabel
                    label={item.license}
                    control={
                      <Checkbox
                        checked={item.permissions.every((val) =>
                          selectedLicense.some((lic) => lic[mongooseId] === val[mongooseId])
                        )}
                        onChange={(e) => handleMultiplePermissions(e, item)}
                      />
                    }
                  />
                  {item.permissions.map((permission) => (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", ml: 3 }}
                      key={permission[mongooseId]}
                    >
                      <FormControlLabel
                        label={permission.name}
                        id={permission[mongooseId]}
                        control={
                          <Checkbox
                            checked={
                              selectedLicense.filter(
                                (val) => val[mongooseId] === permission[mongooseId]
                              ).length > 0
                            }
                            id={permission[mongooseId]}
                            name={permission.name}
                            onChange={(event) => handlePermission(event, item)}
                          />
                        }
                      />
                    </Box>
                  ))}
                </MDBox>
              ))}
          </MDBox>
          <MDBox px={2} mb={2} textAlign="right">
            <MDButton variant="outlined" color="error" onClick={handleClose}>
              Close
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>
    </MDBox>
  );
}

export default licensePermissions;
