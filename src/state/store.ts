import { combineReducers, createStore } from "redux";
import { tasksReducer } from "./todoTask-reducer";
import { toDoListsReducer } from "./todoLists-reducer";

export const rootReducer = combineReducers({
    lists: toDoListsReducer,
    tasks: tasksReducer
})

// type AppRootState = {
//     lists: Array<TodolistType>
//     tasks: TodolistsObjType
// }
//             ||
//             ||
//             \/

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer)

// @ts-ignore
window.store = store