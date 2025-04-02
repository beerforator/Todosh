import React, { ChangeEventHandler, useState } from 'react';
import { FilterParameterType } from './App';
import AddItemInput from './AddItemInput';
import EditableSpan from './EditableSpan';

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
                <button onClick={onClickDeleteList}>x</button>
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
                                <input
                                    type="checkbox"
                                    checked={t.isDone}
                                    onChange={onChangeTaskStatusHandler}
                                />
                                <EditableSpan
                                    title={t.title}
                                    onChange={onChangeTaskTitleHandler}
                                />
                                <button onClick={onClickDeleteTaskHandler}>x</button>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <button
                    className={props.filterParameter === "all" ? "active_filter_button" : ""}
                    onClick={onClickFilterAll}
                >All</button>
                <button
                    className={props.filterParameter === "active" ? "active_filter_button" : ""}
                    onClick={onClickFilterActive}
                >Active</button>
                <button
                    className={props.filterParameter === "completed" ? "active_filter_button" : ""}
                    onClick={onClickFilterCompleted}
                >Completed</button>
            </div>
        </div>
    )
}

export default TaskManager