import React from "react";
import "./MusicTable.css";
import { useState } from "react";

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

function match(searchWord, ...wordsToCheck) {
  if (searchWord === "") return true;
  let reg = new RegExp(searchWord, "i");
  let result = false;
  for (let i = 0; i < wordsToCheck.length; i++) {
    let wordToCheck = wordsToCheck[i];
    let test = wordToCheck.match(reg);
    if (test != null) {
      result = true;
      break;
    }
  }

  return result;
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
  } else if (hours == 0 && minutes > 0) {
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

function filterBySearchTerm(song, searchTerm) {
  if (searchTerm === "") return true;
  let words = searchTerm.trim().split(" ");
  let result = false;
  for (let i = 0; i < words.length; i++) {
    if (words[i].includes(":")) {
      let split_colon = words[i].trim().split(":");
      let category = split_colon[0].toLowerCase();
      let seachTerm = split_colon[1].toLowerCase();
      switch (category) {
        case "title":
        case "t":
        case "ti":
          result = match(seachTerm, song.title);
          break;
        case "artist":
        case "ar":
          result = match(seachTerm, song.artist);
          break;
        case "album":
        case "al":
          result = match(seachTerm, song.album);
          break;
        case "genre":
        case "g":
        case "ge":
          result = match(seachTerm, song.genre);
          break;
        default:
          result = match(
            searchTerm,
            song.title,
            song.artist,
            song.album,
            song.genre
          );
          break;
      }
    } else
      result = match(
        searchTerm,
        song.title,
        song.artist,
        song.album,
        song.genre
      );
  }

  return result;
}

function getSecondsFromString(timeString) {
  let split = timeString.split(":");
  let minutes = 0;
  let seconds = 0;
  if (split.length == 2) {
    minutes = parseInt(split[0]);
    seconds = parseInt(split[1]);
    seconds += minutes * 60;
  } else if (split.length == 1) {
    seconds = parseInt(split[0]);
  }

  return seconds;
}

const MusicTable = (props) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState("");
  const [newRunningTime, setNewRunningTime] = useState("");

  let calculated_runtime = 0;

  function addNewSong(event) {
    event.preventDefault();
    setNewTitle(newTitle.trim());
    setNewAlbumName(newAlbumName.trim());
    setNewArtist(newArtist.trim());
    setNewGenre(newGenre.trim());
    setNewReleaseDate(newReleaseDate.trim());
    setNewRunningTime(newRunningTime.trim());

    if (
      newTitle !== "" &&
      newArtist !== "" &&
      newAlbumName !== "" &&
      newGenre !== "" &&
      newReleaseDate !== "" &&
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

  function setSearchtoArtist(event) {
    debugger;
    const artist_select = document.getElementById("artist_select");
    if (artist_select.value != "Artist")
      props.setSearchTerm("artist:" + artist_select.value);
  }

  function setSearchtoGenre(event) {
    debugger;
    const genre_select = document.getElementById("genre_select");
    if (genre_select.value != "Genre")
      props.setSearchTerm("genre:" + genre_select.value);
  }

  return (
    <form onSubmit={addNewSong}>
      <table id="MusicTable" className="table table-primary table-striped">
        <thead className="table-dark MusicTableHeader">
          <tr>
            <td>Title</td>
            <td>
              <select
                id="artist_select"
                onChange={setSearchtoArtist}
                className="form-select header_dropdown"
                aria-label="Artist Select"
              >
                <option selected>Artist</option>
                {props.artistList.map((artist) => {
                  return (
                    <option className="dropdown_item" value={artist}>
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
                id="genre_select"
                onChange={setSearchtoGenre}
                className="form-select header_dropdown"
                aria-label="Genre Select"
              >
                <option selected>Genre</option>
                {props.genreList.map((genre) => {
                  return (
                    <option className="dropdown_item" value={genre}>
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

              return (
                <tr key={song.id}>
                  <td>{song.title}</td>
                  <td id={song.id + "_artist"}>{song.artist}</td>
                  <td>{song.album}</td>
                  <td>{formatDate(song.release_date)}</td>
                  <td id={song.id + "_genre"}>{song.genre}</td>
                  <td>{format_seconds(song.running_time)}</td>
                  <td></td>
                </tr>
              );
            })}
          {props.displayNewSongRow ? (
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
                <button type="submit" className="btn btn-primary addButton">
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
