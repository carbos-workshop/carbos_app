import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProtectedView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
    }

    render() {

        const styles = {
          intro: {
            color: this.props.muiTheme.palette.textColor,
          },
          introText: {
            marginTop: '4em',
          },
          link: {
            color: this.props.muiTheme.palette.primary1Color,
            cursor: 'pointer',
          },
        }

        return (
            <div style={styles.intro}>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Welcome, {this.props.userName}!</h1>
                    </div>
                }
                <br />
                <div style={styles.introText}>
                  <h3>While Carbos is still under development, we've made some fetures availible for testing.</h3>
                  <br />
                  <h3> Visit the
                    <strong style={styles.link} onClick={()=>{this.dispatchNewRoute('/new/project')}}> New Project MVP </strong>
                    or
                    <strong style={styles.link} onClick={()=>{this.dispatchNewRoute('/explore')}}> Explorer </strong>
                    links to see some of the early features.
                  </h3>
                </div>
            </div>
        );
    }
}

ProtectedView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
