import { combineReducers } from 'redux';
import User from "./reducers/user";
import Photo from "./reducers/photo";
import Album from "./reducers/album";

export default () => combineReducers({
  user: User,
  photos: Photo,
  albums: Album
});