import { getAgreementRead } from "../store";

const reducer = (state = {agreed: getAgreementRead(), msg: ""}, action) => {
  switch(action.type) {
    case 'LOAD_USER_AGREEMENT_STATUS':
      return {...state, agreed: action.agreed}
    default:
      return state
  }
}
export default reducer;
