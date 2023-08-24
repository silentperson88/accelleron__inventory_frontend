const FormControlErrorStyles = {
  // when there is an error the label color is red
  "& .MuiInputLabel-root.Mui-focused.Mui-error": {
    color: "red",
  },

  // when there is an error the border color is red
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "red",
  },
  // on hover the border color is #d2d6da
  "& .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d2d6da",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#7b809a",
  },
};

export default FormControlErrorStyles;
