import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
/* components */
import Explore from '../../components/Explore';

const ExploreContainer = (props) => (
  <MuiThemeProvider muiTheme={props.theme}>
        <Explore />
  </ MuiThemeProvider>
)

export { ExploreContainer }
