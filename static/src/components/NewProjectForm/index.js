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
import { get_abi } from '../../utils/web3.js';

import Web3 from 'web3';
import Tx from 'ethereumjs-tx'

import cssStyles from './styles.scss'

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
        awaitingBlock: false,
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
        confirmations: 0,
        transactionHash:null,
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
            carbonValue: res.data.carbon_index,
          }
        })
      })
  }

  submitProject = () => {
    this.setState({
      awatingBlock: true,
    })
    let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Z94APTDSX23QQ338SKR8CC1GUPYS8EDDVA'));
    get_abi()
      .then( res => {
        let abi = JSON.parse(res.data.result)
        let tempAddress = web3.eth.accounts.create()
        let Carbos = new web3.eth.Contract(abi, '0xcCD07F547c5DA7adcb71992e33bBAa292d2B9EB6');

        let payload = {
          address: tempAddress.address,
          value: Math.floor(this.state.parcelData.carbonValue),
          coordinates:  /*TEMP*/ Math.floor(this.state.addressCoordinates[0][0] * 10e12), /*TEMP*/
        }
        console.log('sending transaction with payload: ', payload )

        //---------------- raw transaction stuff-------------------------

        // the address that will send the test transaction
        const addressFrom = '0x652634051cb3c72799e724de51a5a7a8a916f986' //dummy wallet
        const privKey = 'ea42d3b3b8418979fe176ee5821714b4587dde7edb6db4a6e019a47a5765d083'

        // the destination address
        const contractAddress = '0xcCD07F547c5DA7adcb71992e33bBAa292d2B9EB6' //contrct

        // // get the number of transactions sent so far so we can create a fresh nonce
        web3.eth.getTransactionCount(addressFrom).then(txCount => {
        let data = Carbos.methods.createProject(payload.address, payload.value, payload.coordinates).encodeABI(); //get and package methods for transaction
        let rawTx = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(10e9), // 10 Gwei
            gasLimit: web3.utils.toHex(100000),
            to: contractAddress,
            // "value": "0x00", //not for non-transactional contract methods
            data: data,
        }
        const privateKey = new Buffer(privKey, 'hex')
        const transaction = new Tx(rawTx)
        transaction.sign(privateKey)
        const serializedTx = '0x' + transaction.serialize().toString('hex')
        web3.eth.sendSignedTransaction(serializedTx)
          .on('transactionHash',txHash => {
            this.setState({
              transactionHash: txHash,
            })
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            this.setState({
              confirmations: this.state.confirmations + 1
            })
            Carbos.methods.getProject(tempAddress.address)
              .call()
                .then(res => {
                  this.setState({
                    parcelContractInfo: {
                      holder: tempAddress.address,
                      amount: res.carbonValue,
                      geoLocation: res.geoLocation,
                    },
                    //awaitingBlock: false
                  })
                })
          }).on('error', (error) => {
            console.log(error)
            this.setState({
              awaitingBlock: false
            })
          })
      })//txCount end



        //---------------------------------------------------------------
      })
  }

  storePromiseResponse = (paylod, type) => {
    switch(type){
      case 'txHash':{
        this.setState({
          transactionHash: payload,
        })
        break
      }
      case 'confirmation':{
        this.setState({
          confirmations: this.state.confirmations + payload
        })
        break
      }
      case 'contractInfo':{
        this.setState({
          parcelContractInfo: {
            holder: tempAddress.address,
            amount: res.data.carbonValue,
            geoLocation: res.data.geoLocation,
          }
        })
        break
      }
    }
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
      loading:{
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
      }
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
              disabled={(!this.state.parcelData.carbonValue || this.state.awatingBlock)}
              onClick={this.submitProject}
              primary={true}
              fullWidth={true}
              label="Deploy Project"
            />
            <div style={styles.deploymentDiv}>
              {
                this.state.transactionHash
                ?
                <div>
                  <h4> Deployment Information: </h4>
                  <p className="link"><a target="_blank" href={"https://ropsten.etherscan.io/tx/" + this.state.transactionHash}>View Transaction on Etherscan</a></p>
                  <p>Transaction Hash: {this.state.transactionHash}</p>
                  {
                    this.state.parcelContractInfo.amount
                    ?
                    <div>
                      <p>Number of confirmations: {this.state.confirmations}</p>
                      <p>Contract Owner Address: {this.state.parcelContractInfo.holder}</p>
                      <p>Potential Carbon Index: {this.state.parcelContractInfo.amount}</p>
                      <p>GeoCode: {this.state.parcelContractInfo.geoLocation}</p>
                    </div>
                    :
                    <div>
                      <p>Waiting for Confirmation Blocks...</p>
                      <p>(This can take anywhere from 30 seconds to 5 minutes)</p>
                      <div className="loading-ring"></div>
                    </div>
                  }
                </div>
                :
                <div style={styles.loading}>
                  {
                    (this.state.awatingBlock && !this.state.transactionHash)
                    ?
                    <div className="loading-ring"></div>
                    : null
                  }
                </div>
              }
            </div>
          </CardText>
        </Card>

      </div>
    )
  }
}

export default muiThemeable()(NewProjectForm);
