import React, { use, useState } from 'react';
import './App.css';

import TaskManager, { TaskArr } from './Task-manager'
import { v1 } from 'uuid';

export type FilterParameterType = 'all' | 'active' | 'completed'

export type TodolistType = {
  id: string
  title: string
  filterParameter: FilterParameterType
}

function App() {
  function deleteList(tlId: string) {
    const todolistsAfterRemoved = todolists.filter((l) => {
      if (l.id === tlId) {
        return false
      } return true
    })
    if (todolistsAfterRemoved){
      setTodolists(todolistsAfterRemoved)
      delete todolistsObj[tlId]
      setTodolistsObj({...todolistsObj})
    }
  }

  function addList(tlId: string, taskTitle: string) {
    let newTask = { id: v1(), title: taskTitle, isDone: false }
    todolistsObj[tlId] = [newTask, ...todolistsObj[tlId]]
    setTodolistsObj({ ...todolistsObj })
  }

  function deleteTask(tlId: string, taskId: string) {
    const listAfterRemovingTask = todolistsObj[tlId].filter((t) => {
      if (t.id === taskId) { return false }
      return true
    })
    todolistsObj[tlId] = listAfterRemovingTask
    setTodolistsObj({ ...todolistsObj })
  }

  function addTask(tlId: string, taskTitle: string) {
    let newTask = { id: v1(), title: taskTitle, isDone: false }
    todolistsObj[tlId] = [newTask, ...todolistsObj[tlId]]
    setTodolistsObj({ ...todolistsObj })
  }

  function changeTaskStatus(tlId: string, taskId: string, isDone: boolean) {
    // ?????????????
    const changedTask = todolistsObj[tlId].find((t) => t.id === taskId)
    if (changedTask) { changedTask.isDone = isDone }
    setTodolistsObj({ ...todolistsObj })
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

  let [todolistsObj, setTodolistsObj] = useState({
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
          <TaskManager
            key={tl.id}
            id={tl.id}
            title={tl.title}
            tasks={exitTasksStud}
            deleteTask={deleteTask}
            filterTasks={filterTasks}
            addTask={addTask}
            changeTaskStatus={changeTaskStatus}
            filterParameter={tl.filterParameter}
            deleteList={deleteList}
          />
        )
      })}
    </div>
  );
}

export default App;
