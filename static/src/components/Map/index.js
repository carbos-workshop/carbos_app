import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

export default class SimpleExample extends Component {
  state = {
    lat: 39.612381,
    lng: -104.921524,
    zoom: 17,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    const styles = {
      map:{
        height: '400px',
      },
    }
    return (
      <Map style={styles.map} center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    )
  }
}
