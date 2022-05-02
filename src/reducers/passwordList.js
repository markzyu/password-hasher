const passwordList = (state = {list: [], loaded: false}, action) => {
  switch(action.type) {
    case 'ADD_PASSWORD':
      if (state.list.some(x => x.name === action.name)) {
        throw new Error('Programmer forgot to check duplicate name: ' + action.name);
      }
      return {...state, list: [action, ...state.list]}
    case 'RM_PASSWORD':
      return {...state, list: state.list.filter(x => x.name !== action.name)}
    case 'LOAD_PASSWORDS':
      return {...state, list: action.list, loaded: true}
    default:
      return state
  }
}

export default passwordList;
