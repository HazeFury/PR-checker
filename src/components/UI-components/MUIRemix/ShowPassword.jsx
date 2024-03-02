import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import eye from "../../../assets/eye.svg";
import blind from "../../../assets/eye-closed.svg";

export default function ShowPassword({ inputType, setInputType }) {
  const changeInputType = () => {
    if (inputType === "password") setInputType("text");
    else setInputType("password");
  };

  return (
    <IconButton
      type="button"
      onClick={changeInputType}
      sx={{
        position: "absolute",
        right: "10px",
        bottom: "4px",
        width: "20px",
      }}
    >
      {inputType === "password" ? (
        <img src={blind} alt="blind" style={{ width: "20px" }} />
      ) : (
        <img src={eye} alt="eye" style={{ width: "20px" }} />
      )}
    </IconButton>
  );
}

ShowPassword.propTypes = {
  inputType: PropTypes.string.isRequired,
  setInputType: PropTypes.func.isRequired,
};
