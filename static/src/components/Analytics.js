import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
//this makes the theme toggle work
import muiThemeable from 'material-ui/styles/muiThemeable';

//axios for http stuff
import axios from 'axios';

//material ui input field and button
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

//this stuff has to do with managing state on an application wide level...
//useful when building big, complex components, but net necesarry for react to work

// function mapStateToProps(state) {
//     return { };
// }
//
// function mapDispatchToProps(dispatch) {
//     return bindActionCreators(actionCreators, dispatch);
// }
// @connect(mapStateToProps, mapDispatchToProps)
class Analytics extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        inputFieldValue: '',
      }
  }

    //sample axios call
    post_a_message = message => {
        return axios.post('/api/whatever', {
            message
        });
    }

    get_a_thing = () => {
      return axios.get('/api/special_thing_location');
    }

    updateValue = e => {
        this.setState({
          inputFieldValue: e.target.value
        })
    }

    submit = () => {
      console.log('submit function called with:', this.state.inputFieldValue)
      //post_a_message(this.state.inputFieldValue)
    }

    render() {

        //build inline styles as an object if you want..
        //they can also be imported or written the traditional way in scss/css
        const style = {
          wrapper: {
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          },
        }

        return (
            <div className="col-md-8" style={style.wrapper}>
                <h1>Analytics</h1>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Input Label"
                    onChange={(e)=> { this.updateValue(e) }}
                    value={this.state.inputFieldValue}
                  />
                <RaisedButton
                  primary={true}
                  label="Submit Input Field Value"
                  onClick={this.submit}
                />
            </div>
        );
    }
}

export default muiThemeable()(Analytics);
