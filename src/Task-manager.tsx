import React, { ChangeEventHandler, useState } from 'react';
import { FilterParameterType } from './App';

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
    addTask: (tlId: string, taskTitle: string) => void
    changeTaskStatus: (tlId: string, taskId: string, isDone: boolean) => void
    filterParameter: FilterParameterType
    deleteList: (tlId: string) => void
}

function TaskManager(props: TaskTitle) {
    let [newTaskTitle, setNewTaskTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }
    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.ctrlKey && e.key === 'Enter') {
            if (newTaskTitle.trim() === "") {
                setError("Поле обязательно!")
                setNewTaskTitle("")
                return
            }
            props.addTask(props.id, newTaskTitle)
            setNewTaskTitle("")
        }
    }
    const onClickAddTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (newTaskTitle.trim() === "") {
            setError("Поле обязательно!")
            setNewTaskTitle("")
            return
        }
        props.addTask(props.id, newTaskTitle.trim())
        setNewTaskTitle("")
    }
    const onClickFilterAll = () => props.filterTasks(props.id, 'all')
    const onClickFilterActive = () => props.filterTasks(props.id, 'active')
    const onClickFilterCompleted = () => props.filterTasks(props.id, 'completed')
    const onClickDeleteList = () => props.deleteList(props.id)

    return (
        <div>
            <h3>{props.title}<button onClick={onClickDeleteList}>x</button></h3>
            <div>
                <input
                    value={newTaskTitle}
                    onChange={onNewTitleChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    className={error ? "error_input" : ""}
                />
                <button onClick={onClickAddTask}>+</button>
                {error && <div className="error_message">{error}</div>}
            </div>
            <ul>
                {
                    props.tasks.map((t) => {
                        const onClickDeleteTaskHandler = () => props.deleteTask(props.id, t.id)
                        const onChangeTaskStatusHandler = (e: React.ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(props.id, t.id, e.currentTarget.checked)
                        return (
                            <li key={t.id} className={t.isDone ? "doned_task" : ""}>
                                <input
                                    type="checkbox"
                                    checked={t.isDone}
                                    onChange={onChangeTaskStatusHandler}
                                />
                                <span>{t.title}</span>
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