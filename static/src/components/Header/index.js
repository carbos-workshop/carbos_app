import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import BackIcon from '@material-ui/icons/arrowBack';
// import LeftNav from 'material-ui/Drawer';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';

import * as actionCreators from '../../actions/auth';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

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
@withStyles(styles)
class Header extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open: false,
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

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
      };

    handleClose() {
      this.setState({ anchorEl: null });
    };


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
        return (
            <div className={this.props.classes.root}>
              <AppBar position="static">
                <Toolbar>
                  <IconButton className={this.props.classes.menuButton} color="inherit">
                    <BackIcon />
                  </IconButton>
                  <Typography variant="title" color="inherit" className={this.props.classes.flex}>
                    {this.props.title || 'Carbos'}
                  </Typography>
                  <Button variant="flat" color="inherit" onClick={() => this.dispatchNewRoute('/Login')}>Login</Button>
                  <Button variant="flat" color="inherit" onClick={() => this.dispatchNewRoute('/Register')}>Register</Button>
                  <Button variant="flat" color="inherit" onClick={() => this.dispatchNewRoute('/')}>Home</Button>
                </Toolbar>
              </AppBar>
            </div>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
};

export { Header };
