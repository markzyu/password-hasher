const reducer = (state = {show: false, possibleMatches: null}, action) => {
  switch(action.type) {
    case 'DISMISS_PASSWD_DETAILS':
      return {...state, show: false}
    case 'SHOW_PASSWD_DETAILS':
      return {show: true, possibleMatches: action.possibleMatches};
    default:
      return state
  }
}
export default reducer;
