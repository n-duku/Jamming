import React from "react";
import "./Playlist.css";
import { TrackList } from "../TrackList/TrackList";

export class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(e) {
    const newName = e.target.value;
    this.props.onNameChange(newName);
  }
  render() {
    return (
      <div className="Playlist">
        <input onChange={this.handleNameChange} defaultValue={"New Playlist"} />
        <TrackList
          isRemoval={true}
          onAdd={this.props.onAdd}
          onRemove={this.props.onRemove}
          tracks={this.props.playlistTracks}
        />
        <button onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
    );
  }
}
