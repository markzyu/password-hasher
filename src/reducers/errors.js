const reducer = (state = {showDialog: false, msg: ""}, action) => {
  switch(action.type) {
    case 'DISMISS_ERROR':
      return {...state, showDialog: false}
    case 'SHOW_ERROR':
      return {showDialog: true, msg: action.msg.toString()};
    default:
      return state
  }
}
export default reducer;
