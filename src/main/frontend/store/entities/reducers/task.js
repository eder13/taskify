import {createAction, createReducer} from "@reduxjs/toolkit";
import {createSelector} from "reselect";
import {apiCallBegan} from "../../middleware/apiCreators";

/*==============
 action creators
 ===============*/

// loading data
const taskDataRequested = createAction("taskDataRequested");
const taskDataRequestDone = createAction("taskDataRequestDone");
const taskDataReceived = createAction("taskDataReceived");
const taskDataFailed = createAction("taskDataFailed");

// adding data + setting relation to user
const taskAddRequested = createAction("taskAddRequested");
const taskAddRequestDone = createAction("taskAddRequestDone");
const taskAdded = createAction("taskAdded");
const taskAddFailed = createAction("taskAddFailed");
const taskRelationSetRequested = createAction("taskRelationSetRequested");
const taskRelationSetRequestDone = createAction("taskRelationSetRequestDone");
const taskRelationSet = createAction("taskRelationSet");
const taskRelationSettingFailed = createAction("taskRelationSettingFailed");

// edit task (via temp in form) and set task to done
const tmpTaskDataSet = createAction("tmpTaskDataSet");
const tmpTaskDataWiped = createAction("tmpTaskDataWiped");
const taskUpdateRequested = createAction("taskUpdateRequested");
const taskUpdateRequestDone = createAction("taskUpdateRequestDone");
const taskUpdated = createAction("taskUpdated");
const taskUpdateFailed = createAction("taskUpdateFailed");

// delete a task
const taskDeleteRequested = createAction("taskDeleteRequested");
const taskDeleteRequestDone = createAction("taskDeleteRequestDone");
const taskDeleted = createAction("taskDeleted");
const taskDeleteFailed = createAction("taskDeleteFailed");

// wipe ui error/info message
const taskUiMessageWiped = createAction("taskUiMessageWiped");

/*==============
  action methods
 ===============*/

export const loadTasks = () => async (dispatch, getState) => {

  const userId = getState().auth.userId;

  // wait until userId is fetched before calling
  if (userId === "") {
    console.error("[tasks]: The user context has not been stored yet.");
    return;
  }

  await dispatch(apiCallBegan({
    url: `/api/users/${userId}/tasks`,
    method: "get",
    onStart: taskDataRequested.type,
    onDone: taskDataRequestDone.type,
    onSuccess: taskDataReceived.type,
    onFailed: taskDataFailed.type,
  }));

  return Promise.resolve(true);
}

export const addTask = (title, description, date, workHome) => async (dispatch, getState) => {

  // check if fields are nonEmpty
  if (title === "" || description === "" || date === "") {
    dispatch({
      type: taskAddFailed.type, payload: {
        type: "error",
        error: "Please fill out the form!"
      }
    });
    return Promise.resolve(false);
  }

  const before = getState().entities.taskReducer.tasks.length;

  await dispatch(apiCallBegan({
    url: "/api/tasks",
    method: "post",
    data: {
      title,
      description,
      date,
      workHome,
      done: false
    },
    onStart: taskAddRequested.type,
    onDone: taskAddRequestDone.type,
    onSuccess: taskAdded.type,
    onFailed: taskAddFailed.type,
  }));

  const after = getState().entities.taskReducer.tasks.length;

  // check if we were able to post the data
  if (before < after)
    return Promise.resolve(true);
  else
    return Promise.reject("[tasks]: Failed to Add Task to /api/tasks");
}

export const bindNewTask = () => async (dispatch, getState) => {
  const userId = getState().auth.userId;
  const {tmpReference} = getState().entities.taskReducer;

  dispatch(apiCallBegan({
    url: tmpReference,
    method: 'put',
    data: `/api/users/${userId}`,
    params: {
      headers: {
        "Content-Type": "text/uri-list"
      }
    },
    onStart: taskRelationSetRequested.type,
    onDone: taskRelationSetRequestDone.type,
    onSuccess: taskRelationSet.type,
    onFailed: taskRelationSettingFailed.type,
  }));
}

export const setTmpTask = (href, title, description, date, workHome, done) => (dispatch, getState) => {
  dispatch({type: tmpTaskDataSet.type, payload: {href, title, description, date, workHome, done}});
}

export const clearTmpTask = () => (dispatch, getState) => {
  dispatch({type: tmpTaskDataWiped.type, payload: {}});
}

export const updateTask = (href, title, description, date, workHome, done) => async (dispatch, getState) => {

  // check if fields are nonEmpty
  if (title === "" || description === "" || date === "") {
    dispatch({
      type: taskAddFailed.type, payload: {
        type: "error",
        error: "Please fill out the form!"
      }
    });
    return Promise.resolve(false);
  }

  dispatch(apiCallBegan({
    url: href,
    method: "put",
    data: {
      title,
      description,
      date,
      workHome,
      done
    },
    params: {
      headers: {
        "Content-Type": "application/json"
      }
    },
    onStart: taskUpdateRequested.type,
    onDone: taskUpdateRequestDone.type,
    onSuccess: taskUpdated.type,
    onFailed: taskUpdateFailed.type
  }));

  return Promise.resolve(true);
}

export const deleteTask = (url) => (dispatch, getState) => {
  dispatch(apiCallBegan({
    url: url,
    method: "delete",
    onStart: taskDeleteRequested.type,
    onDone: taskDeleteRequestDone.type,
    onSuccess: taskDeleted.type,
    onFailed: taskDeleteFailed.type,
  }));
}

/*==============
     reducer
 ===============*/

export default createReducer({
  tasks: [],
  tmpReference: "", // temporary reference url for later binding (1:n)
  tmpTask: {}, // used for updating a task
  loading: false,
  lastFetch: null,
  notification: {
    error: "",
    type: ""
  }
}, {
  [taskDataRequested.type]: (taskState) => {
    taskState.loading = true;
  },
  [taskDataRequestDone.type]: (taskState) => {
    taskState.loading = false;
  },
  [taskDataReceived.type]: (taskState, action) => {
    taskState.tasks = action.payload.data._embedded.tasks;
  },
  [taskDataFailed.type]: (taskState, action) => {
    const {type, error} = action.payload;
    taskState.notification.type = type;
    taskState.notification.error = error;
  },
  [taskAddRequested.type]: taskState => {
    taskState.loading = true;
  },
  [taskAddRequestDone.type]: taskState => {
    taskState.loading = false;
  },
  [taskAdded.type]: (taskState, action) => {
    taskState.tasks.push(action.payload.data);
    taskState.tmpReference = action.payload.data._links.user.href;

    // wipe possible ui messages
    taskState.notification.type = '';
    taskState.notification.error = '';
  },
  [taskAddFailed.type]: (taskState, action) => {
    taskState.notification.type = action.payload.type;
    taskState.notification.error = action.payload.error;
    taskState.tmpReference = "";
  },
  [taskRelationSetRequested.type]: taskState => {
    taskState.loading = true;
  },
  [taskRelationSetRequestDone.type]: taskState => {
    taskState.loading = false;
  },
  [taskRelationSet.type]: taskState => {
    taskState.tmpReference = "";
  },
  [taskRelationSettingFailed.type]: (taskState, action) => {
    taskState.notification.type = action.payload.type;
    taskState.notification.error = action.payload.error;
    taskState.tmpReference = "";
  },
  [tmpTaskDataSet.type]: (taskState, action) => {
    const {href, title, description, date, workHome, done} = action.payload;
    taskState.tmpTask.href = href;
    taskState.tmpTask.title = title;
    taskState.tmpTask.description = description;
    taskState.tmpTask.date = date;
    taskState.tmpTask.workHome = workHome;
    taskState.tmpTask.done = done;

    // wipe possible ui messages
    taskState.notification.type = '';
    taskState.notification.error = '';
  },
  [tmpTaskDataWiped.type]: (taskState) => {
    taskState.tmpTask = {};
  },
  [taskUpdateRequested.type]: (taskState) => {
    taskState.loading = true;
  },
  [taskUpdateRequestDone.type]: taskState => {
    taskState.loading = false;
  },
  [taskUpdated.type]: (taskState, action) => {
    const {_links, title, description, date, workHome, done} = action.payload.data;

    // find the index of contact by id (href)
    const index = taskState.tasks.findIndex(task => task._links.self.href === _links.self.href);

    // set updated values
    taskState.tasks[index].href = _links.self.href;
    taskState.tasks[index].title = title;
    taskState.tasks[index].description = description;
    taskState.tasks[index].date = date;
    taskState.tasks[index].workHome = workHome;
    taskState.tasks[index].done = done;
    taskState.tmpTask = {}; // wipe tmp

    // wipe possible ui messages
    taskState.notification.type = '';
    taskState.notification.error = '';
  },
  [taskUpdateFailed.type]: (taskState, action) => {
    taskState.notification.type = action.payload.type;
    taskState.notification.error = action.payload.error;
    taskState.tmpTask = {}; // wipe tmp
  },
  [taskDeleteRequested.type]: taskState => {
    taskState.loading = true;
  },
  [taskDeleteRequestDone.type]: taskState => {
    taskState.loading = false;
  },
  [taskDeleted.type]: (taskState, action) => {
    // need id (= self.href)
    const {id} = action.payload;

    // find the array position with id
    const index = taskState.tasks.findIndex(task => task._links.self.href === id);
    // cut that part
    taskState.tasks.splice(index, 1);
    // for safety also wipe tmp
    // (e.g. user is in edit mode, but then wants to delete it anyways)
    taskState.tmpTask = {};
  },
  [taskDeleteFailed.type]: (taskState, action) => {
    taskState.notification.type = action.payload.type;
    taskState.notification.error = action.payload.error;
  },
  [taskUiMessageWiped.type]: taskState => {
    taskState.notification.type = "";
    taskState.notification.error = "";
  }
});

/*==============
    selectors
 ===============*/

export const tmpTaskSelector = createSelector(
  (state) => state.entities.taskReducer,
  (taskState) => taskState.tmpTask
);

export const notificationSelector = createSelector(
  (state) => state.entities.taskReducer,
  (taskState) => taskState.notification
);

export const workTasksSelector = createSelector(
  (state) => state.entities.taskReducer,
  (taskState) => taskState.tasks.filter(task => task.workHome === true)
);

export const homeTasksSelector = createSelector(
  (state) => state.entities.taskReducer,
  (taskState) => taskState.tasks.filter(task => task.workHome === false)
);

export const allTasksSelector = createSelector(
  state => state.entities.taskReducer,
  taskState => taskState.tasks
);