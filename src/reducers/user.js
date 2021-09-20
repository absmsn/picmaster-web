import { AUTHORIZED } from "../common/actionTypes";

const initialState = {
  isAuthenticated: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHORIZED:
      return {
        ...state,
        isAuthenticated: true,
        email: action.payload.email,
        userID: action.payload.userID
      };
    default:
      return state;
  }
}