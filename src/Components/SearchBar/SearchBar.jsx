import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = (props) => {
  const [searchText, setSearchText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    props.setSearchTerm(searchText);
  }

  return (
    <div id="search_bar">
      <form className="inline" onSubmit={handleSubmit}>
        <div className="form-floating grow">
          <input
            type="text"
            className="form-control custom-width"
            id="floatingInput"
            placeholder="Search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
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
