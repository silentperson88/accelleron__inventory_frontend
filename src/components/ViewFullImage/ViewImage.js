import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import React from "react";
import { Icons } from "utils/Constants";

const fullScreenImageComponent = ({
  fullScreenImage,
  handleCloseFullView,
  handlePreviousImage,
  handleNextImage,
  image,
  src,
}) => {
  const isPdf = typeof src === "string" && src.includes(".pdf");
  return (
    <MDBox>
      {fullScreenImage && (
        <MDBox
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            style={{
              position: "fixed",
              top: "1rem",
              right: "1rem",
              width: "30px",
              height: "30px",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={handleCloseFullView}
          >
            {Icons.REJECT}
          </Icon>
          {image && image.length > 1 ? (
            <Icon
              style={{
                position: "absolute",
                top: "50%",
                left: "1rem",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handlePreviousImage}
              fontSize="large"
            >
              {Icons.PREVIOUS}
            </Icon>
          ) : null}
          {isPdf ? (
            <iframe
              src={`https://docs.google.com/gview?url=${src}&embedded=true`}
              width="1113px"
              height="542px"
              frameBorder="0"
              title="Preview"
            />
          ) : (
            <img
              src={src}
              alt="Full Screen"
              style={{
                position: "absolute",
                width: "1113px",
                height: "542px",
                objectFit: "contain",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          {image && image.length > 1 ? (
            <Icon
              style={{
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleNextImage}
              fontSize="large"
            >
              {Icons.NEXT}
            </Icon>
          ) : null}
        </MDBox>
      )}
    </MDBox>
  );
};

export default fullScreenImageComponent;
