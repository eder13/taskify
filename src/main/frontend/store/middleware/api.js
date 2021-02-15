import axios from "axios";
import Cookies from "js-cookie";
import {apiCallBegan, apiCallFailed, apiCallSucceeded} from "./apiCreators";

// axios config for csrf protection
axios.interceptors.request.use((req) => {

  if (
    req.method === "post" ||
    req.method === "delete" ||
    req.method === "put" ||
    req.method === "patch"
  ) {
    // check if relative to url only
    if (!(/^http:.*/.test(req.url) || /^https:.*/.test(req.url))) {
      req.headers.common = {
        ...req.headers.common,
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
      };
    }
  }

  return req;
});

const api = ({getState, dispatch}) => (next) => async (action) => {

  if (action.type !== apiCallBegan.type) {
    next(action);
    return;
  }

  // log that api call (apiCallBegan)
  next(action);

  const {url, method, data, params, onStart, onDone, onSuccess, onFailed} = action.payload;

  // set loading spinner
  dispatch({type: onStart, payload: {}});

  console.info("URL to call: " + url);

  // check http method
  switch (method) {
    case "get":
      try {
        // get data from provided url
        const req = await axios.get(url);
        console.info(req.status, req.data);
        const data = req.data;

        // if success, dispatch api success message
        dispatch({type: apiCallSucceeded.type, payload: {}});

        // custom success delegation: dispatch data to store
        if (onSuccess) {
          dispatch({type: onSuccess, payload: {data}});
        }
      } catch (e) {

        // if failed, dispatch api error message
        dispatch({type: apiCallFailed.type, payload: {}});

        // custom error
        if (onFailed) {
          try {
            // check if error message generated
            const req = await axios.get("/error", {params: {message: "true"}});
            if (req.data !== "") {
              // dispatch error with generated error message
              dispatch({type: onFailed, payload: {error: req.data, type: "error"}});
            }
          } catch (exception) {
            // General error: problem with url (not allowed, false url etc.)
            dispatch({
              type: onFailed,
              payload: {error: "Error: An error occurred while trying to communicate with the API.", type: "error"}
            });
          }
        }
      }
      // login spinner end
      setTimeout(() => dispatch({type: onDone, payload: {}}), 500);
      break;

    case "post":

      console.log(data);

      try {
        const req = await axios.post(url, data, {headers: {"Content-Type": "application/json"}});
        console.info(req.status, req.data);

        dispatch({type: apiCallSucceeded.type, payload: {}});

        if (onSuccess)
          dispatch({type: onSuccess, payload: {data: req.data}});
      } catch (e) {
        dispatch({type: apiCallFailed.type, payload: {}});

        if (onFailed)
          dispatch({type: onFailed, payload: {error: e.toString(), type: "error"}});
      }
      setTimeout(() => dispatch({type: onDone, payload: {}}), 500);
      break;

    case "put":
      try {

        const req = await axios.put(url, data, params);
        console.log(req.status, req.data);

        dispatch({type: apiCallSucceeded.type, payload: {}});

        if (onSuccess)
          dispatch({type: onSuccess, payload: {data: req.data}});

      } catch (e) {
        dispatch({type: apiCallFailed.type, payload: {}});

        if (onFailed)
          dispatch({type: onFailed, payload: {error: e.toString(), type: "error"}});
      }
      setTimeout(() => dispatch({type: onDone, payload: {}}), 500);
      break;

    // TODO: case "patch":

    case "delete":
      try {
        const req = await axios.delete(url);
        console.log(req.status, req.data);

        dispatch({type: apiCallSucceeded.type, payload: {}});

        if (onSuccess)
          dispatch({type: onSuccess, payload: {id: url}}); // HATEOAS - self.href = id

      } catch (e) {
        dispatch({type: apiCallFailed.type, payload: {}});

        if (onFailed)
          dispatch({type: onFailed, payload: {error: e.toString(), type: "error"}});
      }
      setTimeout(() => dispatch({type: onDone, payload: {}}), 500);
      break;

    default:
      break;
  }
}

export default api;