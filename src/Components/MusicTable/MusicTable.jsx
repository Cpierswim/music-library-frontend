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
  debugger;
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

const MusicTable = (props) => {
  const [computedRuntime, setComputedRuntime] = useState(0);

  let calculated_runtime = 0;

  return (
    <table id="MusicTable" className="table table-primary table-striped">
      <thead className="table-dark MusicTableHeader">
        <tr>
          <td>Title</td>
          <td>Artist</td>
          <td>Album</td>
          <td>Release Date</td>
          <td>Genre</td>
          <td>likes</td>
        </tr>
      </thead>
      <tbody>
        {props.songs
          .filter((song) => {
            if (props.searchTerm === "") return true;
            let words = props.searchTerm.trim().split(" ");
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
                      props.searchTerm,
                      song.title,
                      song.artist,
                      song.album,
                      song.genre
                    );
                    break;
                }
              } else
                result = match(
                  props.searchTerm,
                  song.title,
                  song.artist,
                  song.album,
                  song.genre
                );
            }

            return result;
          })
          .map((song) => {
            calculated_runtime += song.running_time;
            return (
              <tr key={song.id}>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{formatDate(song.release_date)}</td>
                <td>{song.genre}</td>
                <td>{song.likes}</td>
              </tr>
            );
          })}
      </tbody>
      <tfoot className="table-dark">
        <tr>
          <td colSpan={6}>
            Total Playtime: {format_seconds(calculated_runtime)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default MusicTable;
