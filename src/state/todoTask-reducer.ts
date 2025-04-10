import { error } from "console"
import { FilterParameterType, TodolistsObjType, TodolistType } from "../App"
import { v1 } from "uuid"
import { AddTodolistActionType, DeleteTodolistActionType,  } from "./todoLists-reducer"

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

export const tasksReducer = (state: TodolistsObjType, action: ActionsType): TodolistsObjType => {
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
            const stateCopy = { ...state }
            const changedTask = stateCopy[action.id_list].find((t) => t.id === action.id_task)
            if (changedTask) {
                changedTask.title = action.title
                return stateCopy
            }
            return stateCopy
        }
        case 'TASK-CHANGE-STATUS': {
            const stateCopy = { ...state }
            const changedTask = stateCopy[action.id_list].find((t) => t.id === action.id_task)
            if (changedTask) {
                changedTask.isDone = action.isDone
                return stateCopy
            }
            return stateCopy
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
            throw new Error(`I haven't this action`)
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