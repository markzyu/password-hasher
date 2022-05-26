const reducer = (state = {showSettings: false, cached: {}}, action) => {
  switch(action.type) {
    case 'SHOW_SETTINGS':
      return {...state, showSettings: action.show}
    case 'UPDATE_CACHED_SETTINGS':
      const newCached = {...state.cached};
      newCached[action.key] = action.val;
      return {...state, cached: newCached}
    default:
      return state
  }
}
export default reducer;
