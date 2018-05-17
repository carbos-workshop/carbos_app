import React from 'react';
import { browserHistory } from 'react-router';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import More from 'material-ui/svg-icons/navigation/more-vert';

const RightMenuToggle = (props) => (
  <IconMenu
    iconButtonElement={
      <IconButton iconStyle={{color: props.muiTheme.palette.canvasColor}}>
        <More />
      </IconButton>
    }
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    {
      !props.isAuthenticated ?
        <div>
          <MenuItem primaryText="Signup" onClick={ () => {browserHistory.push('/welcome')} } />
          <MenuItem primaryText="Login" onClick={ () => {browserHistory.push('/welcome')} } />
        </div>
      :
        <div>
          <MenuItem primaryText="Settings" onClick={ () => {browserHistory.push('/settings')} }/>
          <Divider />
          <MenuItem primaryText="Logout" onClick={ () => {props.logout(e)} }/>
        </div>  
    }
  </IconMenu>
);

export default muiThemeable()(RightMenuToggle);
