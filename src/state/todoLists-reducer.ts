import { v1 } from "uuid"

import { FilterParameterType, TodolistType } from "../AppWithRedux"
import { UnknownAction } from "redux"

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

export const toDoListsReducer = (state: Array<TodolistType> = initialState, action: UnknownAction): Array<TodolistType> => {
    switch (action.type) {
        case 'LIST-DELETE': {
            // Используем type assertion 'as', чтобы получить доступ к полям
            const specificAction = action as DeleteTodolistActionType;
            const stateCopy = [...state];
            const todolistsAfterRemoved = stateCopy.filter((l) => l.id !== specificAction.id);
            // ...
            return todolistsAfterRemoved ? todolistsAfterRemoved : stateCopy;
        }
        case 'LIST-ADD': {
            const specificAction = action as AddTodolistActionType;
            // ...
            let newTodolist: TodolistType = {
                id: specificAction.id_list,
                title: specificAction.title,
                filterParameter: 'all'
            }
            return [newTodolist, ...state];
        }
        case 'LIST-CHANGE-TITLE': {
            const specificAction = action as ChangeTodolistTitleActionType;
            const todolistforchange = state.find((l) => l.id === specificAction.id);
            if (todolistforchange) {
                todolistforchange.title = specificAction.title;
                return [...state]; // Нужно создать новый массив для иммутабельности
            }
            return state;
        }
        case 'LIST-CHANGE-FILTER': {
            const specificAction = action as ChangeTodolistFilterActionType;
            const filteringList = state.find((tl) => tl.id === specificAction.id);
            if (filteringList) {
                filteringList.filterParameter = specificAction.filter;
                return [...state]; // Нужно создать новый массив для иммутабельности
            }
            return state;
        }
        default:
            return state;
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