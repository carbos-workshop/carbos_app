import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import RightMenuToggle from './RightMenuToggle';
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
          headerRightWrapper: {
            display: 'inline-flex',
          },
          headerRight: {
            display: 'inline-flex',
            alignItems: 'center',
          },
          svgIcon: {
            height: '24px',
            width: '24x',
          },
          toggle: {
            style: {
              width: 'auto',
              marginRight: '15px',
            },
            knobOn: {
              backgroundColor: '#FFFFFF'
            },
            knobOff: {
              backgroundColor: '#212121',
            },
            track: {
              backgroundColor: '#e1e1e1'
            }
          }
        }

        return (
            <header>
                <Drawer
                  open={this.state.open}
                  docked={false}
                  width={200}
                  onRequestChange={(open) => this.setState({open})}>
                    {
                        !this.props.isAuthenticated ?
                            <div>
                              <MenuItem onClick={() => this.dispatchNewRoute('/explore')}>
                                  Explore
                              </MenuItem>
                              <MenuItem onClick={() => this.dispatchNewRoute('/new/project')}>
                                  Project Creation MVP
                              </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/explore')}>
                                    Explore
                                </MenuItem>
                                <MenuItem onClick={() => this.dispatchNewRoute('/new/project')}>
                                    Project Creation MVP
                                </MenuItem>
                                <MenuItem onClick={() => this.dispatchNewRoute('/main')}>
                                    Home
                                </MenuItem>
                                <Divider />

                                <MenuItem onClick={(e) => this.logout(e)}>
                                    Logout
                                </MenuItem>
                            </div>
                    }
                </Drawer>
                <AppBar
                  title={this.props.pageTitle || 'Carbos'}
                  onLeftIconButtonTouchTap={() => this.openNav()}
                  iconStyleRight={style.headerRightWrapper}
                  iconElementRight={
                        <div style={style.headerRight}>
                          <Moon color={'#212121'} style={style.svgIcon} />
                          <Toggle trackSwitchedStyle={style.toggle.track} thumbStyle={style.toggle.knobOff} thumbSwitchedStyle={style.toggle.knobOn} onToggle={this.state.changeTheme} style={style.toggle.style} />
                          <Sun color={'white'} style={style.svgIcon} />
                          <RightMenuToggle isAuthenticated={this.props.isAuthenticated} logout={this.logout} />
                        </div>                   }
                />
            </header>

        );
    }
}

Header.propTypes = {
    pageTitle: React.PropTypes.string,
    changeTheme: React.PropTypes.func,
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};

export default muiThemeable()(Header);
