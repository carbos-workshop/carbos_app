import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import LeftNav from 'material-ui/Drawer';
import ProjectCard from './Projectcard';

class Explore extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          projects: [{
            address: '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            value: 6.1,
            blockie: '',
            name: 'Sample Project',
            description: 'lorem lorem lorem',
          }]
      };

  }

  render() {

    const style = {
      nav: {
        zIndex: '0',
        paddingTop: '64px',
      }
    }

    //navigational link area, configured
    // <LeftNav containerStyle={style.nav}>
    //   <h1>asdfasdfasdf</h1>
    // </LeftNav>


    return (
      <div className="container">
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
    )
  }
}

export default muiThemeable()(Explore);
