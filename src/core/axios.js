// First we need to import axios.js
import axios from "axios";

export const Canceler = axios.CancelToken.source();

// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: process.env.REACT_APP_API_URL,
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";
// instance.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";

// Also add/ configure interceptors && all the other cool stuff
instance.interceptors.request.use(
  (request) => {
    // Edit request config
    return request;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // console.log(response);
    // Edit response config
    return response.data;
  },
  (error) => {
    // console.log(error.response);
    return Promise.reject(error);
  }
);

export default instance;
