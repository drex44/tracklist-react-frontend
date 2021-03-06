import React from "react";

import "semantic-ui-css/semantic.min.css";
import {
  Grid,
  Divider,
  Button,
  Form,
  TextArea,
  Dropdown,
  Checkbox,
  Label
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import {
  Description,
  Title,
  PreventEnterSubmit,
  Tags,
  ConfirmationModal,
  ProgressBar
} from "../common";

import { Tasks } from "./tasks";

export class TrackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: props.list.tasks
    };
    this.handleTasksChange = this.handleTasksChange.bind(this);
    this.handleNewTaskRequest = this.handleNewTaskRequest.bind(this);
    this.addPublicListToUserList = this.addPublicListToUserList.bind(this);
  }

  addPublicListToUserList() {
    this.props.addPublicListToUserList(this.props.list.id);
  }

  handleTasksChange(event) {
    let tasks = this.state.tasks.map(task => {
      if (task.id === event.id) {
        task.status = event.value;
        return task;
      } else {
        return task;
      }
    });

    this.setState({
      tasks: tasks
    });
  }

  handleNewTaskRequest(event) {
    let newTask = {
      id: this.state.tasks.length + 1,
      title: event.title,
      description: event.desc,
      status: false
    };

    let newArray = this.state.tasks.slice();
    newArray.push(newTask);
    this.setState({ tasks: newArray });
  }

  render() {
    const list = this.props.list;

    const tasks = this.state.tasks;
    const totaltasks = tasks ? tasks.length : 0;
    let count = 0;
    tasks ? tasks.map(task => (task.status ? count++ : count)) : null;
    const completedTasks = count;

    return (
      <div>
        <Grid>
          <Grid.Column width={14}>
            <Title size="medium" value={list.title} />
            <Description value={list.description} />
            <Tags value={list.tags} />
            {/* <Flag name="ae" /> */}
          </Grid.Column>
          {this.props.isPrivateList ? (
            <Grid.Column width={2}>
              {/* edit list */}
              <Link to={{ pathname: "/editList/" + list.id }}>
                <Button
                  basic
                  floated="right"
                  icon="edit"
                  iconPosition="right"
                  content="Edit"
                />
              </Link>

              {/* delete list */}
              <ConfirmationModal
                button={
                  <Button
                    basic
                    floated="right"
                    icon="delete"
                    iconPosition="right"
                    content="Delete"
                  />
                }
                confirmButtonText="Yes, delete"
                message="are you sure, you want to delete this TrackList?"
                action={this.props.handleDeleteList}
                value={list.id}
              />
            </Grid.Column>
          ) : this.props.isLoggedIn ? (
            <Grid.Column width={2}>
              <Button
                basic
                floated="right"
                content="Add to my TrackLists"
                onClick={this.addPublicListToUserList}
              />
            </Grid.Column>
          ) : null}
        </Grid>
        <Divider section />

        <Tasks
          isPrivateList={this.props.isPrivateList}
          newTaskLabel="Add new task"
          editable={this.props.editable}
          tasks={tasks}
          handleTasksChange={this.handleTasksChange}
          handleNewTaskRequest={this.handleNewTaskRequest}
        />

        <Divider hidden />
        {this.props.isPrivateList && totaltasks > 0 ? (
          <ProgressBar value={completedTasks} total={totaltasks} />
        ) : null}
      </div>
    );
  }
}

export class TrackListForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      desc: "",
      tags: [],
      tagOptions: [],
      tasks: [],
      publiclist: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTasksChange = this.handleTasksChange.bind(this);
    this.handleNewTaskRequest = this.handleNewTaskRequest.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.list &&
      props.list.tags &&
      props.id === props.list.id &&
      !state.title
    ) {
      const list = props.list;
      return {
        title: list.title,
        desc: list.description,
        tags: list.tags,
        tagOptions: list.tags.map(value => ({ text: value, value })),
        tasks: list.tasks,
        publiclist: list.publiclist
      };
    }
    return null;
  }

  handleTasksChange(event) {
    if (event.action === "updateStatus") {
      let tasks = this.state.tasks.map(task => {
        if (task.id === event.id) {
          task.status = event.value;
          return task;
        } else {
          return task;
        }
      });

      this.setState({
        tasks: tasks
      });
    } else if (event.action === "editTask") {
      let tasks = this.state.tasks.map(task => {
        if (task.id === event.id) {
          task.title = event.value.title;
          task.description = event.value.desc;
          return task;
        } else {
          return task;
        }
      });

      this.setState({
        tasks: tasks
      });
    }
  }

  handleDeleteTask(event) {
    if (event.action === "deleteTask") {
      let tasks = this.state.tasks;
      let index = -1;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === event.id) {
          index = i;
        }
      }
      if (index >= 0) {
        tasks.splice(index, 1);
      }
      this.setState({
        tasks: tasks
      });
    }
  }

  handleNewTaskRequest(event) {
    let newTask = {
      id: this.state.tasks.length + 1,
      title: event.title,
      description: event.desc,
      status: false
    };

    let newArray = this.state.tasks.slice();
    newArray.push(newTask);
    this.setState({ tasks: newArray });
  }

  handleInputChange(event, data) {
    const target = event.target;
    let name = target.name;
    let value = target.value;

    if (typeof data != "undefined" && data.name === "publiclist") {
      name = data.name;
      value = data.checked;
    }

    if (name === "tags") {
      value = value.split(",");
    }

    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    const list = {
      id: this.props.list ? this.props.list.id : null,
      title: this.state.title,
      description: this.state.desc,
      tags: this.state.tags,
      tasks: this.state.tasks,
      publiclist: this.state.publiclist
    };
    await this.props.handleListSubmit(list);
    event.preventDefault();
  }

  handleReset = event => {
    this.setState({
      title: "",
      desc: "",
      tags: [],
      tagOptions: [],
      tasks: [],
      publiclist: false
    });
    event.preventDefault();
  };

  handleTagsAddition = (e, { value }) => {
    this.setState({
      tagOptions: [{ text: value, value }, ...this.state.tagOptions]
    });
  };

  handleTagsChange = (e, { value }) => this.setState({ tags: value });

  render() {
    const { title, tasks, publiclist } = this.state;
    const description = this.state.desc;
    const currentValues = this.state.tags;

    return (
      <Form>
        <PreventEnterSubmit>
          <Form.Field>
            <label>Title</label>
            <input
              name="title"
              value={title}
              placeholder="Title"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field
            name="desc"
            control={TextArea}
            value={description}
            label="Description"
            placeholder="Tell us more about the list..."
            onChange={this.handleInputChange}
          />
          <Form.Field>
            <label>Tags</label>
            <Dropdown
              options={this.state.tagOptions}
              placeholder="Tags"
              search
              selection
              fluid
              multiple
              allowAdditions
              value={currentValues}
              onAddItem={this.handleTagsAddition}
              onChange={this.handleTagsChange}
            />
          </Form.Field>

          <Divider hidden />

          <Form.Field>
            <label>Tasks</label>
            <Tasks
              editable={this.props.editable}
              newTaskLabel="Add new task"
              tasks={tasks}
              handleDeleteTask={this.handleDeleteTask}
              handleTasksChange={this.handleTasksChange}
              handleNewTaskRequest={this.handleNewTaskRequest}
            />
          </Form.Field>

          <Form.Field>
            <Checkbox
              name="publiclist"
              checked={publiclist}
              onChange={this.handleInputChange}
              label="Public checklist"
            />
            {publiclist && (
              <div>
                <Label>
                  Once TrackList is public, it will be visible to everybody.
                  even if you make it private again, only future changes won't
                  be public.
                </Label>
              </div>
            )}
          </Form.Field>
        </PreventEnterSubmit>

        <Divider hidden />

        <Button
          negative
          icon="repeat"
          labelPosition="right"
          content="Clear"
          onClick={this.handleReset}
        />
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          type="submit"
          content="Submit"
          onClick={this.handleSubmit}
        />
      </Form>
    );
  }
}
