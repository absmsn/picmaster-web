import {MERGE_PHOTO_GROUPS} from "../common/actionTypes";
import {ADD_PHOTOS_BATCH} from "../common/actionTypes";
import { mergeGroupArr } from "../common/utils";

const initialState = {
  photoGroups: [],
  albumPhotos: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MERGE_PHOTO_GROUPS:
      return {
        ...state,
        photoGroups: mergeGroupArr(state.photoGroups, action.payload,
          action.arrFn, action.keyFn)
      }
    case ADD_PHOTOS_BATCH:
      let {albumID, photos} = action.payload;
      let photoArr = state.albumPhotos[albumID];
      return {
        ...state,
        albumPhotos: {
          ...state.albumPhotos,
          [albumID]: (photoArr || []).concat(photos)
        }
      }
    default:
      return state;
  }
}