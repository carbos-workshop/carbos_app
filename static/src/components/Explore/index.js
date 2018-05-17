import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Tabs, Tab} from 'material-ui/Tabs';
import ProjectCard from './Projectcard';

//for another page:
import LeftNav from 'material-ui/Drawer';

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
        projects: [{
          address: '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
          value: 6.1,
          blockie: '',
          name: 'Sample Project',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mattis quis ex sed euismod. Nunc sed massa aliquet, ultricies mauris vel, venenatis nibh. Suspendisse tristique odio nec neque mollis volutpat. Proin aliquet ullamcorper facilisis. Sed pellentesque nibh vel nulla efficitur, at pulvinar dolor egestas. Nunc imperdiet ligula at orci aliquam, vel imperdiet tellus dictum. Nam accumsan dui et nulla aliquet, eu tincidunt est malesuada. Nam dignissim risus lorem, porta pellentesque tellus pulvinar non. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris enim arcu, dignissim eget lacus quis, pulvinar ornare enim.',
        }]
      };
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

    const style = {
      // nav: {
      //   zIndex: '0',
      //   paddingTop: '64px',
      // },
      title: {
        margin:'2.2em 0',
      },
    }

    //navigational link area, configured
    // <LeftNav containerStyle={style.nav}>
    //   <h1>asdfasdfasdf</h1>
    // </LeftNav>

return (
      <div className="container">
        <div style={style.title}>
          <h2 style={{color: this.props.muiTheme.palette.textColor}}>Project Explorer</h2>
        </div>

        <Tabs inkBarStyle={this.createTabInkBarStyle()}>
          <Tab label="All"  >
            <div>
              {
                this.state.projects.map( (project, index) => (
                  <ProjectCard
                    index={project.index}
                    key={project.name}
                    description={project.description}
                    name={project.name}
                    value={project.value}
                    blockie={project.blockie}
                  >
                  </ProjectCard>
                ))
              }
            </div>
          </Tab>
          <Tab label="Approved" >
            <div>
              
            </div>
          </Tab>
          <Tab label="Pending" >
            <div>

            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default muiThemeable()(Explore);
