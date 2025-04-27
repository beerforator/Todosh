import { v1 } from "uuid"

import { TodolistsObjType } from "../AppWithRedux"
import { AddTodolistActionType, DeleteTodolistActionType, tid1, tid2, } from "./todoLists-reducer"

type DeleteTaskActionType = {
    type: "TASK-DELETE"
    id_list: string
    id_task: string
}

type AddTaskActionType = {
    type: "TASK-ADD"
    id_list: string
    title: string
}

type ChangeTaskTitleActionType = {
    type: "TASK-CHANGE-TITLE"
    id_list: string
    id_task: string
    title: string
}

type ChangeTaskStatusActionType = {
    type: "TASK-CHANGE-STATUS"
    id_list: string
    id_task: string
    isDone: boolean
}

export type ActionsType = DeleteTaskActionType | AddTaskActionType
    | ChangeTaskTitleActionType | ChangeTaskStatusActionType | AddTodolistActionType | DeleteTodolistActionType

const initialState: TodolistsObjType = {
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
}

export const tasksReducer = (state: TodolistsObjType = initialState, action: ActionsType): TodolistsObjType => {
    switch (action.type) {
        case 'TASK-DELETE': {
            const stateCopy = { ...state }
            const listAfterRemovingTask = stateCopy[action.id_list].filter((t) => {
                if (t.id === action.id_task) { return false }
                return true
            })
            stateCopy[action.id_list] = listAfterRemovingTask
            return stateCopy
        }
        case 'TASK-ADD': {
            const stateCopy = { ...state }
            let newTask = { id: v1(), title: action.title, isDone: false }
            stateCopy[action.id_list] = [...stateCopy[action.id_list], newTask]
            return stateCopy
        }
        case 'TASK-CHANGE-TITLE': {
            let tasks = state[action.id_list]
            state[action.id_list] = tasks
                .map((t) => t.id === action.id_task
                    ? { ...t, title: action.title }
                    : t)
            return { ...state }
        }
        case 'TASK-CHANGE-STATUS': {
            let tasks = state[action.id_list]
            state[action.id_list] = tasks
                .map((t) => t.id === action.id_task
                    ? { ...t, isDone: action.isDone }
                    : t)
            return { ...state }
        }
        case 'LIST-ADD': {
            const stateCopy = { ...state }

            stateCopy[action.id_list] = []

            return stateCopy
        }
        case 'LIST-DELETE': {
            const stateCopy = { ...state }

            delete stateCopy[action.id]

            return stateCopy
        }
        default:
            return state
    }
}

export const deleteTaskAC = (id_list: string, id_task: string): DeleteTaskActionType => {
    return {
        type: "TASK-DELETE",
        id_list: id_list,
        id_task: id_task
    }
}

export const addTaskAC = (id_list: string, title: string): AddTaskActionType => {
    return {
        type: "TASK-ADD",
        id_list: id_list,
        title: title
    }
}

export const changeTaskTitleAC = (id_list: string, id_task: string, title: string): ChangeTaskTitleActionType => {
    return {
        type: "TASK-CHANGE-TITLE",
        id_list: id_list,
        id_task: id_task,
        title: title
    }
}

export const changeTaskStatusAC = (id_list: string, id_task: string, isDone: boolean): ChangeTaskStatusActionType => {
    return {
        type: "TASK-CHANGE-STATUS",
        id_list: id_list,
        id_task: id_task,
        isDone: isDone
    }
}