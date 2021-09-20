import axios from "axios";
import {baseUrl} from "./config";
import user from "../reducers/user";

let jwt = localStorage.getItem("jwt");

export const client = axios.create({
  baseURL: baseUrl
});

export const User = {
  register: request => {
    return client.post("/register", request);
  },
  login: (email, password) => {
    return client.post("/user/action/login", {email, password});
  },
  listPhotos: (
    userID,
    offset,
    limit,
    order = "modifiedTime",
    desc = true
  ) => {
    return client.get(`/user/${userID}/photos`, {
      params: {offset, limit, order, desc}
    });
  },
  listAlbums: (
    userID,
    offset,
    limit,
    desc = false
  ) => {
    return client.get(`/user/${userID}/albums`, {
      params: {offset, limit, desc}
    });
  }
};

export const Album = {
  listPhotos: (
    albumID,
    offset,
    limit,
    order = "photoName",
    desc = false
  ) => {
    return client.get(`/album/${albumID}/photos`, {
      params: {offset, limit, order, desc}
    });
  },
  addAlbum: (userID, name) => {
    return client.post('/album', {
      userID: userID,
      name: name
    });
  }
};

export const Photo = {
  addPhoto: (
    albumID,
    file,
    modifiedTime,
    progressCallback
  ) => {
    var form = new FormData();
    form.append("file", file);
    form.append("albumID", albumID);
    form.append("modifiedTime", modifiedTime);
    return client.post('/photo', form, {
      onUploadProgress: progressCallback 
    });
  }
};

client.interceptors.request.use(config => {
  if (jwt) {
    config.headers['Authorization'] = jwt;
  }
  return config;
}, err => {
  return Promise.reject(err);
});

client.interceptors.response.use( res =>{
  if (!jwt && res.data.token && res.data.userID) {
    jwt = res.data.token;
    localStorage.setItem("jwt", res.data.token);
    localStorage.setItem("userID", res.data.userID);
  }
  return res;
}, err => {
  if (err.response.status === 401) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userID");
    window.history.replaceState({}, "", "/login");
  }
  return Promise.reject(err);
});