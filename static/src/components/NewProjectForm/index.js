import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MapWindow from '../Map';
import { post_address_id, post_owner_name_and_zip } from '../../utils/new_project.js';

import * as actionCreators from '../../actions/theme';

function mapStateToProps(state) {
    return {
        // currentTheme: state.theme.currentTheme,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class NewProjectForm extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        // currentTheme: this.props.currentTheme,
        nameFieldValue: '',
        zipFieldValue: '',
        addressFieldValue: '',
        addresses:[],
        addressCoordinates: null,
        parcelData: {
          sqft: 0,
          carbonValue: 42,
        },
      };
  }

  updateValue = (e, type) => {
      switch(type){
        case 'name':{
          this.setState({
            nameFieldValue: e.target.value
          })
          break
        }
        case 'zip':{
          this.setState({
            zipFieldValue: e.target.value
          })
          break
        }
        case 'address':{
          this.setState({
            addressFieldValue: e
          })
          break
        }
        default: {
          break
        }
      }
  }

  submitInfo = () => {
    // console.log('submitInfo function called with:', this.state.nameFieldValue, this.state.zipFieldValue, this.state.addressFieldValue )
    post_owner_name_and_zip(this.state.nameFieldValue, this.state.zipFieldValue)
      .then( res => {
        this.setState({
          addresses: res.data
        })
      })
  }

  submitAddress = () => {
    post_address_id(this.state.addressFieldValue)
      .then( res => {
        this.setState({
          addressCoordinates: this.formatCoordinateStringResponse(res.data.coordinates),
          parcelData: {
            sqft: res.data.sqft,
            carbonValue: 42, //placeholder
          }
        })
      })
  }

  submitProject = () => {
    console.log('submitting project')
  }

  //the endpoint for address_if returns an array that is currently a giant string.
  //this method converts the string back into an actual array
  formatCoordinateStringResponse = coordinateString => {
    let coordinateStringArray = coordinateString.split('[')
    let formattedCoordinateStringArray = coordinateStringArray.map( pair => {
      return pair.slice(0,-2).split(',')
    })
    formattedCoordinateStringArray.shift()
    let coordinateNumberArray = formattedCoordinateStringArray.map( coordinate => {
      return [ Number(coordinate[0]), Number(coordinate[1]) ]
    })
    return coordinateNumberArray
  }

  render() {

    const styles = {
      pageHeader:{
        marginBottom: '1.5em',
        color: this.props.muiTheme.palette.textColor,
      },
      card:{
        margin: '1em 0',
      },
      cardHeader:{
        lineHeight:'40px',
        margin:'0',
      },
      formField: {
        display: 'block',
      },
      submitButton: {
        marginTop:'2em',
      },
      p: {
        textAlign: 'center',
      },
      deploymentDiv : {
        margin: '1em 0',
      },
    }

    return (
      <div className="container">

        <h2 style={styles.pageHeader}>New Project Creation</h2>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>Identify Valid Parcel by Ownership</h3>}
            avatar={
              <Avatar
               color={'white'}
               backgroundColor={this.props.muiTheme.palette.primary1Color}
               >
               1
              </Avatar>
            }
          >
          </CardHeader>
          <CardText>
            <TextField
              style={styles.formField}
              floatingLabelText="Your Name"
              fullWidth={true}
              onChange={(e)=> { this.updateValue(e, 'name') }}
              value={this.state.nameFieldValue}
            />
            <TextField
              style={styles.formField}
              floatingLabelText="Your Zip Code"
              fullWidth={true}
              onChange={(e)=> { this.updateValue(e, 'zip') }}
              value={this.state.zipFieldValue}
            />
            <RaisedButton
              style={styles.submitButton}
              disabled={this.state.zipFieldValue === '' || this.state.nameFieldValue === ''}
              primary={true}
              fullWidth={true}
              label="Submit Owner Info"
              onClick={this.submitInfo}
            />
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>Select Valid Property Address</h3>}
            avatar={
              <Avatar
               color={'white'}
               backgroundColor={this.props.muiTheme.palette.primary1Color}
               >
               2
              </Avatar>
            }
          >
          </CardHeader>
          <CardText>
            <SelectField
              fullWidth={true}
              disabled={this.state.addresses.length <= 0}
              floatingLabelText="Select Your Address"
              value={this.state.addressFieldValue}
              onChange={ (e, index, value)=> {this.updateValue(value, 'address')} }
            >
              {
                this.state.addresses.map( (address, index) => (
                  <MenuItem key={address.id} value={address.id} primaryText={address.address} />
                ))
              }
            </SelectField>
            <RaisedButton
              disabled={this.state.addressFieldValue === ''}
              style={styles.submitButton}
              primary={true}
              fullWidth={true}
              label="Submit Selected Address"
              onClick={this.submitAddress}
            />
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>View Parcel Calculations</h3>}
            avatar={
              <Avatar
               color={'white'}
               backgroundColor={this.props.muiTheme.palette.primary1Color}
               >
               3
              </Avatar>
            }
          >
          </CardHeader>
          <CardText>
            <MapWindow coordinates={this.state.addressCoordinates} parcelData={this.state.parcelData}/>
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>Project Additionalities</h3>}
            avatar={
              <Avatar
               color={'white'}
               backgroundColor={this.props.muiTheme.palette.primary1Color}
               >
               4
              </Avatar>
            }
          >
          </CardHeader>
          <CardText>
            <p style={styles.p}> This feature is still in development </p>
            <RaisedButton
              disabled={true}
              style={styles.submitButton}
              primary={true}
              fullWidth={true}
              label="Submit Additionalities"
            />
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>Project Deployment</h3>}
            avatar={
              <Avatar
               color={'white'}
               backgroundColor={this.props.muiTheme.palette.primary1Color}
               >
               5
              </Avatar>
            }
          >
          </CardHeader>
          <CardText>
            <RaisedButton
              disabled={false}
              onClick={this.submitProject}
              primary={true}
              fullWidth={true}
              label="Deploy Project"
            />
            <div style={styles.deploymentDiv}>
              <h4> Deployment Information: </h4>
            </div>
          </CardText>
        </Card>

      </div>
    )
  }
}

export default muiThemeable()(NewProjectForm);
