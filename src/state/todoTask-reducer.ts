import { v1 } from "uuid"

import { TodolistsObjType } from "../AppWithRedux"
import { AddTodolistActionType, DeleteTodolistActionType, tid1, tid2, } from "./todoLists-reducer"
import { UnknownAction } from "redux"

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

export const tasksReducer = (state: TodolistsObjType = initialState, action: UnknownAction): TodolistsObjType => {
    switch (action.type) {
        case 'TASK-DELETE': {
            // Используем type assertion 'as'
            const specificAction = action as DeleteTaskActionType;
            // Копируем только тот массив задач, который меняем
            const tasksInList = state[specificAction.id_list];
            const updatedTasks = tasksInList.filter(t => t.id !== specificAction.id_task);
            // Возвращаем новый объект state с обновленным массивом задач
            return {
                ...state,
                [specificAction.id_list]: updatedTasks
            };
        }
        case 'TASK-ADD': {
            const specificAction = action as AddTaskActionType;
            const newTask = { id: v1(), title: specificAction.title, isDone: false };
            // Копируем нужный массив и добавляем новую задачу
            const updatedTasks = [...state[specificAction.id_list], newTask];
            return {
                ...state,
                [specificAction.id_list]: updatedTasks
            };
        }
        case 'TASK-CHANGE-TITLE': {
            const specificAction = action as ChangeTaskTitleActionType;
            const tasksInList = state[specificAction.id_list];
            const updatedTasks = tasksInList.map(t =>
                t.id === specificAction.id_task
                    ? { ...t, title: specificAction.title }
                    : t
            );
            return {
                ...state,
                [specificAction.id_list]: updatedTasks
            };
        }
        case 'TASK-CHANGE-STATUS': {
            const specificAction = action as ChangeTaskStatusActionType;
            const tasksInList = state[specificAction.id_list];
            const updatedTasks = tasksInList.map(t =>
                t.id === specificAction.id_task
                    ? { ...t, isDone: specificAction.isDone }
                    : t
            );
            return {
                ...state,
                [specificAction.id_list]: updatedTasks
            };
        }
        // Обработка экшенов из todoLists-reducer
        case 'LIST-ADD': {
            const specificAction = action as AddTodolistActionType;
            // Добавляем пустой массив задач для нового списка
            return {
                ...state,
                [specificAction.id_list]: []
            };
        }
        case 'LIST-DELETE': {
            const specificAction = action as DeleteTodolistActionType;
            const stateCopy = { ...state };
            // Удаляем свойство (массив задач) для удаленного списка
            delete stateCopy[specificAction.id];
            return stateCopy;
        }
        default:
            return state;
    }
};

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


//export { TodolistsObjType }

