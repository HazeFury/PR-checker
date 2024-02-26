import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./TextInput.module.css";
import ShowPassword from "../MUIRemix/ShowPassword";

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
  const [inputType, setInputType] = useState(type);

  return (
    <div className={styles.textInput}>
      <label
        htmlFor={id}
        className={hideLabel ? styles.hideLabel : styles.label}
      >
        {label}
      </label>
      <input
        type={inputType}
        id={id}
        name={id}
        placeholder={placeholder}
        className={
          type === "password"
            ? [styles.input, styles.password].join(" ")
            : styles.input
        }
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {type === "password" ? (
        <ShowPassword inputType={inputType} setInputType={setInputType} />
      ) : null}
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
