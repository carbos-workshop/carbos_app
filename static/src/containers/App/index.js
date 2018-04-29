import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'


/* application components */
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';

const getTheme = () => {
  let overwrites = {
    "palette": {
        "primary1Color": Colors.red400,
        "primary2Color": Colors.red500,
        "accent1Color": Colors.yellow400,
        "primary3Color": Colors.grey600,
        "accent2Color": Colors.grey800,
        "accent3Color": Colors.yellow300
    },
    "tabs": {
        "textColor": fade(Colors.darkWhite, 0.87),
        "selectedTextColor": Colors.white
    },
    "textField": {
        "errorColor": Colors.yellow500
    },
    "snackbar": {
        "textColor": Colors.red500,
        "backgroundColor": Colors.white,
        "actionColor": Colors.red500
    }
};
  return getMuiTheme(baseTheme, overwrites);
}

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: React.PropTypes.node,
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={getTheme()}>
                <section>
                    <Header />
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 250 }}
                    >
                        {this.props.children}
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
}

export { App };
