import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Tabs, Tab} from 'material-ui/Tabs';
import ProjectCard from './ProjectCard';

//for another page:
import LeftNav from 'material-ui/Drawer';

//web3
import { get_txs_for_address } from '../../utils/web3.js';
import Web3 from 'web3';

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
class Explore extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        currentTheme: this.props.currentTheme,
        projects: [],
        testTxns: []
      };
  }

  componentWillMount = () => {
    let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Z94APTDSX23QQ338SKR8CC1GUPYS8EDDVA'));
    console.log(web3)
    get_txs_for_address()
      .then( res => {
        let projectList = []
        // this.setState({
        //   testTxns: res.data.results
        // })
        console.log(res.data)
        res.data.result.forEach( result => {
          web3.eth.getTransactionReceipt( result.hash )
            .then( txn => {
              if (txn.status){
                let params = web3.eth.abi.decodeParameters(['address', 'uint256', 'uint256'], txn.logs[0].data)
                // console.log(blockies.create({seed: params[0]}))
                projectList.push(
                      {
                       address: params[0],
                       value: params[1],
                       name: 'Sample Project',
                       description: 'These are test projects generated in the development process.',
                    }
                 )
              }
              this.setState({
                projects: projectList
              })
            })
        })
      })
  }

  //returns true if light, false if dark
  readCurrentTheme = () => {
    if (this.props.currentTheme === 'light'){
      return true
    }
    else return false
  }

  //creates a valid style object to pass to <Tabs /> to change ink bar color outside of Mui Theme
  createTabInkBarStyle = () => {
    if (this.readCurrentTheme()){
      return {
        backgroundColor: this.props.muiTheme.palette.primary1Color
      }
    }
    if (!this.readCurrentTheme()){
      return {
        backgroundColor: this.props.muiTheme.palette.textColor
      }
    }
    else return null
  }



  render() {

    const styles = {
      // nav: {
      //   zIndex: '0',
      //   paddingTop: '64px',
      // },
      title: {
        margin:'2.2em 0',
        color: this.props.muiTheme.palette.textColor,
      },
      p: {
        margin: '2em',
        textAlign: 'center',
        color: this.props.muiTheme.palette.textColor,
      },
    }

    //navigational link area, configured
    // <LeftNav containerStyle={style.nav}>
    //   <h1>asdfasdfasdf</h1>
    // </LeftNav>

return (
      <div className="container">
        <div style={styles.title}>
          <h2>Project Explorer</h2>
        </div>

        <Tabs inkBarStyle={this.createTabInkBarStyle()}>
          <Tab label="All"  >
            <div>
              {
                this.state.projects.map( (project, index) => (
                  <ProjectCard
                    index={project.index}
                    key={project.address}
                    description={project.description}
                    name={project.address}
                    value={project.value}
                  >
                  </ProjectCard>
                ))
              }
            </div>
          </Tab>
          <Tab label="Approved" >
            <div>
              <p style={styles.p}>This feature is in development.</p>
            </div>
          </Tab>
          <Tab label="Pending" >
            <div>
              <p style={styles.p}>This feature is in development.</p>
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default muiThemeable()(Explore);
