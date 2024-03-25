import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Zoom from "@mui/material/Zoom";
import PropTypes from "prop-types";

export default function TooltipIcon({ tooltip, top, left, color }) {
  return (
    <Tooltip
      title={tooltip}
      placement="top"
      TransitionComponent={Zoom}
      enterTouchDelay={200}
      arrow
    >
      <InfoIcon
        fontSize="small"
        sx={{
          position: "absolute",
          top: `${top}`,
          left: `${left}`,
          color: `${color}`,
        }}
      />
    </Tooltip>
  );
}

TooltipIcon.propTypes = {
  tooltip: PropTypes.string.isRequired,
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
