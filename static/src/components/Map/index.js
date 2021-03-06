import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as actionCreators from '../../actions/theme';
import {
  Map,
  Polygon,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet'

//for custom Marker only
import L from 'leaflet';
import styles from './styles.scss'

function mapStateToProps(state) {
    return {
        currentTheme: state.theme.currentTheme,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class MapTest extends Component {

  constructor(props) {
      super(props);
      this.state = {
        currentTheme: this.props.currentTheme,
        url: this.getUrlLink()
      };
  }

  //returns true if light, false if dark
  readCurrentTheme = () => {
    if (this.props.currentTheme === 'light'){
      return true
    }
    else return false
  }

  //returns map tile url based on current theme
  getUrlLink = () => {
    if (this.readCurrentTheme()){
        return 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    }
    if (!this.readCurrentTheme()){
        return 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
    }
    else return null
  }

  render() {
    // const center = [51.52, -0.1]
    const center = this.props.coordinates ? this.props.coordinates[0] : [39.7392, -104.9903]

    const polygon = this.props.coordinates ? this.props.coordinates : []

    // const multiPolygon = [
    //   [[51.51, -0.12], [51.51, -0.13], [51.53, -0.13]],
    //   [[51.51, -0.05], [51.51, -0.07], [51.53, -0.07]],
    // ]

    // const rectangle = [[51.49, -0.08], [51.5, -0.06]]

    // const customMarker = new L.divIcon({className: 'tree'})

    // <Marker
    //   position={[51.5,-0.09]}
    //   icon={ customMarker }
    // >
    //   <Popup>
    //     <span>
    //       a sample tree marker
    //     </span>
    //   </Popup>
    // </Marker>
    // <Polygon color={this.props.muiTheme.palette.accent1Color} positions={polygon} />
    // <Polygon color={this.props.muiTheme.palette.accent1Color} positions={multiPolygon}>
    // <Popup>
    //   <span>Popup in Polygon</span>
    // </Popup>
    // </Polygon>
    // <Rectangle bounds={rectangle} color={this.props.muiTheme.palette.primary1Color} />

    return (
      <Map style={{height:'500px'}} center={center} zoom={16}>
        <TileLayer
          url={this.getUrlLink()}
        	attribution= '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        	subdomains= 'abcd'
        />
      <Polygon color={this.props.muiTheme.palette.primary1Color} positions={polygon}>
        <Popup>
          <div>
            <span>Square Feet: {this.props.parcelData.sqft}</span>
            <br/>
            <span>Carbon Value: {this.props.parcelData.carbonValue}</span>
          </div>
        </Popup>
      </Polygon>
      </Map>
    )
  }
}

export default muiThemeable()(MapTest);
