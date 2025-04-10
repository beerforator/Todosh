import { TodolistsObjType, TodolistType } from "../App"
import { addTodolistAC, toDoListsReducer } from "./todoLists-reducer"
import { tasksReducer } from "./todoTask-reducer"

test('it shoud be equals', () => {
    const tasksState: TodolistsObjType = {}
    const listsState: Array<TodolistType> = []

    const action = addTodolistAC("new list title")
    const endTasksState = tasksReducer(tasksState, action)
    const endListsState = toDoListsReducer(listsState, action)

    const keys = Object.keys(endTasksState)
    const newListIdFromTR = keys[0]
    const newListIdFromLR = endListsState[0].id

    expect(newListIdFromTR).toBe(action.id_list)
    expect(newListIdFromLR).toBe(action.id_list)
})