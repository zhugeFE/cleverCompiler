import defaultState, { GitState, GitInstance } from '../state';
import { Action, gitActions } from '../actionTypes';
import * as _ from 'lodash';

const git = (state: GitState = defaultState.git, action: Action<GitInstance|GitInstance[]>) => {
  const resState = _.cloneDeep(state)
  switch (action.type) {
    case gitActions.UPDATE_LIST:
      resState.list = action.value as GitInstance[]
      return resState
    default:
      return resState
  }
}
export {
  git
}