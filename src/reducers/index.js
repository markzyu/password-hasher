import { combineReducers } from 'redux'
import passwordDetail from './passwordDetail'
import passwordList from './passwordList'
import errors from './errors'
import agreement from './agreement'

export default combineReducers({
  passwordDetail,
  passwordList,
  errors,
  agreement,
})
