import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import MultiSelectDDMenu from "./MultiSelectDDMenu";

export default function DropDownMenu({ buttonText, menuItems, user }) {
  /* --- State and functions used for Menu component --- */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /* --- State and func used for storing filters --- */
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  // Updates filter state when mounting with provided data structure
  useEffect(() => {
    menuItems.forEach((item) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [Object.keys(item).join("")]:
          item === menuItems[0] && user === "admin"
            ? ["1", "2", "3", "4"]
            : [item === menuItems[0] ? "0" : "1"],
      }));

      setShowMenu((prev) => ({
        ...prev,
        [Object.keys(item).join("")]: true,
      }));
    });
  }, [menuItems, user]);

  // Updates filter array whose group parent element ID matches with the one in filter state
  const selectFilter = (e) => {
    // Get the group parent element's id
    const targetFilter = e.target.parentElement.parentElement.parentElement.id;
    // Checks if the selected filter is already in the array matching the parent's id
    const isFilterSelected = selectedFilters[targetFilter].indexOf(
      e.target.name
    );
    // If the only filter in the target array is the same as the one being chosen, it is not removed so that there is always at least one filter selected
    if (selectedFilters[targetFilter].length === 1 && isFilterSelected !== -1) {
      setSelectedFilters({
        ...selectedFilters,
        [targetFilter]: [e.target.name],
      });
    }
    // 0 means every filter are selected, so we need to leave only 0 in the filter array
    else if (e.target.name === "0") {
      setSelectedFilters({
        ...selectedFilters,
        [targetFilter]: [e.target.name],
      });
    }
    // If the selected filter is not already in the array, it is added
    else if (isFilterSelected === -1) {
      if (selectedFilters[targetFilter].includes("0")) {
        setSelectedFilters({
          ...selectedFilters,
          [targetFilter]: [e.target.name],
        });
      } else {
        setSelectedFilters({
          ...selectedFilters,
          [targetFilter]: [...selectedFilters[targetFilter], e.target.name],
        });
      }
      // Else, it is removed from the array
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [targetFilter]: selectedFilters[targetFilter].filter(
          (el) => el !== e.target.name
        ),
      });
    }
  };

  if (selectedFilters)
    return (
      <div>
        <Button
          id="filters-button"
          aria-controls={open ? "filters-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="contained"
          sx={
            open
              ? {
                  borderBottomLeftRadius: "0",
                  borderBottomRightRadius: "0",
                  backgroundColor: "#3883BA",
                }
              : { backgroundColor: "#3883BA" }
          }
          endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        >
          {buttonText}
        </Button>
        <Menu
          id="filters-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "filters-button",
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#3E3E3E",
                color: "#FFFFFF",
                paddingInline: "1rem",
                borderTopRightRadius: "0",
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                justifyContent: "space-between",
              },
            },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menuItems.map((section) => {
            const sectionName = Object.keys(section).join("");
            return (
              <MultiSelectDDMenu
                key={sectionName}
                menuItems={section}
                menuTitle={sectionName}
                selectItem={selectFilter}
                selectedItems={selectedFilters[sectionName]}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
              />
            );
          })}
        </Menu>
      </div>
    );
}

DropDownMenu.propTypes = {
  buttonText: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)))
  ).isRequired,
  user: PropTypes.string.isRequired,
};
