import "./App.css";
import { useState, useEffect } from "react";
import MusicTable from "./Components/MusicTable/MusicTable";
import SearchBar from "./Components/SearchBar/SearchBar";
import axios from "axios";
import NavBar from "./Components/NavBar/NavBar";

function App() {
  const [songs, setSongs] = useState([]);
  const [runningTime, setRunningTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayNewSongRow, setDisplayNewSongRow] = useState(true);
  const [artistList, setArtistList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    getAllSongs();
  }, []);

  async function getAllSongs() {
    let response = await axios.get("http://127.0.0.1:5000/api/songs");
    setSongs(response.data.songs);
    setRunningTime(response.data.total_running_time);
    setLists(response.data.songs);
  }

  function setLists(songs) {
    let artistSet = new Set();
    let genreSet = new Set();
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      artistSet.add(song.artist);
      genreSet.add(song.genre);
    }
    let artistList = Array.from(artistSet);
    let genreList = Array.from(genreSet);
    artistList = artistList.sort();
    genreList = genreList.sort();
    setArtistList(artistList);
    setGenreList(genreList);
  }

  async function refreshSongList() {
    getAllSongs();
  }

  async function addNewSong(song) {
    let response = await axios.post("http://127.0.0.1:5000/api/songs", song);
    return response;
  }

  async function updateSong(song) {
    let response = await axios.put(
      "http://127.0.0.1:5000/api/songs/" + song.id,
      song
    );
    return response;
  }

  async function deleteSong(song_id) {
    let response = await axios.delete(
      "http://127.0.0.1:5000/api/songs/" + song_id
    );
    return response;
  }

  return (
    <div className="App">
      <NavBar />
      <SearchBar
        setSearchTerm={setSearchTerm}
        displayNewSongRow={displayNewSongRow}
        setDisplayNewSongRow={setDisplayNewSongRow}
        searchTerm={searchTerm}
        setFilterText={setFilterText}
      />
      <MusicTable
        songs={songs}
        runningTime={runningTime}
        searchTerm={searchTerm}
        addNewSong={addNewSong}
        refreshSongList={refreshSongList}
        displayNewSongRow={displayNewSongRow}
        artistList={artistList}
        genreList={genreList}
        setSearchTerm={setSearchTerm}
        filterText={filterText}
        updateSong={updateSong}
        deleteSong={deleteSong}
      />
    </div>
  );
}

export default App;
