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
    <div className="search_form_wrapper">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-floating">
            <input
              type="text"
              className="form-control search_bar"
              id="floatingInput_searchbar"
              data-test="searchBar"
              placeholder="Search"
              value={props.searchTerm}
              onChange={(event) => props.setSearchTerm(event.target.value)}
            />
            <label htmlFor="floatingInput_searchbar">Search</label>
          </div>
          <button type="submit" className="btn btn-primary search_button">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
