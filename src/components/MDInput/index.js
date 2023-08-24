import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDInput
import MDInputRoot from "components/MDInput/MDInputRoot";

const MDInput = forwardRef(({ error, success, disabled, FormHelperTextProps, ...rest }, ref) => (
  <MDInputRoot
    {...rest}
    ref={ref}
    ownerState={{ error, success, disabled }}
    FormHelperTextProps={FormHelperTextProps}
  />
));

// Setting default values for the props of MDInput
MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
  FormHelperTextProps: {},
};

// Typechecking props for the MDInput
MDInput.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  FormHelperTextProps: PropTypes.objectOf(PropTypes.any),
};

export default MDInput;
