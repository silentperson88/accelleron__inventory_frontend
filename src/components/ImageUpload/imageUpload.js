import React, { useRef, useState, useEffect } from "react";

// Material Dashboard 2 React components
import { Box, Button, Icon, InputAdornment } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";

// Components
import pxToRem from "assets/theme/functions/pxToRem";
import FullScreenImageComponent from "components/ViewFullImage/ViewImage";

// Redux
import uploadImageThunk from "redux/Thunks/ImageUpload";
import { useDispatch } from "react-redux";
import { openSnackbar } from "redux/Slice/Notification";

// Images
import Frame from "assets/images/Frame.png";
import Pdf from "assets/images/pdf.svg";

// utils
import Constants, { Icons } from "utils/Constants";

function imageUpload({
  label,
  onImageUpload,
  name,
  data,
  onImageCancel,
  formats,
  maxImageCount,
  type,
  error,
  helperText,
  resetComponent,
  acceptType,
}) {
  const [imageUrl, setImageUrl] = useState(data || []);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && data?.[0] !== "") setImageUrl(data);
  }, [data]);

  const handleImageUpload = async (e) => {
    const newImages = [];
    let updatedImageUrl = [...imageUrl];

    if (imageUrl.length + e.target.files.length <= maxImageCount) {
      for (let i = 0; i < e.target.files.length; i += 1) {
        const file = e.target.files[i];
        if (!formats.includes(file.type)) {
          dispatch(
            openSnackbar({
              message: Constants.FILE_TYPE_NOT_ALLOWED,
              notificationType: Constants.NOTIFICATION_ERROR,
            })
          );
          return;
        }
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview, url: preview, name: file.name, size: file.size });
      }
      const uploadPromises = newImages.map((img) =>
        dispatch(uploadImageThunk({ file: img.file, type }))
      );
      const responses = await Promise.all(uploadPromises);
      const newImageUrlArray = responses.map((response, index) => ({
        name: newImages[index].name,
        size: newImages[index].size,
        url: response.payload.data.iconUrl,
      }));
      updatedImageUrl = [...updatedImageUrl, ...newImageUrlArray];

      setImageUrl(updatedImageUrl);
      if (onImageUpload) {
        const imageValues = updatedImageUrl.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        }));
        onImageUpload(imageValues);
      }
    } else {
      dispatch(
        openSnackbar({
          message: `You can only upload up to ${maxImageCount} file.`,
          notificationType: "error",
        })
      );
    }
  };

  const handleCancelClick = (index) => {
    const newImageUrlArray = [...imageUrl];
    newImageUrlArray.splice(index, 1);

    if (newImageUrlArray.length === 0 && imageUrl.includes("Frame")) {
      const frameIndex = imageUrl.indexOf("Frame");
      newImageUrlArray.splice(frameIndex, 1);
    }

    setImageUrl(newImageUrlArray);
    onImageCancel(newImageUrlArray);
  };
  function getImageCountText() {
    const imageUrlArray = Array.isArray(imageUrl) ? imageUrl : [];
    const count = imageUrlArray.filter((url) => url !== Frame).length;
    if (count === 1) {
      return "1 file chosen";
    }
    return `${count} files chosen`;
  }

  const handleImageFullView = (imagePreview, i) => {
    setFullScreenImageIndex(i);
    setFullScreenImage(imagePreview);
  };
  const handleCloseFullView = () => {
    setFullScreenImage(null);
  };
  const handleNextImage = () => {
    setFullScreenImageIndex((prevIndex) => (prevIndex + 1) % imageUrl.length);
  };

  const handlePreviousImage = () => {
    setFullScreenImageIndex((prevIndex) => (prevIndex - 1 + imageUrl.length) % imageUrl.length);
  };

  const renderPreview = () => {
    if (imageUrl.length === 0) {
      return (
        <img src={Frame} alt="Preview" width={70} height={70} style={{ borderRadius: "8px" }} />
      );
    }

    return imageUrl.map((img, i) => {
      const isPdf = img?.url?.includes(".pdf");
      return (
        <Box
          display="flex"
          borderRadius="8px"
          position="relative"
          key={img?.preview || i}
          mr={2}
          sx={{
            "&:hover .overlay": {
              display: "flex",
              borderRadius: "8px",
            },
          }}
        >
          {isPdf ? (
            <img src={Pdf} alt="Preview" width={70} height={70} style={{ borderRadius: "8px" }} />
          ) : (
            <img
              src={img && img?.url}
              alt="Preview"
              width={70}
              height={70}
              style={{ borderRadius: "8px" }}
            />
          )}
          {img !== Frame && (
            <>
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
                  onClick={() => handleImageFullView(img?.url, i)}
                >
                  {Icons.VIEW2}
                </Icon>
              </Box>
              <Box
                display="none"
                position="absolute"
                top={0}
                right={0}
                bottom={60}
                left={70}
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(0, 0, 0, 0.5)"
                className="overlay"
              >
                <Icon
                  sx={{ color: "white", width: 30, height: 30, cursor: "pointer" }}
                  onClick={() => handleCancelClick(i)}
                >
                  {Icons.CROSS2}
                </Icon>
              </Box>
            </>
          )}
        </Box>
      );
    });
  };

  useEffect(() => {
    if (resetComponent) setImageUrl([]);
  }, [resetComponent]);
  return (
    <>
      <MDTypography
        variant="caption"
        mb={1}
        sx={{ fontSize: pxToRem(14), fontWeight: 500, color: "#344054" }}
      >
        {label}
      </MDTypography>
      <MDInput
        sx={{
          marginTop: 0,
          "& input": {
            fontSize: "16px",
            color: "#667085",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                size="medium"
                sx={{
                  borderLeft: "1px solid #D0D5DD",
                  borderRadius: "0px",
                  height: "22px",
                }}
                type="file"
                onClick={() => fileInputRef.current.click()}
              >
                <Icon>{Icons.IMAGE}</Icon>&nbsp;Choose file
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                {...(acceptType && { accept: acceptType })}
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </InputAdornment>
          ),
        }}
        name={name}
        error={error}
        helperText={helperText}
        value={
          imageUrl?.length === 1 && imageUrl[0] === Frame ? "No files choosen" : getImageCountText()
        }
        FormHelperTextProps={{
          sx: { marginLeft: 0, color: "#FF2E2E" },
        }}
        margin="normal"
        fullWidth
      />
      <MDBox display="flex" flexDirection="row" justifyContent="flex-start" my={1} mr={2} ml={1}>
        {renderPreview()}
      </MDBox>
      <FullScreenImageComponent
        fullScreenImage={fullScreenImage}
        handleCloseFullView={handleCloseFullView}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        image={imageUrl}
        src={imageUrl[fullScreenImageIndex]?.url}
      />
    </>
  );
}

export default imageUpload;
