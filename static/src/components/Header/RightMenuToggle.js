import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import More from 'material-ui/svg-icons/navigation/more-vert';

const RightMenuToggle = (props) => (
  <IconButton iconStyle={{color: props.muiTheme.palette.canvasColor}}>
    <More />
  </IconButton>
);

export default muiThemeable()(RightMenuToggle);
