import React, { Component } from 'react'
import {
  Map,
  Polygon,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet'

export default class MapTest extends Component {
  render() {
    const center = [51.505, -0.09]

    const polygon = [[51.515, -0.09], [51.52, -0.1], [51.52, -0.12]]

    const multiPolygon = [
      [[51.51, -0.12], [51.51, -0.13], [51.53, -0.13]],
      [[51.51, -0.05], [51.51, -0.07], [51.53, -0.07]],
    ]

    const rectangle = [[51.49, -0.08], [51.5, -0.06]]

    return (
      <Map style={{height:'500px'}} center={center} zoom={13}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon color="purple" positions={polygon} />
        <Polygon color="purple" positions={multiPolygon}>
        <Popup>
          <span>Popup in Polygon</span>
        </Popup>
        </Polygon>
        <Rectangle bounds={rectangle} color="black" />
      </Map>
    )
  }
}
