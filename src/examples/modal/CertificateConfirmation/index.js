import { Box, Grid, Icon, Modal } from "@mui/material";
import style from "assets/style/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import pxToRem from "assets/theme/functions/pxToRem";
import BasicButton from "examples/NewDesign/CustomButton/BasicButton";
import { ButtonTitles, Icons } from "utils/Constants";
import ModalTitle from "examples/NewDesign/ModalTitle";
import Pdf from "assets/images/pdf.svg";
import { useState } from "react";
import moment from "moment";
import Status from "components/Table/Status";
import FormTextArea from "components/Form/FTextArea";
import FullScreenImageComponent from "components/ViewFullImage/ViewImage";

function index({ open, handleClose, handleApprove: handleApproveProp, profileView }) {
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [reason, setReason] = useState({
    comment: "",
    errorMessage: "",
    isRejectClicked: false,
  });
  const handleReset = () => {
    setReason({
      comment: "",
      errorMessage: "",
      isRejectClicked: false,
    });
    handleClose();
  };
  const handleReasonChange = (event) => {
    setReason({
      ...reason,
      comment: event.target.value,
    });
  };
  const handleApproveInternal = (status) => {
    const { comment, isRejectClicked } = reason;

    if (status === "rejected") {
      if (!comment) {
        setReason({
          ...reason,
          errorMessage: "Comment is required.",
          isRejectClicked: true,
        });
        return;
      }
      setReason({
        ...reason,
        errorMessage: "",
        isRejectClicked: false,
      });
    } else {
      if (isRejectClicked && !comment) {
        setReason({
          ...reason,
          errorMessage: "Comment is required.",
          isRejectClicked: true,
        });
        return;
      }
      setReason({
        ...reason,
        errorMessage: "",
        isRejectClicked: false,
      });
    }

    handleReset();
    handleApproveProp(status, comment);
  };
  const handleImageFullView = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };
  const handleCloseFullView = () => {
    setFullScreenImage(null);
  };
  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <MDBox
            bgColor="info"
            p={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="lg"
            sx={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0, height: pxToRem(72) }}
          >
            <ModalTitle title="Certificate Verification" color="white" />
            <Icon
              sx={{ cursor: "pointer", color: "beige" }}
              fontSize="medium"
              onClick={handleReset}
            >
              {Icons.CROSS}
            </Icon>
          </MDBox>
          <MDBox
            px={2}
            py={0}
            sx={{
              maxHeight: 500,
              overflowX: "hidden",
              overflowY: "scroll",
              "::-webkit-scrollbar": {
                width: "5px",
              },
              "::-webkit-scrollbar-thumb": {
                background: "gray",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "gray transparent",
            }}
          >
            <MDTypography
              sx={{
                fontSize: pxToRem(16),
                fontWeight: 600,
                textTransform: "capitalize",
                color: "#191D31",
              }}
              mt={4}
              ml={1}
            >
              {profileView.key}
            </MDTypography>

            <MDBox display="flex" border="1px solid #E0E6F5" borderRadius="8px" p={1} mt={1} ml={1}>
              {!profileView?.list[0]?.name || !profileView?.list[0]?.name.includes("pdf") ? (
                <MDBox
                  display="flex"
                  borderRadius="8px"
                  position="relative"
                  height="70px"
                  width="60px"
                  sx={{
                    "&:hover .overlay": {
                      display: "flex",
                      borderRadius: "8px",
                      marginTop: "5px",
                      marginLeft: "4px",
                    },
                  }}
                >
                  <img
                    src={
                      profileView.list[0]?.url
                        ? profileView.list[0]?.url
                        : process.env.REACT_APP_IMAGE_NOT_FOUND
                    }
                    alt="Preview"
                    height="60px"
                    width="60px"
                    style={{
                      border: "1px solid #D0D5DD",
                      borderRadius: "8px",
                      marginTop: "5px",
                      marginLeft: "4px",
                    }}
                  />
                  <Box
                    display="none"
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="rgba(0, 0, 0, 0.5)"
                    className="overlay"
                  >
                    <Icon
                      sx={{ color: "white", width: 30, height: 30, cursor: "pointer" }}
                      onClick={() => handleImageFullView(profileView.list[0]?.url || profileView)}
                    >
                      {Icons.VIEW2}
                    </Icon>
                  </Box>
                </MDBox>
              ) : (
                <MDBox
                  display="flex"
                  borderRadius="8px"
                  position="relative"
                  height="70px"
                  width="60px"
                  sx={{
                    "&:hover .overlay": {
                      display: "flex",
                      borderRadius: "8px",
                      marginTop: "5px",
                      marginLeft: "4px",
                    },
                  }}
                >
                  <img
                    src={Pdf}
                    alt="Preview"
                    height="60px"
                    width="60px"
                    style={{
                      marginTop: "5px",
                      marginLeft: "4px",
                    }}
                  />
                  <Box
                    display="none"
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="rgba(0, 0, 0, 0.5)"
                    className="overlay"
                  >
                    <Icon
                      sx={{ color: "white", width: 30, height: 30, cursor: "pointer" }}
                      onClick={() => handleImageFullView(profileView.list[0]?.url || profileView)}
                    >
                      {Icons.VIEW2}
                    </Icon>
                  </Box>
                </MDBox>
              )}

              <MDBox ml={2} mt={0}>
                <MDTypography
                  display="block"
                  sx={{
                    fontSize: pxToRem(14),
                    fontWeight: 500,
                    textTransform: "capitalize",
                    color: "#344054",
                  }}
                >
                  {profileView?.list[0]?.name}
                </MDTypography>
                <MDBox display="flex" flexDirection="row" justifyContent="space-between" mt={0.5}>
                  <MDBox>
                    <MDTypography
                      display="block"
                      sx={{ color: "#667085", fontSize: pxToRem(14), fontWeight: 400 }}
                    >
                      Start date :{" "}
                      {profileView?.list[0]?.fromDate
                        ? moment(profileView?.list[0]?.fromDate).format("DD-MM-YYYY")
                        : "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox ml={4}>
                    <MDTypography
                      display="block"
                      sx={{ color: "#667085", fontSize: pxToRem(14), fontWeight: 400 }}
                    >
                      End date :{" "}
                      {profileView?.list[0]?.toDate
                        ? moment(profileView?.list[0]?.toDate).format("DD-MM-YYYY")
                        : "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox ml={10}>
                    <Status title={`${profileView?.list[0]?.status.replace("_", " ")}`} />
                  </MDBox>
                </MDBox>
                <MDTypography
                  display="block"
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 400,
                    textTransform: "capitalize",
                    color: "#344054",
                  }}
                >
                  {`${(parseFloat(profileView?.list[0]?.size) / 1024).toFixed(2)} MB`}
                </MDTypography>
              </MDBox>
            </MDBox>

            <FormTextArea
              marginTop={2}
              title="Comment"
              value={reason.comment}
              name="reason"
              placeholder="Add Comment here"
              error={Boolean(reason.errorMessage !== "")}
              helperText={reason.errorMessage}
              handleChange={handleReasonChange}
            />
          </MDBox>
          <MDBox px={6} mb={4} mt={4}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center">
              <Grid item xs={2}>
                <BasicButton
                  title={ButtonTitles.REJECT_CERTIFICATE}
                  icon={Icons.CROSS2}
                  background="#f4dfe0"
                  color="#FF2E2E"
                  border="1px solid #FF2E2E"
                  action={() => handleApproveInternal("rejected")}
                />
              </Grid>
              <Grid item xs={2} ml={2}>
                <BasicButton
                  title={ButtonTitles.APPROVE_CERTIFICATE}
                  icon={Icons.ACCEPT2}
                  background="#e2ede5"
                  color="#4FBF67"
                  border="1px solid #4FBF67"
                  action={() => handleApproveInternal("approved")}
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Modal>
      <FullScreenImageComponent
        fullScreenImage={fullScreenImage}
        handleCloseFullView={handleCloseFullView}
        src={profileView.list[0]?.url}
      />
    </>
  );
}
export default index;
