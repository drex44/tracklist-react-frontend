import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import { Container, Segment, Divider, Header } from "semantic-ui-react";
import { TrackList } from "../components/lists";
import { listsOperations } from "../modules/ducks/lists";
import { connect } from "react-redux";

export class PrivateHome extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteList = this.handleDeleteList.bind(this);
  }

  async componentDidMount() {
    this.props.getAllPrivateLists();
  }

  async handleDeleteList(event) {
    this.props.deleteList(event);
  }
  render() {
    const clists = this.props.lists ? this.props.lists : [];
    return clists.length > 0 ? (
      clists.map(list => (
        <Container key={list.id}>
          <Segment>
            <TrackList
              list={list}
              editable={false}
              isPrivateList={true}
              handleDeleteList={this.handleDeleteList}
            />
          </Segment>
          <Divider hidden />
        </Container>
      ))
    ) : (
      <Container textAlign="center">
      <Divider hidden />
        <Header>
          No TrackList available.
          <br />Please create a new one
          <Link to="/newList"> here</Link>.
        </Header>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    lists: state.listsReducer.privateLists
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getAllPrivateLists: () => dispatch(listsOperations.getAllPrivateLists()),
    deleteList: id => dispatch(listsOperations.deleteList(id))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateHome);
