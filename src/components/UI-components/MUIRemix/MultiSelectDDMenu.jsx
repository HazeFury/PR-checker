import {
  CheckBoxOutlineBlank,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

export default function MultiSelectDDMenu({
  menuItems,
  menuTitle,
  selectItem,
  selectedItems,
}) {
  // State and func used for displaying the list of selection
  const [showMenu, setShowMenu] = useState(true);

  const handleClickMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}
      >
        <Button
          id="section-button"
          aria-haspopup="true"
          aria-expanded={showMenu ? "true" : undefined}
          aria-label="section-button"
          onClick={handleClickMenu}
          sx={{
            color: "#ffffff",
            textTransform: "none",
            font: "600 1em Montserrat, sans serif",
          }}
          endIcon={!showMenu ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        >
          {menuTitle}
        </Button>
        <Box hidden={!showMenu}>
          <FormGroup id={menuTitle}>
            {Object.values(menuItems)[0].map((item) => {
              return (
                <FormControlLabel
                  key={item[1]}
                  control={
                    <Checkbox
                      checked={selectedItems.indexOf(`${item[1]}`) !== -1}
                      onClick={selectItem}
                      name={item[1]}
                      icon={<CheckBoxOutlineBlank sx={{ color: "#3883BA" }} />}
                    />
                  }
                  label={item[0]}
                  labelPlacement="start"
                />
              );
            })}
          </FormGroup>
        </Box>
      </FormControl>
      {menuTitle !== "Demandes" ? (
        <Divider sx={{ background: "white", marginBlock: "1rem" }} />
      ) : null}
    </>
  );
}

MultiSelectDDMenu.propTypes = {
  menuItems: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
  ).isRequired,
  menuTitle: PropTypes.string.isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};
