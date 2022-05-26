import { combineReducers } from 'redux'
import settings from './settings'
import passwordDetail from './passwordDetail'
import passwordList from './passwordList'
import errors from './errors'
import agreement from './agreement'

export default combineReducers({
  settings,
  passwordDetail,
  passwordList,
  errors,
  agreement,
})

export const testableStore = combineReducers({
  settings,
  passwordDetail,
  passwordList,
})
