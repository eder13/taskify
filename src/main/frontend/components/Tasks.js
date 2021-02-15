import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {homeTasksSelector, loadTasks, workTasksSelector} from "../store/entities/reducers/task";
import styled from "styled-components";
import TaskItem from "./TaskItem";
import Form from "./Form";
import {loadingBooleanSelector, loginInfoSelector} from "../store/auth/auth";
import axios from "axios";
import Cookies from "js-cookie";

const Title = styled.h1`
  text-align: center;
  color: rgb(34, 27, 113);
`;

const Main = styled.main`
  padding-top: 4rem;
  background-color: rgb(245, 246, 251);
  min-height: 100vh;
`;

const TaskWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const WorkSection = styled.section`
  display: flex;
  flex-flow: column;
  width: 94%;
  margin: 0 auto;
  padding-bottom: 3rem;
`;

const HomeSection = styled.section`
  display: flex;
  flex-flow: column;
  width: 94%;
  margin: 0 auto;
  padding-bottom: 3rem;
`;

const IconStyle = styled.h4`
  text-align: left;
  display: flex;
`;

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

const Tasks = () => {

  const dispatch = useDispatch();
  const workTasks = useSelector(workTasksSelector);
  const homeTasks = useSelector(homeTasksSelector);
  const loginState = useSelector(loginInfoSelector);
  const loading = useSelector(loadingBooleanSelector);

  useEffect(() => {
    dispatch(loadTasks()).then(() => console.log("[tasks]: tasks successfully loaded from server"));
  }, []);

  if (!loading) {
    return (
      <Main>
        <Title as="h3"> Hi {loginState.user} 👋</Title>
        <p style={{textAlign: 'center'}}>Got some new tasks? ✅</p>

        <Form/>

        <WorkSection>
          <IconStyle>
            <i className="fas fa-circle fa-xs" style={{color: 'rgb(94, 124, 255)', padding: '0.2rem'}}>{}</i>
            Work
          </IconStyle>
          <TaskWrapper>
            {workTasks.length > 0 ? workTasks.map(workTask =>
              <TaskItem key={workTask._links.self.href} task={workTask}/>
            ) : <p>Add some work tasks ...</p>}
          </TaskWrapper>
        </WorkSection>

        <HomeSection>
          <IconStyle>
            <i className="fas fa-circle fa-xs" style={{color: 'rgb(255, 184, 0)', padding: '0.2rem'}}>{}</i>
            Home
          </IconStyle>
          <TaskWrapper>
            {homeTasks.length > 0 ? homeTasks.map(homeTask =>
              <TaskItem key={homeTask._links.self.href} task={homeTask}/>
            ) : <p>Add some home tasks ...</p>}
          </TaskWrapper>
        </HomeSection>
      </Main>
    );
  } else {
    return (
      <div className="loader-wrap">
        <div className="loader">{}</div>
      </div>);
  }
}

export default Tasks;