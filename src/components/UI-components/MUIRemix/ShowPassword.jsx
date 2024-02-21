import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PropTypes from "prop-types";

export default function ShowPassword({ reveal, hide }) {
  return (
    <IconButton
      type="button"
      onMouseDown={reveal}
      onTouchStart={reveal}
      onMouseUp={hide}
      onTouchEnd={hide}
      sx={{
        position: "absolute",
        left: "115px",
        bottom: "45px",
      }}
    >
      <VisibilityIcon
        fontSize="small"
        sx={{
          color: "#3883ba",
        }}
      />
    </IconButton>
  );
}

ShowPassword.propTypes = {
  reveal: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};
