import { v1 } from "uuid"

import { FilterParameterType, TodolistType } from "../AppWithRedux"

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

export let tid1 = v1()
export let tid2 = v1()

const initialState: Array<TodolistType> = [
    { id: tid1, title: "Study", filterParameter: "all" },
    { id: tid2, title: "Movies", filterParameter: "all" }
]

export const toDoListsReducer = (state: Array<TodolistType> = initialState, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case 'LIST-DELETE': {
            const stateCopy = [...state]
            const todolistsAfterRemoved = stateCopy.filter((l) => l.id !== action.id)
            if (todolistsAfterRemoved) {
                return todolistsAfterRemoved
            }
            return stateCopy
        }
        case 'LIST-ADD': {
            const stateCopy = [...state]
            let newTodolist: TodolistType = {
                id: action.id_list,
                title: action.title,
                filterParameter: 'all'
            }
            return [newTodolist, ...stateCopy]
        }
        case 'LIST-CHANGE-TITLE': {
            const stateCopy = [...state]
            const todolistforchange = stateCopy.find((l) => l.id === action.id)
            if (todolistforchange) {
                todolistforchange.title = action.title
                return [...stateCopy]
            }
            return stateCopy
        }
        case 'LIST-CHANGE-FILTER': {
            
            const stateCopy = [...state]
            const filteringList = stateCopy.find((tl) => {
                if (tl.id === action.id) {
                    return tl
                }
            })
            if (filteringList) {
                filteringList.filterParameter = action.filter
                return [...stateCopy]
            }
            return stateCopy
        }
        default:
            return state
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