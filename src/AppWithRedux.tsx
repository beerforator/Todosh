import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

import './App.css';
import TaskManager, { TaskArr } from './Task-manager'
import AddItemInput from './AddItemInput';
import { addTodolistAC, changeTodolistFiltereAC, changeTodolistTitleAC, deleteTodolistAC } from './state/todoLists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC } from './state/todoTask-reducer';
import { AppRootState } from './state/store';

import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export type FilterParameterType = 'all' | 'active' | 'completed'

export type TodolistType = {
  id: string
  title: string
  filterParameter: FilterParameterType
}

export type TodolistsObjType = {
  [key: string]: Array<TaskArr>
}

const AppWithRedux = React.memo(() => {
  console.log("App call ###############################")

  const dispatchToRootReducer = useDispatch()
  const lists = useSelector<AppRootState, Array<TodolistType>>(state => state.lists)
  const tasks = useSelector<AppRootState, TodolistsObjType>(state => state.tasks)

  const deleteTask = useCallback((id_list: string, id_task: string) => {
    const action = deleteTaskAC(id_list, id_task)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  const addTask = useCallback((id_list: string, title: string) => {
    const action = addTaskAC(id_list, title)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  const changeTaskTitle = useCallback((id_list: string, id_task: string, title: string) => {
    const action = changeTaskTitleAC(id_list, id_task, title)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  const changeTaskStatus = useCallback((id_list: string, id_task: string, isDone: boolean) => {
    const action = changeTaskStatusAC(id_list, id_task, isDone)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])



  const deleteList = useCallback((id_list: string) => {
    const action = deleteTodolistAC(id_list)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  const addList = useCallback((listTitle: string) => {
    const action = addTodolistAC(listTitle)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  const changeTodolistTitle = useCallback((id_list: string, title: string) => {
    const action = changeTodolistTitleAC(id_list, title)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  const filterTasks = useCallback((id_list: string, fparam: FilterParameterType) => {
    const action = changeTodolistFiltereAC(id_list, fparam)
    dispatchToRootReducer(action)
  }, [dispatchToRootReducer])

  return (
    <div className='App'>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Simle and small ToDO yet
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "30px 0" }}>
          <AddItemInput
            addItem={addList}
          />
        </Grid>
        <Grid container spacing={10}>
          {lists.map((tl) => {
            let currentTodolist = tasks[tl.id]
            let exitTasksStud = currentTodolist

            return (
              <Paper style={{ padding: "20px" }}>
                <TaskManager
                  key={tl.id}
                  id={tl.id}
                  title={tl.title}
                  tasks={exitTasksStud}
                  deleteTask={deleteTask}
                  filterTasks={filterTasks}
                  addItem={addTask}
                  changeTaskStatus={changeTaskStatus}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  filterParameter={tl.filterParameter}
                  deleteList={deleteList}
                />
              </Paper>
            )
          })}
        </Grid>
      </Container>
    </div>
  );
})

export default AppWithRedux;
