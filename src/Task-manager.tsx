import React, { ChangeEventHandler, useState } from 'react';
import { FilterParameterType } from './App';
import AddItemInput from './AddItemInput';
import EditableSpan from './EditableSpan';
import { Button, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export type TaskArr = {
    id: string,
    title: string,
    isDone: boolean
}

type TaskTitle = {
    id: string
    title: string
    tasks: Array<TaskArr>
    deleteTask: (tlId: string, taskId: string) => void
    filterTasks: (tlId: string, value: FilterParameterType) => void
    addItem: (tlId: string, taskTitle: string) => void
    changeTaskStatus: (tlId: string, taskId: string, isDone: boolean) => void
    changeTodolistTitle: (tlId: string, title: string) => void
    changeTaskTitle: (tlId: string, taskId: string, title: string) => void
    filterParameter: FilterParameterType
    deleteList: (tlId: string) => void
}

function TaskManager(props: TaskTitle) {
    const onClickFilterAll = () => props.filterTasks(props.id, 'all')
    const onClickFilterActive = () => props.filterTasks(props.id, 'active')
    const onClickFilterCompleted = () => props.filterTasks(props.id, 'completed')
    const onClickDeleteList = () => props.deleteList(props.id)

    const addItem = (title: string) => {
        props.addItem(props.id, title)
    }

    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title)
    }

    return (
        <div>
            <h3>
                <EditableSpan
                    title={props.title}
                    onChange={changeTodolistTitle}
                />
                <IconButton aria-label="delete" onClick={onClickDeleteList}>
                    <DeleteIcon />
                </IconButton>
            </h3>
            <AddItemInput addItem={addItem} />
            <ul>
                {
                    props.tasks.map((t) => {
                        const onClickDeleteTaskHandler = () => props.deleteTask(props.id, t.id)
                        const onChangeTaskStatusHandler = (e: React.ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(props.id, t.id, e.currentTarget.checked)
                        const onChangeTaskTitleHandler = (title: string) => props.changeTaskTitle(props.id, t.id, title)
                        return (
                            <li key={t.id} className={t.isDone ? "doned_task" : ""}>
                                <Checkbox
                                    checked={t.isDone}
                                    onChange={onChangeTaskStatusHandler}
                                />
                                <EditableSpan
                                    title={t.title}
                                    onChange={onChangeTaskTitleHandler}
                                />
                                <IconButton aria-label="delete" onClick={onClickDeleteTaskHandler} size="small">
                                    <DeleteIcon color="secondary" fontSize='small'/>
                                </IconButton>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <Button variant={props.filterParameter === "all" ? "contained" : "text"}
                    onClick={onClickFilterAll}
                >All</Button>
                <Button variant={props.filterParameter === "active" ? "contained" : "text"}
                    onClick={onClickFilterActive}
                >Active</Button>
                <Button variant={props.filterParameter === "completed" ? "contained" : "text"}
                    onClick={onClickFilterCompleted}
                >Completed</Button>
            </div>
        </div>
    )
}

export default TaskManager