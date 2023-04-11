import React from "react";
import "./MusicTable.css";
import { useState } from "react";
import { ReactComponent as EditIcon } from "./edit.svg";
import { ReactComponent as CancelIcon } from "./cancel.svg";
import { ReactComponent as DeleteIcon } from "./delete.svg";

function formatDate(string) {
  let parts = string.split("-");
  parts[1] = parseInt(parts[1]);
  switch (parts[1]) {
    case 1:
      parts[1] = "Jan";
      break;
    case 2:
      parts[1] = "Feb";
      break;
    case 3:
      parts[1] = "Mar";
      break;
    case 4:
      parts[1] = "Apr";
      break;
    case 5:
      parts[1] = "May";
      break;
    case 6:
      parts[1] = "Jun";
      break;
    case 7:
      parts[1] = "Jul";
      break;
    case 8:
      parts[1] = "Aug";
      break;
    case 9:
      parts[1] = "Sep";
      break;
    case 10:
      parts[1] = "Oct";
      break;
    case 11:
      parts[1] = "Nov";
      break;
    default:
      parts[1] = "Dec";
      break;
  }
  parts[2] = parseInt(parts[2]);
  if (parts[1] === "Jan" && parts[2] === 1) return parts[0];
  return parts[1] + " " + parts[2] + ", " + parts[0];
}

function format_seconds(seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  let return_string = "";

  if (hours > 0) {
    return_string = hours + ":";
    if (minutes < 10) {
      return_string = return_string + "0";
    }
    return_string = return_string + minutes + ":";
    if (seconds < 10) {
      return_string = return_string + "0";
    }
    return_string = return_string + seconds;
  } else if (hours === 0 && minutes > 0) {
    return_string = minutes + ":";
    if (seconds < 10) {
      return_string = return_string + "0";
    }
    return_string = return_string + seconds;
  } else {
    return_string = seconds + " seconds";
  }

  return return_string;
}

function getSecondsFromString(timeString) {
  let split = timeString.split(":");
  let minutes = 0;
  let seconds = 0;
  if (split.length === 2) {
    minutes = parseInt(split[0]);
    seconds = parseInt(split[1]);
    seconds += minutes * 60;
  } else if (split.length === 1) {
    seconds = parseInt(split[0]);
  }

  return seconds;
}

//-------------------------------------------
// ALL FUNCTIONS BELOW THIS ARE JUST USED
// IN FILTERING A ROW
//-------------------------------------------
function filterBySearchTerm(song, searchString) {
  if (searchString === "") return true;
  searchString = searchString.toLowerCase();
  let plusWords = [];
  let artistSpecial = getSpecialWord(searchString, "+artist");
  if (artistSpecial) {
    searchString = removeFromSearchString(searchString, artistSpecial);
    plusWords.push(artistSpecial);
  }
  let titleSpecial = getSpecialWord(searchString, "+title");
  if (titleSpecial) {
    searchString = removeFromSearchString(searchString, titleSpecial);
    plusWords.push(titleSpecial);
  }
  let albumnSpecial = getSpecialWord(searchString, "+album");
  if (albumnSpecial) {
    searchString = removeFromSearchString(searchString, albumnSpecial);
    plusWords.push(albumnSpecial);
  }
  let genreSpecial = getSpecialWord(searchString, "+genre");
  if (genreSpecial) {
    searchString = removeFromSearchString(searchString, genreSpecial);
    plusWords.push(genreSpecial);
  }

  let non_special_pluswords = getPlusWords(searchString);

  for (let i = 0; i < non_special_pluswords.length; i++) {
    let to_remove = non_special_pluswords[i];
    if (to_remove.includes(" ")) to_remove = '"' + to_remove + '"';

    let temp = removeFromSearchString(searchString, "+" + to_remove);
    searchString = temp;
  }
  plusWords.push(...non_special_pluswords);

  //all must have words are now in pluswords, get the optional words
  let non_pluswords = [];
  artistSpecial = getSpecialWord(searchString, "artist");
  if (artistSpecial) {
    searchString = removeFromSearchString(searchString, artistSpecial);
    non_pluswords.push(artistSpecial);
  }
  titleSpecial = getSpecialWord(searchString, "title");
  if (titleSpecial) {
    searchString = removeFromSearchString(searchString, titleSpecial);
    non_pluswords.push(titleSpecial);
  }
  albumnSpecial = getSpecialWord(searchString, "album");
  if (albumnSpecial) {
    searchString = removeFromSearchString(searchString, albumnSpecial);
    non_pluswords.push(albumnSpecial);
  }
  genreSpecial = getSpecialWord(searchString, "genre");
  if (genreSpecial) {
    searchString = removeFromSearchString(searchString, genreSpecial);
    non_pluswords.push(genreSpecial);
  }

  let temp_non_pluswords = getNonPlusWords(searchString);
  non_pluswords.push(...temp_non_pluswords);

  //should now have all the words separated

  //for the filter to be true, ALL the pluswords must be true, so every single check must be true
  let plusWordsResult = [];
  for (let i = 0; i < plusWords.length; i++) {
    if (plusWords[i].includes("+artist:")) {
      let checkWord = plusWords[i].replace("+artist:", "");
      checkWord = checkWord.replace(/"/g, "");
      plusWordsResult.push(song.artist.toLowerCase().includes(checkWord));
    } else if (plusWords[i].includes("+title:")) {
      let checkWord = plusWords[i].replace("+title:", "");
      checkWord = checkWord.replace(/"/g, "");
      plusWordsResult.push(song.title.toLowerCase().includes(checkWord));
    } else if (plusWords[i].includes("+album:")) {
      let checkWord = plusWords[i].replace("+album:", "");
      checkWord = checkWord.replace(/"/g, "");
      plusWordsResult.push(song.album.toLowerCase().includes(checkWord));
    } else if (plusWords[i].includes("+genre:")) {
      let checkWord = plusWords[i].replace("+genre:", "");
      checkWord = checkWord.replace(/"/g, "");
      plusWordsResult.push(song.genre.toLowerCase().includes(checkWord));
      if (plusWordsResult === false) break;
    } else {
      //the word we are checking is not any of the special words, so check all of them
      //but it must be included in one
      let included_in_one =
        song.artist.toLowerCase().includes(plusWords[i]) ||
        song.title.toLowerCase().includes(plusWords[i]) ||
        song.album.toLowerCase().includes(plusWords[i]) ||
        song.genre.toLowerCase().includes(plusWords[i]);
      plusWordsResult.push(included_in_one);
    }
  }

  //for the filter to be true, ANY of the nonpluswords can be true, so it'
  let nonPlusWordsResult = [];
  for (let i = 0; i < non_pluswords.length; i++) {
    if (non_pluswords[i].includes("artist:")) {
      let checkWord = non_pluswords[i].replace("artist:", "");
      checkWord = checkWord.replace(/"/g, "");
      nonPlusWordsResult.push(song.artist.toLowerCase().includes(checkWord));
    } else if (non_pluswords[i].includes("title:")) {
      let checkWord = non_pluswords[i].replace("title:", "");
      checkWord = checkWord.replace(/"/g, "");
      nonPlusWordsResult.push(song.title.toLowerCase().includes(checkWord));
    } else if (non_pluswords[i].includes("album:")) {
      let checkWord = non_pluswords[i].replace("album:", "");
      checkWord = checkWord.replace(/"/g, "");
      nonPlusWordsResult.push(song.album.toLowerCase().includes(checkWord));
    } else if (non_pluswords[i].includes("genre:")) {
      let checkWord = non_pluswords[i].replace("genre:", "");
      checkWord = checkWord.replace(/"/g, "");
      nonPlusWordsResult.push(song.genre.toLowerCase().includes(checkWord));
    } else {
      let included_in_one =
        song.artist.toLowerCase().includes(non_pluswords[i]) ||
        song.title.toLowerCase().includes(non_pluswords[i]) ||
        song.album.toLowerCase().includes(non_pluswords[i]) ||
        song.genre.toLowerCase().includes(non_pluswords[i]);
      nonPlusWordsResult.push(included_in_one);
    }
  }

  //if we hit a single false, the whole thing is false
  if (plusWordsResult.includes(false)) return false;

  if (nonPlusWordsResult.length === 0) return true;

  //if we get here, all the plus words are found
  //now we look through the non plus words, and if a single true is found, the whole thing is true
  if (nonPlusWordsResult.includes(true)) return true;

  //if we got here, then all of the plus words are true, but none of the nonplus words are, so we return false
  return false;
}

function getSpecialWord(searchString, specialWord) {
  specialWord += ":";
  if (!searchString.includes(specialWord)) return null;
  let index = searchString.indexOf(specialWord);
  searchString = searchString.substring(index + specialWord.length);
  let return_string = "";
  if (!searchString.includes('"') && !searchString.includes(" "))
    return_string = specialWord + searchString;
  else {
    if (searchString.charAt(0) === '"') {
      //there's a  full string next
      searchString = searchString.substring(1);
      index = searchString.indexOf('"');
      let beforeQuote = searchString.substring(0, index);
      return_string = specialWord + '"' + beforeQuote + '"';
    } else {
      //there is more after the speicalword: and it could include a " somewhere later, but isn't one right after the :
      index = searchString.indexOf(" ");
      let beforeSpace = searchString.substring(0, index);
      return_string = specialWord + beforeSpace;
    }
  }
  return return_string;
}

function getPlusWords(searchString) {
  let plusWords = [];
  if (!searchString.includes("+")) return plusWords;
  while (searchString.includes("+")) {
    let indexOfFirstPlus = searchString.indexOf("+");
    if (searchString.charAt(indexOfFirstPlus + 1) === '"') {
      //there is a string after the plus
      let quoteIndex = searchString.indexOf('"', indexOfFirstPlus + 2);
      let plusword = searchString.substring(indexOfFirstPlus + 2, quoteIndex);
      let before_plus = searchString.substring(0, indexOfFirstPlus);
      let after_Quote = searchString.substring(quoteIndex + 1);
      plusWords.push(plusword);
      searchString = before_plus + after_Quote;
      searchString.trim();
    } else {
      //there is a single word after the plus
      let spaceIndex = searchString.indexOf(" ", indexOfFirstPlus + 1);
      if (spaceIndex === -1) {
        //the plus word is at the end of the string
        plusWords.push(searchString.substring(indexOfFirstPlus + 1));
        break;
      } else {
        //it's not the last word, so remove it from the string and keep searching
        let indexOfSpace = searchString.indexOf(" ", indexOfFirstPlus);
        let plusword = searchString.substring(
          indexOfFirstPlus + 1,
          indexOfSpace
        );
        let before_plus = searchString.substring(0, indexOfFirstPlus);
        let after_space = searchString.substring(indexOfSpace + 1);
        plusWords.push(plusword);
        searchString = before_plus + after_space;
        searchString = searchString.trim();
      }
    }

    searchString = searchString.replace("  ", " ");
  }

  return plusWords;
}

function getNonPlusWords(searchString) {
  let split = searchString.split(" ");
  let return_words = [];
  for (let i = 0; i < split.length; i++) {
    if (split[i] !== "") {
      return_words.push(split[i]);
    }
  }

  return return_words;
}

function removeFromSearchString(searchString, wordToRemove) {
  let temp = searchString.replace(wordToRemove, "").trim().replace("  ", " ");
  return temp;
}

const MusicTable = (props) => {
  const [displayingUpdate, setDisplayingUpdate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState("");
  const [newRunningTime, setNewRunningTime] = useState("");
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateArist, setUpdateArtist] = useState("");
  const [updateAlbumnName, setUpdateAlbumName] = useState("");
  const [updateGenre, setUpdateGenre] = useState("");
  const [updateReleaseDate, setUpdateReleaseDate] = useState("");
  const [updateRunningTime, setUpdateRunningTime] = useState("");

  let calculated_runtime = 0;

  function handleSubmit(event) {
    let action = event.nativeEvent.submitter.value;
    switch (action) {
      case "add":
        addNewSong(event);
        break;
      case "update":
        updateSong(event);
        break;
      case "delete":
        deleteSong(event);
        break;
      case "cancel":
        cancelUpdate(event);
        break;
      default:
        break;
    }
  }

  function addNewSong(event) {
    event.preventDefault();
    setNewTitle(newTitle.trim());
    setNewAlbumName(newAlbumName.trim());
    setNewArtist(newArtist.trim());
    setNewGenre(newGenre.trim());
    setNewReleaseDate(newReleaseDate.trim());
    setNewRunningTime(newRunningTime.trim());

    if (
      newTitle !== "" ||
      newArtist !== "" ||
      newAlbumName !== "" ||
      newGenre !== "" ||
      newReleaseDate !== "" ||
      newRunningTime !== ""
    ) {
      let song = {
        title: newTitle,
        artist: newArtist,
        album: newAlbumName,
        release_date: newReleaseDate,
        genre: newGenre,
        running_time: getSecondsFromString(newRunningTime),
      };

      let result = props.addNewSong(song);

      result.then((value) => {
        setNewTitle("");
        setNewAlbumName("");
        setNewArtist("");
        setNewGenre("");
        setNewReleaseDate("");
        setNewRunningTime("");
        props.refreshSongList();
      });
    }
  }

  function updateSong(event) {
    event.preventDefault();

    if (
      updateTitle !== "" ||
      updateArist !== "" ||
      updateAlbumnName !== "" ||
      updateGenre !== "" ||
      updateReleaseDate !== "" ||
      updateRunningTime !== ""
    ) {
      let song = {
        id: updateIndex,
        artist: updateArist,
        album: updateAlbumnName,
        release_date: updateReleaseDate,
        genre: updateGenre,
        running_time: updateRunningTime,
      };

      let result = props.updateSong(song);

      result.then((value) => {
        setDisplayingUpdate(false);
        setUpdateIndex(0);
        setUpdateTitle("");
        setUpdateAlbumName("");
        setUpdateArtist("");
        setUpdateGenre("");
        setUpdateReleaseDate("");
        setUpdateRunningTime("");
        props.refreshSongList();
      });
    }
  }

  function deleteSong(event) {
    event.preventDefault();
    let songToDelete = updateIndex;
    let result = props.deleteSong(songToDelete);
    result.then((value) => {
      setDisplayingUpdate(false);
      setUpdateIndex(0);
      setUpdateTitle("");
      setUpdateAlbumName("");
      setUpdateArtist("");
      setUpdateGenre("");
      setUpdateReleaseDate("");
      setUpdateRunningTime("");
      props.refreshSongList();
    });
  }

  function cancelUpdate(event) {
    event.preventDefault();
    setDisplayingUpdate(false);
    setUpdateIndex(0);
    setUpdateTitle("");
    setUpdateAlbumName("");
    setUpdateArtist("");
    setUpdateGenre("");
    setUpdateReleaseDate("");
    setUpdateRunningTime("");
    props.refreshSongList();
  }

  function setSearchtoArtist(event) {
    const artist_select = document.getElementById("artist_select");
    if (artist_select.value !== "Artist")
      props.setSearchTerm(
        (props.searchTerm + ' +artist:"' + artist_select.value + '"').trim()
      );
  }

  function setSearchtoGenre(event) {
    const genre_select = document.getElementById("genre_select");
    if (genre_select.value !== "Genre")
      props.setSearchTerm(
        (props.searchTerm + ' +genre:"' + genre_select.value + '"').trim()
      );
  }

  function changeRowToUpdate(event) {
    let index = event.target.id;
    if (index === "") {
      //sometimes the event.target is a path instead of the icon itself
      //and you can get the SVG from here
      index = event.target.ownerSVGElement.id;
    }
    index = parseInt(index);
    setUpdateIndex(index);
    let song = getSongByID(index);

    setDisplayingUpdate(true);
    setUpdateTitle(song.title);
    setUpdateAlbumName(song.album);
    setUpdateArtist(song.artist);
    setUpdateGenre(song.genre);
    setUpdateReleaseDate(song.release_date);
    setUpdateRunningTime(song.running_time);
  }

  function getSongByID(id) {
    for (let i = 0; i < props.songs.length; i++)
      if (props.songs[i].id === id) return props.songs[i];
    return null;
  }

  return (
    <form className="containingForm" onSubmit={handleSubmit}>
      <table id="MusicTable" className="table table-primary table-striped">
        <thead className="table-dark MusicTableHeader">
          <tr>
            <td>Title</td>
            <td>
              <select
                defaultValue={"Artist"}
                id="artist_select"
                onChange={setSearchtoArtist}
                className="form-select header_dropdown"
                aria-label="Artist Select"
              >
                <option value="Artist">Artist</option>
                {props.artistList.map((artist) => {
                  return (
                    <option
                      key={artist}
                      className="dropdown_item"
                      value={artist}
                    >
                      {artist}
                    </option>
                  );
                })}
              </select>
            </td>
            <td>Album</td>
            <td>Release Date</td>
            <td>
              <select
                defaultValue={"Genre"}
                id="genre_select"
                onChange={setSearchtoGenre}
                className="form-select header_dropdown"
                aria-label="Genre Select"
              >
                <option value="Genre">Genre</option>
                {props.genreList.map((genre) => {
                  return (
                    <option key={genre} className="dropdown_item" value={genre}>
                      {genre}
                    </option>
                  );
                })}
              </select>
            </td>
            <td>Run Time</td>
            <td></td>
          </tr>
        </thead>
        <tbody id="songsList">
          {props.songs
            .filter((song) => filterBySearchTerm(song, props.filterText))
            .map((song) => {
              calculated_runtime += song.running_time;

              return updateIndex !== song.id ? (
                <tr key={song.id} id={song.id}>
                  <td id={song.title}>{song.title}</td>
                  <td id={song.artist}>{song.artist}</td>
                  <td id={song.album}>{song.album}</td>
                  <td id={song.release_date}>
                    {formatDate(song.release_date)}
                  </td>
                  <td id={song.genre}>{song.genre}</td>
                  <td id={song.running_time}>
                    {format_seconds(song.running_time)}
                  </td>
                  <td className="regular_column">
                    <EditIcon
                      className="icon_TD"
                      id={song.id}
                      song_id={song.id}
                      onClick={(event) => changeRowToUpdate(event)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={song.id} id={song.id}>
                  <td>
                    <input
                      id="updateTitle"
                      type="text"
                      value={updateTitle}
                      required
                      onChange={(event) => setUpdateTitle(event.target.value)}
                    ></input>
                  </td>
                  <td>
                    <input
                      id="updateArtist"
                      value={updateArist}
                      type="text"
                      onChange={(event) => setUpdateArtist(event.target.value)}
                      required
                    ></input>
                  </td>
                  <td>
                    <input
                      id="updateAlbum"
                      value={updateAlbumnName}
                      type="text"
                      onChange={(event) =>
                        setUpdateAlbumName(event.target.value)
                      }
                      required
                    ></input>
                  </td>
                  <td>
                    <input
                      id="updateReleaseDate"
                      value={updateReleaseDate}
                      type="date"
                      onChange={(event) =>
                        setUpdateReleaseDate(event.target.value)
                      }
                      required
                    ></input>
                  </td>
                  <td>
                    <input
                      id="updateGenre"
                      value={updateGenre}
                      type="text"
                      onChange={(event) => setUpdateGenre(event.target.value)}
                      required
                    ></input>
                  </td>
                  <td>
                    <input
                      id="UpdateRunTime"
                      value={updateRunningTime}
                      type="text"
                      onChange={(event) =>
                        setUpdateRunningTime(event.target.value)
                      }
                      required
                    ></input>
                  </td>
                  <td className="buttonColumn">
                    <button className="btn btn-primary" value="update">
                      <EditIcon />
                    </button>
                    <button className="btn btn-secondary" value="cancel">
                      <CancelIcon />
                    </button>
                    <button className="btn btn-danger" value="delete">
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          {props.displayNewSongRow && !displayingUpdate ? (
            <tr>
              <td>
                <input
                  id="newTitle"
                  value={newTitle}
                  type="text"
                  onChange={(event) => setNewTitle(event.target.value)}
                  required
                ></input>
              </td>
              <td>
                <input
                  id="newArtist"
                  value={newArtist}
                  type="text"
                  onChange={(event) => setNewArtist(event.target.value)}
                  required
                ></input>
              </td>
              <td>
                <input
                  id="newAlbum"
                  value={newAlbumName}
                  type="text"
                  onChange={(event) => setNewAlbumName(event.target.value)}
                  required
                ></input>
              </td>
              <td>
                <input
                  id="newReleaseDate"
                  value={newReleaseDate}
                  type="date"
                  onChange={(event) => setNewReleaseDate(event.target.value)}
                  required
                ></input>
              </td>
              <td>
                <input
                  id="newGenre"
                  value={newGenre}
                  type="text"
                  onChange={(event) => setNewGenre(event.target.value)}
                  required
                ></input>
              </td>
              <td>
                <input
                  id="newRunTime"
                  value={newRunningTime}
                  type="text"
                  onChange={(event) => setNewRunningTime(event.target.value)}
                  required
                ></input>
              </td>
              <td>
                <button
                  type="submit"
                  value="add"
                  className="btn btn-primary addButton"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-file-earmark-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"></path>
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ) : null}
        </tbody>
        <tfoot className="table-dark">
          <tr>
            <td colSpan={7}>
              Total Playtime: {format_seconds(calculated_runtime)}
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  );
};

export default MusicTable;
