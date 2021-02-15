import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {clearTmpTask, deleteTask, setTmpTask, updateTask} from "../store/entities/reducers/task";
import styled from "styled-components";

const Checkbox = styled.div`
  margin: auto 2rem;
  width: 3rem;
  height: 3rem;
  margin-top: 2.2rem;
  border: none;
  position: relative;

  & input[type='checkbox'] {
    width: 3rem;
    height: 3rem;
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;

    &:hover ~ .checkmark {
      background-color: rgb(187, 253, 235);
    }
  }

  & .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid #ccc;
  }

  & :checked ~ .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
    background-color: rgb(0, 235, 191);
    border-radius: 50%;
    z-index: 2;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: none;

    & .innerMark {
      width: 12px;
      height: 4px;
      background-color: white;
      z-index: 2;
      transform: rotate(225deg);
      margin-left: 0.7rem;
      position: relative;
      top: 4px;

      &::after {
        content: '';
        width: 24px;
        height: 4px;
        background-color: white;
        position: absolute;
        top: 10px;
        left: -10px;
        right: 10px;
        z-index: 1;
        transform: rotate(270deg);
      }
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 150px;
  background-color: white;
  border-radius: 20px;
  margin: 0.3rem 0;

  & > div:first-child {
    align-self: center;
    margin-left: 1rem;
  }
`;

const TaskItem = ({task}) => {

  const {title, description, date, workHome, done, _links} = task;

  const [localDone, setLocalDone] = useState(done);

  const dispatch = useDispatch();
  const dateParsed = new Date(Date.parse(date.toString()));

  const deleteEntry = (e) => {
    dispatch(deleteTask(_links.self.href));
    dispatch(clearTmpTask());
  }

  const setEditForm = (e) => {

    // clear previous stuff
    dispatch(clearTmpTask());

    // set tmp contact when clicked
    dispatch(setTmpTask(_links.self.href, title, description, date, workHome, done));

  }

  const onChange = (e) => {
    if(e.target.checked) {
      setLocalDone(true);
      dispatch(updateTask(_links.self.href, title, description, date, workHome, true));
    }
    else {
      setLocalDone(false);
      dispatch(updateTask(_links.self.href, title, description, date, workHome, false));
    }
  }

  // WORK = true and HOME = false
  if (workHome) {

    return (
      <Card>
        <div style={{backgroundColor: 'rgb(94, 124, 255)', height: '70%', width: '4px'}}>{}</div>
        <Checkbox>
          <input type="checkbox" checked={localDone} onChange={onChange}/>
          <span className="checkmark">
                <span className="innerMark"/>
              </span>
        </Checkbox>
        <div>
          {!done ? <h3>{title}</h3> : <h3 style={{textDecoration: 'line-through'}}>{title}</h3>}
          {!done ? <p>{description}</p> : <p style={{textDecoration: 'line-through'}}>{description}</p>}
          {!done ?
            <p>Due to:&nbsp;<span style={{
              color: 'rgb(94, 124, 255)',
              fontWeight: 'bold'
            }}>{`${dateParsed.getDate()}.${dateParsed.getMonth() + 1}.${dateParsed.getUTCFullYear()}`}</span></p>
            :
            <p style={{textDecoration: 'line-through'}}>Due to:&nbsp;<span style={{
              color: 'rgb(94, 124, 255)',
              fontWeight: 'bold'
            }}>{`${dateParsed.getDate()}.${dateParsed.getMonth() + 1}.${dateParsed.getUTCFullYear()}`}</span></p>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <div style={{marginRight: '1rem'}}>
            <button onClick={setEditForm}><i className="fas fa-edit fa-1x">{}</i></button>
          </div>
          <div style={{marginRight: '1rem'}}>
            <button onClick={deleteEntry}><i className="fas fa-trash fa-1x">{}</i></button>
          </div>
        </div>
      </Card>
    );

  } else {
    return (
      <Card>
        <div style={{backgroundColor: 'rgb(255, 184, 0)', height: '70%', width: '4px'}}>{}</div>
        <Checkbox>
          <input type="checkbox" checked={localDone} onChange={onChange}/>
          <span className="checkmark">
                <span className="innerMark"/>
              </span>
        </Checkbox>
        <div>
          {!done ? <h3>{title}</h3> : <h3 style={{textDecoration: 'line-through'}}>{title}</h3>}
          {!done ? <p>{description}</p> : <p style={{textDecoration: 'line-through'}}>{description}</p>}
          {!done ?
            <p>Due to: &nbsp;<span style={{
              color: 'rgb(255, 184, 0)',
              fontWeight: 'bold'
            }}>{`${dateParsed.getDate()}.${dateParsed.getMonth() + 1}.${dateParsed.getUTCFullYear()}`}</span>
            </p>
            :
            <p style={{textDecoration: 'line-through'}}>Due to: &nbsp;<span style={{
              color: 'rgb(255, 184, 0)',
              fontWeight: 'bold'
            }}>{`${dateParsed.getDate()}.${dateParsed.getMonth() + 1}.${dateParsed.getUTCFullYear()}`}</span>
            </p>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <div style={{marginRight: '1rem'}}>
            <button onClick={setEditForm}><i className="fas fa-edit fa-1x">{}</i></button>
          </div>
          <div style={{marginRight: '1rem'}}>
            <button onClick={deleteEntry}><i className="fas fa-trash fa-1x">{}</i></button>
          </div>
        </div>
      </Card>
    );
  }
}

export default TaskItem;