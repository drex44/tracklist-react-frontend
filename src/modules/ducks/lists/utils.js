import _ from "lodash";

export const defaultState = {
  publicLists: [],
  privateLists: [],
  searchResult: []
};

export const findListIndexFromId = (lists, id) => {
  return _.findIndex(lists, { id: id });
};

export const findListFromId = (lists, id) => {
  return _.find(lists, { id: id });
};

export const setSelectedList = (state, list) => {
  var newState = _.cloneDeep(state);
  _.set(newState, "selectedList", list);
  return newState;
};
