import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import Sun from 'material-ui/svg-icons/image/brightness-5';
import Moon from 'material-ui/svg-icons/image/brightness-2';

import * as actionCreators from '../../actions/auth';

function mapStateToProps(state) {
    return {

        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            changeTheme: this.props.changeTheme
        };

    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {

        const style = {
          headerRight: {
            display: 'inline-flex',
            alignItems: 'flex-end',
            margin: '12px 24px 0 0',
          },
          toggle: {
            knob: {
              backgroundColor: '#FFFFFF'
            },
            track: {
              backgroundColor: '#e1e1e1'
            }
          }
        }

        return (
            <header>
                <LeftNav open={this.state.open}>
                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/login')}>
                                    Login
                                </MenuItem>
                                <MenuItem onClick={() => this.dispatchNewRoute('/register')}>
                                    Register
                                </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/analytics')}>
                                    Analytics
                                </MenuItem>
                                <Divider />

                                <MenuItem onClick={(e) => this.logout(e)}>
                                    Logout
                                </MenuItem>
                            </div>
                    }
                </LeftNav>
                <AppBar
                  title="React-Redux-Flask"
                  onLeftIconButtonTouchTap={() => this.openNav()}
                  iconElementRight={

                        <div style={style.headerRight}>
                          <Moon color={'#212121'}/>
                          <Toggle trackSwitchedStyle={style.toggle.track} thumbSwitchedStyle={style.toggle.knob} onToggle={this.state.changeTheme}/>
                          <Sun color={'white'}/>
                        </div>                   }
                />
            </header>

        );
    }
}

Header.propTypes = {
    changeTheme: React.PropTypes.func,
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};

export default muiThemeable()(Header);
