import React from "react";
import "./SearchBar.css";

const SearchBar = (props) => {
  return (
    <div id="search_bar">
      <form className="inline">
        <div className="form-floating grow">
          <input
            type="text"
            className="form-control custom-width"
            id="floatingInput"
            placeholder="Search"
          />
          <label htmlFor="floatingInput">Search</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
