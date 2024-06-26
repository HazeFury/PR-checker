import PropTypes from "prop-types";
import styles from "../TextInput/TextInput.module.css";

export default function TextArea({
  label,
  type,
  id,
  placeholder,
  onChange,
  onBlur,
  value,
  maxLength,
}) {
  return (
    <div className={styles.textInput}>
      <label htmlFor="description" className={styles.label}>
        {label}
      </label>
      <textarea
        type={type}
        id={id}
        placeholder={placeholder}
        className={styles.inputArea}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        maxLength={maxLength}
      />
    </div>
  );
}

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
};
