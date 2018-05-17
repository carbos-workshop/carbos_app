import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { getLightTheme, getDarkTheme } from '../../utils/customThemes.js';

/* application components */
import Header from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';

import * as actionCreators from '../../actions/theme';

function mapStateToProps(state) {
    return {
        currentTheme: state.theme.currentTheme,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
        children: React.PropTypes.node,
        currentTheme: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentTheme: this.props.currentTheme
        };
    }


    changeTheme = () => {
      switch(this.props.currentTheme){
        case 'dark':{
          this.props.changeTheme('light')
          break
        }
        case 'light':{
          this.props.changeTheme('dark')
          break
        }
        default:{
          break
        }
      }
    }

    getTheme = () => {
      switch(this.props.currentTheme){
        case 'dark':{
          return getDarkTheme()
          break
        }
        case 'light':{
          return getLightTheme()
          break
        }
        default:{
          break
        }
      }
    }


    render() {
        return (
            <MuiThemeProvider muiTheme={this.getTheme()}>
                <div className={this.props.currentTheme + ' app'}>
                    <Header changeTheme={this.changeTheme}/>
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 250 }}
                    >
                        {React.cloneElement(this.props.children, { theme: this.getTheme() })}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export { App };
