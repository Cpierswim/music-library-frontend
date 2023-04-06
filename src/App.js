import "./App.css";
import { useState, useEffect } from "react";
import MusicTable from "./Components/MusicTable/MusicTable";
import SearchBar from "./Components/SearchBar/SearchBar";
import axios from "axios";

function App() {
  const [songs, setSongs] = useState();

  useEffect(() => {
    getAllSongs();
  }, []);

  async function getAllSongs() {
    let response = await axios.get("http://127.0.0.1:5000/api/songs");
    setSongs(response.data);
  }

  return (
    <div className="App">
      <SearchBar />
      <MusicTable songs={songs} />
    </div>
  );
}

export default App;
