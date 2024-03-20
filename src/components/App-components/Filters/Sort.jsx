import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

export default function Sort({ sortBy, setSortBy }) {
  const handleSortClick = () => {
    setSortBy(sortBy === "new" ? "old" : "new");
  };

  return (
    <Button
      sx={{
        paddingTop: "0.5rem",
        textTransform: "none",
        color: "button.main",
      }}
      onClick={handleSortClick}
      endIcon={sortBy === "new" ? <ArrowDropUp /> : <ArrowDropDown />}
    >
      Tri: {sortBy === "new" ? "plus récent" : "plus ancien"}
    </Button>
  );
}

Sort.propTypes = {
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
};
