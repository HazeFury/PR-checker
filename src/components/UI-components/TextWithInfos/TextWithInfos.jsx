import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./TextWithInfos.module.css";
import tooltip from "../../../assets/tooltip.svg";

export default function TextWithInfos({ text, description }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipToggle = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  return (
    <div className={styles.textBlock}>
      <p className={styles.text}>{text}</p>
      <button
        aria-label="description"
        type="button"
        className={styles.tooltipButton}
        onClick={handleTooltipToggle}
      >
        <img src={tooltip} alt="tooltip" />
      </button>
      {isTooltipOpen && <div className={styles.tooltip}> {description} </div>}
    </div>
  );
}

TextWithInfos.propTypes = {
  text: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
