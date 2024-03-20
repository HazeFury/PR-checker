import {
  FilterAlt,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { Button, Divider, Menu } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import MultiSelectDDMenu from "./MultiSelectDDMenu";
import useScreenSize from "../../../hooks/useScreenSize";
import Sort from "./Sort";

export default function DropDownMenu({
  buttonText,
  menuItems,
  user,
  selectedFilters,
  setSelectedFilters,
  disabled,
  haveFiltersBeenUsed,
  setHaveFiltersBeenUsed,
  sortBy,
  setSortBy,
}) {
  /* --- State and functions used for MUI Menu component --- */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const screenSize = useScreenSize();

  /* --- functions used for storing filters --- */
  const [showMenu, setShowMenu] = useState(null);

  // Updates filter state when mounting with provided data structure
  useEffect(() => {
    menuItems.forEach((item) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [Object.keys(item).join("")]:
          item === menuItems[0] && user === "owner"
            ? ["1", "2", "3", "4"]
            : [item === menuItems[0] ? "0" : "1"],
      }));

      setShowMenu((prev) => ({
        ...prev,
        [Object.keys(item).join("")]: true,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Updates filter array whose group parent element ID matches with the one in filter state
  const selectFilter = (e) => {
    if (!haveFiltersBeenUsed) setHaveFiltersBeenUsed(true);
    // Get the group parent element's id
    const targetFilter = e.target.parentElement.parentElement.parentElement.id;
    // Checks if the selected filter is already in the array matching the parent's id
    const isFilterSelected = selectedFilters[targetFilter].indexOf(
      e.target.name
    );
    // If the filters array is composed of every filter options when we are to add a new one, the filter array is set to ["0"] which represents all the filters
    const filtersCopy = selectedFilters[targetFilter].slice();
    filtersCopy.push(e.target.name);
    const filterCopySortedWithNewFilter = filtersCopy
      .sort((a, b) => a - b)
      .join("");

    const filterParamsArray = Object.values(
      menuItems.filter((el) => Object.keys(el).join("") === targetFilter)[0]
    )[0];
    const allFilterValues = filterParamsArray
      .filter((el) => el[1] !== "0")
      .map((el) => el[1])
      .join("");

    if (filterCopySortedWithNewFilter === allFilterValues) {
      setSelectedFilters({
        ...selectedFilters,
        [targetFilter]: ["0"],
      });
    }
    // If the only filter in the target array is the same as the one being chosen, it is not removed so that there is always at least one filter selected
    else if (
      selectedFilters[targetFilter].length === 1 &&
      isFilterSelected !== -1
    ) {
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
          disabled={disabled}
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
          {screenSize < 440 ? <FilterAlt /> : buttonText}
        </Button>
        <Menu
          id="filters-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "filters-button",
            sx: {
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            },
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#3E3E3E",
                color: "#FFFFFF",
                paddingInline: "1rem",
                borderTopRightRadius: "0",
              },
            },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Sort sortBy={sortBy} setSortBy={setSortBy} />
          <Divider
            sx={{
              background: "white",
              marginBlock: "1rem",
              width: "100%",
            }}
          />
          {menuItems.map((section) => {
            const sectionName = Object.keys(section).join("");
            return (
              <div key={sectionName}>
                <MultiSelectDDMenu
                  menuItems={section}
                  menuTitle={sectionName}
                  selectItem={selectFilter}
                  selectedItems={selectedFilters[sectionName]}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
                {section !== menuItems[menuItems.length - 1] ? (
                  <Divider sx={{ background: "white", marginBlock: "1rem" }} />
                ) : null}
              </div>
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
  user: PropTypes.string,
  selectedFilters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  setSelectedFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  haveFiltersBeenUsed: PropTypes.bool.isRequired,
  setHaveFiltersBeenUsed: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
};

DropDownMenu.defaultProps = {
  user: "owner",
  selectedFilters: null,
};
