import "./App.css";
import { useState, useEffect } from "react";
import MusicTable from "./Components/MusicTable/MusicTable";
import SearchBar from "./Components/SearchBar/SearchBar";
import axios from "axios";

function App() {
  const [songs, setSongs] = useState([]);
  const [runningTime, setRunningTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayNewSongRow, setDisplayNewSongRow] = useState(true);

  useEffect(() => {
    getAllSongs();
  }, []);

  async function getAllSongs() {
    let response = await axios.get("http://127.0.0.1:5000/api/songs");
    setSongs(response.data.songs);
    setRunningTime(response.data.total_running_time);
  }

  async function refreshSongList() {
    let response = await axios.get("http://127.0.0.1:5000/api/songs");
    setSongs(response.data.songs);
    setRunningTime(response.data.total_running_time);
  }

  async function addNewSong(song) {
    let response = await axios.post("http://127.0.0.1:5000/api/songs", song);
    return response;
  }

  return (
    <div className="App">
      <SearchBar
        setSearchTerm={setSearchTerm}
        displayNewSongRow={displayNewSongRow}
        setDisplayNewSongRow={setDisplayNewSongRow}
      />
      <MusicTable
        songs={songs}
        runningTime={runningTime}
        searchTerm={searchTerm}
        addNewSong={addNewSong}
        refreshSongList={refreshSongList}
        displayNewSongRow={displayNewSongRow}
      />
    </div>
  );
}

export default App;
