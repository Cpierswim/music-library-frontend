import React from "react";
import "./SearchBar.css";

const SearchBar = (props) => {
  function handleSubmit(event) {
    event.preventDefault();
    props.setFilterText(props.searchTerm.trim());
    props.searchTerm.trim() === ""
      ? props.setDisplayNewSongRow(true)
      : props.setDisplayNewSongRow(false);
  }

  return (
    <div id="search_bar">
      <form className="inline" onSubmit={handleSubmit}>
        <div className="form-floating grow">
          <input
            type="text"
            className="form-control custom-width"
            id="floatingInput_searchbar"
            placeholder="Search"
            value={props.searchTerm}
            onChange={(event) => props.setSearchTerm(event.target.value)}
          />
          <label htmlFor="floatingInput_searchbar">Search</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
