import PropTypes from "prop-types";
import styles from "./TextInput.module.css";

export default function TextInput({
  label,
  hideLabel,
  type,
  id,
  placeholder,
  onChange,
  onBlur,
  value,
}) {
  return (
    <div className={styles.textInput}>
      <label
        htmlFor={id}
        className={hideLabel ? styles.hideLabel : styles.label}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={styles.input}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
  hideLabel: false,
};
