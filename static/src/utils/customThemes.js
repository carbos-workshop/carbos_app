import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseDarkTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import baseLightTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

export function getDarkTheme() {
  let overwrites = {
  	"fontFamily": 'Oxygen, sans-serif',
    "palette": {
        "canvasColor": Colors.grey900,
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
    "raisedButton": {
        "primaryTextColor": Colors.white
    },
    "textField": {
        // "errorColor": Colors.yellow500
    },
    "snackbar": {
        "textColor": Colors.red500,
        "backgroundColor": Colors.white,
        "actionColor": Colors.red500
    }
};
  return getMuiTheme(baseDarkTheme, overwrites);
}

export function getLightTheme() {
  let overwrites = {
  	"fontFamily": 'Oxygen, sans-serif',
    "tabs": {
        "textColor": Colors.red400,
        "selectedTextColor": Colors.red500,
        "backgroundColor": Colors.white
    },
    "textField": {
        "errorColor": Colors.red500
    },
    "snackbar": {
        "textColor": Colors.white,
        "backgroundColor": fade(Colors.darkBlack, 0.87),
        "actionColor": Colors.red500
    },
    "palette": {
        "primary1Color": Colors.red400,
        "primary2Color": Colors.red500,
        "accent1Color": Colors.black,
        "primary3Color": Colors.grey600,
        "accent2Color": Colors.grey700,
        "accent3Color": Colors.grey500,
        "pickerHeaderColor": Colors.red300,
        "alternateTextColor": Colors.white
    }
};
  return getMuiTheme(baseLightTheme, overwrites);
}
