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
}) {
  return (
    <div className={styles.textInput}>
      <label htmlFor="description" className={styles.label}>
        {label}
      </label>
      <textarea
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

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
