import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";

import Items from "./lists/items";
import Selected from "./lists/selected";

import { DragDropContext } from "react-beautiful-dnd";

import { reorder, move } from "./data/moveFunctions";

import {
  getItems,
  getSelected,
  changeSelected,
  changeItems
} from "./data/fetchFunctions";

const styles = theme => ({
  lists: {
    listStyleType: "none",
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    justifyContent: "center"
  }
});

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      selected: this.props.selected
    };
  }

  componentWillReceiveProps = newProps => {
    if (
      newProps.items !== this.props.items ||
      newProps.selected !== this.props.selected
    ) {
      this.setState({ items: newProps.items, selected: newProps.selected });
    }
  };

  id2List = {
    droppable: "items",
    droppable2: "selected"
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    console.log("result", result);
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      if (
        JSON.stringify(this.state.items).indexOf(JSON.stringify(items[0])) !==
        -1
      ) {
        changeItems(this.props.getItems, items);
      } else {
        changeSelected(this.props.getSelected, items);
      }
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      changeItems(this.props.getItems, result.droppable);
      changeSelected(this.props.getSelected, result.droppable2);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.lists}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Items />
          <Selected />
        </DragDropContext>
      </div>
    );
  }
}
Lists.propTypes = {
  classes: PropTypes.object.isRequired,
  openInfo: PropTypes.bool,
  openDelete: PropTypes.bool,
  handleOpenInfo: PropTypes.func,
  handleCheckItem: PropTypes.func,
  getItems: PropTypes.func,
  handleEditItem: PropTypes.func
};

const mapStateToProps = state => {
  return { items: state.items, store: state, selected: state.selected };
};

const mapDispatchToProps = dispatch => {
  return {
    handleOpenInfo: index =>
      dispatch({ type: "SHOW_INFO_DIALOG", index: index }),
    handleOpenEdit: index =>
      dispatch({ type: "SHOW_EDIT_DIALOG", index: index }),
    handleCheckItem: value => dispatch({ type: "HANDLE_CHECK", value: value }),
    handleOpenDelete: index =>
      dispatch({ type: "SHOW_DELETE_DIALOG", index: index }),
    handleEditItem: index => dispatch({ type: "EDIT_ITEM", index: index }),
    handleEditSelected: selected =>
      dispatch({ type: "EDIT_SELECTED", selected: selected }),
    getItems: items => dispatch({ type: "GET_ITEMS", items: items }),
    getSelected: selected =>
      dispatch({ type: "GET_SELECTED", selected: selected })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Lists));
