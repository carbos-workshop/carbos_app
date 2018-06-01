import React from 'react';

/* components */
import  Login  from '../../components/Login';
import  Signup  from '../../components/Signup';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { getLightTheme, getDarkTheme } from '../../utils/customThemes.js';
import './styles/login.scss';

export default class LoginContainer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showLogin: false
        }
    }

    swapLoginView = () => {
        this.setState({
            showLogin: !this.state.showLogin,
        })
    }

    render() {
        return(
            <div className="login-container">
                <MuiThemeProvider muiTheme={getDarkTheme()}>
                    <Signup swapActive={this.swapLoginView} active={!this.state.showLogin} />
                </MuiThemeProvider>

                <MuiThemeProvider muiTheme={getLightTheme()}>
                    <Login swapActive={this.swapLoginView} active={this.state.showLogin} />
                </MuiThemeProvider>
            </div>
        )
    }
}
