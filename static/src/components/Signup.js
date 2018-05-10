import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ExploreIcon from 'material-ui/svg-icons/action/explore';

import * as actionCreators from '../actions/auth';

import { validateEmail } from '../utils/misc';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Signup extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
            containerShown: this.props.active,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });

        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }

        if (this.state.password === '' || !this.state.password) {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });

        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.props.registerUser(this.state.email, this.state.password, this.state.redirectTo);
    }

    swapToLoginView() {
        this.props.swapActive()
    }


    linkToExplore(){
        console.log('link to explore page')
    }
    
	render(){

		const styles = {
			width: '70%',
			margin: '1em 0',
		}

		return (
			<div className={this.props.active ? 'signup active' : 'signup'}>
				<div className="signup-fields">
					<h1>Signup</h1>
                    <TextField
                      style={styles}
                      hintText="Email"
                      floatingLabelText="Email"
                      type="email"
                      errorText={this.state.email_error_text}
                      onChange={(e) => this.changeValue(e, 'email')}
                    />
		            <TextField
		              style={styles}
                      hintText="Password"
                      floatingLabelText="Password"
                      type="password"
                      errorText={this.state.password_error_text}
                      onChange={(e) => this.changeValue(e, 'password')}
                    />

                    <div className="signup-buttons">
                        <RaisedButton
                          disabled={this.state.disabled}
                          primary={true}
                          style={{ marginTop: 50 }}
                          label="Signup"
                          onClick={(e) => this.login(e)}
                        />
                        <FlatButton
                          style={{ marginTop: 50 }}
                          label="Login"
                          onClick={(e) => {this.swapToLoginView()}}
                        />
                    </div>
				</div>
                <div className="fab-container">
                    <FloatingActionButton onClick={this.linkToExplore}>
                        <ExploreIcon />
                    </FloatingActionButton>
                </div>
			</div>
		)
	}
}

Signup.propTypes = {
    registerUser: React.PropTypes.func,
    active: React.PropTypes.bool,
    registerStatusText: React.PropTypes.string,
};