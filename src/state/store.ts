import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";

import { tasksReducer } from "./tasksSlice";
import { todolistsReducer } from "./todolistsSlice";
import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from './authSlice'; // <-- Импорт

export const store = configureStore({
    reducer: {
        auth: authReducer,
        lists: todolistsReducer,
        tasks: tasksReducer // <-- ИСПОЛЬЗУЕМ НОВЫЙ
    }
});

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store
//createStore