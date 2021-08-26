/* eslint-disable no-useless-constructor */
// import logo from './logo.svg';
import React from "react";
import "./App.css";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";
import { SearchBar } from "../SearchBar/SearchBar";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  search(term){
    Spotify.search(term).then(results => {
      this.setState({searchResults: results});
    })
  }
  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playlistName, trackUris).then(()=> {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  removeTrack(track){
    const tracks = this.state.playlistTracks.filter(curTrack => curTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }
  addTrack(track) {
    const tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
