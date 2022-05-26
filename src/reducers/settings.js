const reducer = (state = {showSettings: false}, action) => {
  switch(action.type) {
    case 'SHOW_SETTINGS':
      return {...state, showSettings: action.show}
    default:
      return state
  }
}
export default reducer;
