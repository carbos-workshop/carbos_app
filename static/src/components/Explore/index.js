import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
// import * as actionCreators from '../actions/auth';
import LeftNav from 'material-ui/Drawer';

// function mapStateToProps(state) {
//     return {
//         isRegistering: state.auth.isRegistering,
//         registerStatusText: state.auth.registerStatusText,
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators(actionCreators, dispatch);
// }

// @connect(mapStateToProps, mapDispatchToProps)
class Explore extends React.Component {

  render() {

    const styles = {
      nav: {
        zIndex: 0,
        paddingTop: '64dp',
      }
    }

    return (
      <div className="container text-center">
          <LeftNav style={styles.nav}>
            <h1>asdfasdfasdf</h1>
          </LeftNav>
      </div>
    )
  }
}

export default muiThemeable()(Explore);
