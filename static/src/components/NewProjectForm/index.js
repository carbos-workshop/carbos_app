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
import MapTest from '../Map';

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
        cityFieldValue: '',
        addressFieldValue: '',
        addresses:[{
          name: '1234 Lane',
        },
        {
          name: '5678 Place',
        },
        {
          name: '91011 Drive',
        }],
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
        case 'city':{
          this.setState({
            cityFieldValue: e.target.value
          })
          break
        }
        case 'address':{
          console.log(e)
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

  submit = () => {
    console.log('submit function called with:', this.state.nameFieldValue, this.state.cityFieldValue, this.state.addressFieldValue )
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
      }
    }

    return (
      <div className="container">

        <h2 style={styles.pageHeader}>New Project Creation</h2>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>Identify Valid Parcel</h3>}
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
              onChange={(e)=> { this.updateValue(e, 'name') }}
              value={this.state.nameFieldValue}
            />
            <TextField
              style={styles.formField}
              floatingLabelText="Your City"
              onChange={(e)=> { this.updateValue(e, 'city') }}
              value={this.state.cityFieldValue}
            />
            <RaisedButton
              style={styles.submitButton}
              primary={true}
              fullWidth={true}
              label="Submit Form"
              onClick={this.submit}
            />
          </CardText>
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title={<h3 style={styles.cardHeader}>Select Valid Property</h3>}
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
              floatingLabelText="Select a Valid Address"
              value={this.state.addressFieldValue}
              onChange={ (e, index, value)=> {this.updateValue(value, 'address')} }
            >
              <MenuItem value={null} primaryText="" />
              {
                this.state.addresses.map( (address, index) => (
                  <MenuItem key={index} value={address.name} primaryText={address.name} />
                ))
              }
            </SelectField>
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
            <MapTest />
          </CardText>
        </Card>

      </div>
    )
  }
}

export default muiThemeable()(NewProjectForm);
