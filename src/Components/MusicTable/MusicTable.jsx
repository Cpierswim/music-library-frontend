import React from "react";
import "./MusicTable.css";

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

const MusicTable = (props) => {
  return (
    <table className="table table-striped">
      <thead>
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
        {props.songs.songs.map((song, index) => {
          return (
            <tr key={index}>
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
      <tfoot>
        <tr>
          <td colSpan={6}>Total Playtime: {props.songs.total_running_time}</td>
        </tr>
      </tfoot>
    </table>
  );
};

export default MusicTable;
