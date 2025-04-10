import { v1 } from "uuid";
import { addTodolistAC, changeTodolistFiltereAC, changeTodolistTitleAC, deleteTodolistAC, toDoListsReducer } from "./todoLists-reducer";
import { TodolistType } from "../App";

test('shoud delete list', () => {
    let tid1 = v1()
    let tid2 = v1()

    const state: Array<TodolistType> = [
        { id: tid1, title: "Study", filterParameter: "all" },
        { id: tid2, title: "Movies", filterParameter: "all" }
    ]

    const endState = toDoListsReducer(state, deleteTodolistAC(tid1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(tid2);
});

test('shoud add list', () => {
    let tid1 = v1()
    let tid2 = v1()

    const state: Array<TodolistType> = [
        { id: tid1, title: "Study", filterParameter: "all" },
        { id: tid2, title: "Movies", filterParameter: "all" }
    ]

    const newListTitle = "NewList"

    const endState = toDoListsReducer(state, addTodolistAC(newListTitle))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newListTitle);
});

test('shoud change list title', () => {
    let tid1 = v1()
    let tid2 = v1()

    const state: Array<TodolistType> = [
        { id: tid1, title: "Study", filterParameter: "all" },
        { id: tid2, title: "Movies", filterParameter: "all" }
    ]

    const newListTitle = "NewList"

    const endState = toDoListsReducer(state, changeTodolistTitleAC(tid1, newListTitle))

    expect(endState.length).toBe(2);
    expect(endState[0].title).toBe(newListTitle);
    expect(endState[0].id).toBe(tid1);
    expect(endState[1].id).toBe(tid2);
});

test('shoud set filter in list', () => {
    let tid1 = v1()
    let tid2 = v1()

    const state: Array<TodolistType> = [
        { id: tid1, title: "Study", filterParameter: "all" },
        { id: tid2, title: "Movies", filterParameter: "all" }
    ]

    const newFilter = "active"

    const endState = toDoListsReducer(state, changeTodolistFiltereAC(tid2, newFilter))

    expect(endState.length).toBe(2);
    expect(endState[0].filterParameter).toBe('all');
    expect(endState[1].filterParameter).toBe(newFilter);
    expect(endState[0].id).toBe(tid1);
    expect(endState[1].id).toBe(tid2);
});