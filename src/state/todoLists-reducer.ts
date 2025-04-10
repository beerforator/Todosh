import { error } from "console"
import { FilterParameterType, TodolistType } from "../App"
import { v1 } from "uuid"

export type DeleteTodolistActionType = {
    type: "LIST-DELETE"
    id: string
}

export type AddTodolistActionType = {
    type: "LIST-ADD"
    id_list: string
    title: string
}

type ChangeTodolistTitleActionType = {
    type: "LIST-CHANGE-TITLE"
    id: string
    title: string
}

type ChangeTodolistFilterActionType = {
    type: "LIST-CHANGE-FILTER"
    id: string
    filter: FilterParameterType
}

export type ActionsType = DeleteTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType

export const toDoListsReducer = (state: Array<TodolistType>, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case 'LIST-DELETE': {
            const todolistsAfterRemoved = state.filter((l) => l.id !== action.id)
            if (todolistsAfterRemoved) {
                return todolistsAfterRemoved
            }
            return state
        }
        case 'LIST-ADD': {
            let newTodolist: TodolistType = {
                id: action.id_list,
                title: action.title,
                filterParameter: 'all'
            }
            return [newTodolist, ...state]
        }
        case 'LIST-CHANGE-TITLE': {
            const todolistforchange = state.find((l) => l.id === action.id)
            if (todolistforchange) {
                todolistforchange.title = action.title
                return [...state]
            }
            return state
        }
        case 'LIST-CHANGE-FILTER': {
            const filteringList = state.find((tl) => {
                if (tl.id === action.id) {
                    return tl
                }
            })
            if (filteringList) {
                filteringList.filterParameter = action.filter
                return [...state]
            }
            return state
        }
        default:
            throw new Error(`I haven't this action`)
    }
}

export const deleteTodolistAC = (id: string): DeleteTodolistActionType => {
    return {
        type: "LIST-DELETE",
        id: id
    }
}

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {
        type: "LIST-ADD",
        id_list: v1(),
        title: title
    }
}

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {
        type: "LIST-CHANGE-TITLE",
        id: id,
        title: title
    }
}

export const changeTodolistFiltereAC = (id: string, filter: FilterParameterType): ChangeTodolistFilterActionType => {
    return {
        type: "LIST-CHANGE-FILTER",
        id: id,
        filter: filter
    }
}