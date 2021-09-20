import {ADD_ALBUM, ADD_ALBUMS_BATCH} from "../common/actionTypes";

const initialState = {
  albums: [],   
  sortKey: "name"
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_ALBUM:
      return {
      ...state,
      albums: [...state.albums, action.payload]
    }
    case ADD_ALBUMS_BATCH:
      return {
        ...state,
        albums: state.albums.concat(action.payload)
      }
    default:
      return state;
  }
}