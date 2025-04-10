import React, { use, useState } from 'react';
import './App.css';

import TaskManager, { TaskArr } from './Task-manager'
import AddItemInput from './AddItemInput';
import { v1 } from 'uuid';
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

function App() {
  function deleteList(tlId: string) {
    const todolistsAfterRemoved = todolists.filter((l) => {
      if (l.id === tlId) {
        return false
      } return true
    })
    if (todolistsAfterRemoved) {
      setTodolists(todolistsAfterRemoved)
      delete todolistsObj[tlId]
      setTodolistsObj({ ...todolistsObj })
    }
  }

  function addList(listTitle: string) {
    let newTodolist: TodolistType = {
      id: v1(),
      title: listTitle,
      filterParameter: 'all'
    }
    setTodolists([newTodolist, ...todolists])
    setTodolistsObj({ [newTodolist.id]: [], ...todolistsObj })
  }

  function deleteTask(tlId: string, taskId: string) {
    const listAfterRemovingTask = todolistsObj[tlId].filter((t) => {
      if (t.id === taskId) { return false }
      return true
    })
    todolistsObj[tlId] = listAfterRemovingTask
    setTodolistsObj({ ...todolistsObj })
  }

  function addItem(tlId: string, taskTitle: string) {
    let newTask = { id: v1(), title: taskTitle, isDone: false }
    todolistsObj[tlId] = [...todolistsObj[tlId], newTask]
    setTodolistsObj({ ...todolistsObj })
  }

  function changeTaskStatus(tlId: string, taskId: string, isDone: boolean) {
    const changedTask = todolistsObj[tlId].find((t) => t.id === taskId)
    if (changedTask) {
      changedTask.isDone = isDone
      setTodolistsObj({ ...todolistsObj })
    }
  }

  function changeTaskTitle(tlId: string, taskId: string, title: string) {
    const changedTask = todolistsObj[tlId].find((t) => t.id === taskId)
    if (changedTask) {
      changedTask.title = title
      setTodolistsObj({ ...todolistsObj })
    }
  }

  function changeTodolistTitle(tlId: string, title: string) {
    const changedList = todolists.find((t) => t.id === tlId)
    if (changedList) { changedList.title = title }
    setTodolists([...todolists])
  }

  function filterTasks(tlId: string, fparam: FilterParameterType) {
    const filteringList = todolists.find((tl) => {
      if (tl.id === tlId) {
        return tl
      }
    })
    if (filteringList) {
      filteringList.filterParameter = fparam
      setTodolists([...todolists])
    }
  }

  let tid1 = v1()
  let tid2 = v1()

  let [todolists, setTodolists] = useState<Array<TodolistType>>([
    { id: tid1, title: "Study", filterParameter: "all" },
    { id: tid2, title: "Movies", filterParameter: "all" }
  ])

  let [todolistsObj, setTodolistsObj] = useState<TodolistsObjType>({
    [tid1]: [
      { id: v1(), title: 'TMP', isDone: true },
      { id: v1(), title: 'Networks Safety', isDone: false },
      { id: v1(), title: 'Filosofy', isDone: true },
      { id: v1(), title: 'Math', isDone: true }
    ],
    [tid2]: [
      { id: v1(), title: 'Stalker', isDone: false },
      { id: v1(), title: 'Zhmurki', isDone: true },
      { id: v1(), title: 'Shameless', isDone: false }
    ]
  })

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
        <Grid container style={{padding: "30px 0"}}> 
          <AddItemInput
            addItem={addList}
          />
        </Grid>
        <Grid container spacing={10}>
          {todolists.map((tl) => {
            let currentTodolist = todolistsObj[tl.id]
            let exitTasksStud = currentTodolist
            if (tl.filterParameter === 'active') {
              exitTasksStud = currentTodolist.filter(t => t.isDone === false)
            }
            if (tl.filterParameter === 'completed') {
              exitTasksStud = currentTodolist.filter(t => t.isDone === true)
            }

            return (
              <Paper style={{padding: "20px"}}>
                <TaskManager
                  key={tl.id}
                  id={tl.id}
                  title={tl.title}
                  tasks={exitTasksStud}
                  deleteTask={deleteTask}
                  filterTasks={filterTasks}
                  addItem={addItem}
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
}

export default App;
