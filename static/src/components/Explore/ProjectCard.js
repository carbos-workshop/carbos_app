import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Blockies from 'react-blockies';
import Avatar from 'material-ui/Avatar';

class ProjectCard extends React.Component {

  static propTypes = {
      name: React.PropTypes.string || 'Project Name',
      value: React.PropTypes.number || 0.00,
      index: React.PropTypes.number,
      // blockie: React.PropTypes.string,
      description: React.PropTypes.string || 'description',
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    //TODO: Link to project detail
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  render() {
    const styles = {
      blockie : {
        overflow: 'hidden',
      }
    }

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={'Project Address: ' + this.props.name}
          subtitle={this.props.value + ' OCO' + ' (index estimate)'}
          subtitleColor={this.props.muiTheme.palette.primary1Color}
          avatar={<Avatar style={styles.blockie} children={<Blockies scale={5} seed={this.props.name} />}></Avatar>}
          actAsExpander={true}
          showExpandableButton={false}
        />
        <CardText expandable={true}>
          {this.props.description}
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="Visit" onClick={this.handleExpand} disabled={true}/>
          {
            this.state.expanded
            ?
            <FlatButton label="Close" onClick={this.handleReduce} />
            :
            null
          }
        </CardActions>
      </Card>
    );
  }
}

export default muiThemeable()(ProjectCard)
