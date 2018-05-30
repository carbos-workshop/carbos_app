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
import { get_contract, test_things } from '../../utils/web3.js';

import Web3 from 'web3';


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
          sqft: null,
          carbonValue: null,
        },
        parcelContractInfo: {
          holder: null,
          amount: null,
          geoLocation: null,
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
            carbonValue: res.data.carbon_index, //placeholder
          }
        })
      })
  }

  submitProject = () => {
    let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Z94APTDSX23QQ338SKR8CC1GUPYS8EDDVA'));
    test_things()
      .then( res => {
        let abi = JSON.parse(res.data.result)
        let tempAddress = web3.eth.accounts.create() //TEMP
        let Carbos = new web3.eth.Contract(abi, '0xcCD07F547c5DA7adcb71992e33bBAa292d2B9EB6');
        let createProjectEvent = Carbos.events.ProjectInfo({}, 'latests');

        console.log('sending', {
          address: tempAddress.address,
          value: this.state.parcelData.carbonValue,
    //      coordinates:  /*TEMP*/ this.state.addressCoordinates[0][0], /*TEMP*/
        })
        console.log(web3)

        Carbos.methods.createProject("0x920E54ba8fABf39A19B644655745786254f8ebd1", 7604.69544501745, 39.5913516676769)
          .send({
            from: '0x652634051Cb3c72799E724DE51a5A7A8A916f986',
            gasPrice: '500000',
            gas: 10000000,
          }) .then((error,result) => { console.log(error);console.log(result) })

        //let test =  web3.utils.toChecksumAddress('0x652634051cb3c72799e724de51a5a7a8a916f986')
        //console.log(test)
        // web3.eth.getTransaction('0x874ff6b7447e9463224343522c99939bceaf9ea6a68a523f348608bd28d0df67')
        //   .then(console.log)
        Carbos.methods.getProject("0x652634051cb3c72799e724de51a5a7a8a916f986")
         .call()
           .then(result => { console.log(result) })
      })
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
              floatingLabelText="Your Last Name"
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
            <p style={styles.p}> This feature is in development </p>
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
              <p>{this.state.parcelContractInfo.holder}</p>
              <p>{this.state.parcelContractInfo.amount}</p>
              <p>{this.state.parcelContractInfo.geoLocation}</p>
            </div>
          </CardText>
        </Card>

      </div>
    )
  }
}

export default muiThemeable()(NewProjectForm);
