import React, { useCallback } from 'react';

import { FilterParameterType } from './AppWithRedux';
import AddItemInput from './AddItemInput';
import EditableSpan from './EditableSpan';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Checkbox, IconButton } from '@mui/material';
import TaskLine from './TaskLine';
import { RequestStatusType } from './state/todolistsSlice';

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
    entityStatus: RequestStatusType
}

const TaskManager = React.memo((props: TaskTitle) => {
    console.log("Task Manager call --------------------")

    const onClickFilterAll = useCallback(() => props.filterTasks(props.id, 'all'), [props.filterTasks, props.id])
    const onClickFilterActive = useCallback(() => props.filterTasks(props.id, 'active'), [props.filterTasks, props.id])
    const onClickFilterCompleted = useCallback(() => props.filterTasks(props.id, 'completed'), [props.filterTasks, props.id])
    const onClickDeleteList = useCallback(() => props.deleteList(props.id), [props.filterTasks, props.id])

    const addItem = useCallback((title: string) => {
        props.addItem(props.id, title)
    }, [])

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.changeTodolistTitle, props.id])

    let exitTasksStud = props.tasks

    if (props.filterParameter === 'active') {
        exitTasksStud = props.tasks.filter(t => t.isDone === false)
    }
    if (props.filterParameter === 'completed') {
        exitTasksStud = props.tasks.filter(t => t.isDone === true)
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
                    exitTasksStud.map((t) =>
                        <TaskLine
                            key={t.id}
                            task={t}
                            id_list={props.id}
                            deleteTask={props.deleteTask}
                            changeTaskStatus={props.changeTaskStatus}
                            changeTaskTitle={props.changeTaskTitle}
                        />
                    )
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
})

export default TaskManager