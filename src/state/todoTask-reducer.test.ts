import { addTodolistAC, deleteTodolistAC } from "./todoLists-reducer";
import { TodolistsObjType } from "../AppWithRedux";
import { deleteTaskAC, addTaskAC, tasksReducer, changeTaskTitleAC, changeTaskStatusAC } from "./todoTask-reducer";

test('shoud delete task', () => {
    let stateListsObj = <TodolistsObjType>({
        ["tid1"]: [
            { id: "1", title: 'TMP', isDone: true },
            { id: "2", title: 'Networks Safety', isDone: false },
            { id: "3", title: 'Filosofy', isDone: true },
            { id: "4", title: 'Math', isDone: true }
        ],
        ["tid2"]: [
            { id: "1", title: 'Stalker', isDone: false },
            { id: "2", title: 'Zhmurki', isDone: true },
            { id: "3", title: 'Shameless', isDone: false }
        ]
    })

    const endState = tasksReducer(stateListsObj, deleteTaskAC("tid1", "2"))

    expect(endState["tid1"].length).toBe(3);
    expect(endState["tid2"].length).toBe(3);
    expect(endState["tid1"].every(t => t.id !== "2")).toBeTruthy()
});

test('shoud add task', () => {
    let stateListsObj = <TodolistsObjType>({
        ["tid1"]: [
            { id: "1", title: 'TMP', isDone: true },
            { id: "2", title: 'Networks Safety', isDone: false },
            { id: "3", title: 'Filosofy', isDone: true },
            { id: "4", title: 'Math', isDone: true }
        ],
        ["tid2"]: [
            { id: "1", title: 'Stalker', isDone: false },
            { id: "2", title: 'Zhmurki', isDone: true },
            { id: "3", title: 'Shameless', isDone: false }
        ]
    })

    const endState = tasksReducer(stateListsObj, addTaskAC("tid1", "qwert"))

    expect(endState["tid1"].length).toBe(5);
    expect(endState["tid2"].length).toBe(3);
    expect(endState["tid1"][4].title).toBe("qwert")
    expect(endState["tid1"][4].isDone).toBe(false)
});

test('shoud change task title', () => {
    let stateListsObj = <TodolistsObjType>({
        ["tid1"]: [
            { id: "1", title: 'TMP', isDone: true },
            { id: "2", title: 'Networks Safety', isDone: false },
            { id: "3", title: 'Filosofy', isDone: true },
            { id: "4", title: 'Math', isDone: true }
        ],
        ["tid2"]: [
            { id: "1", title: 'Stalker', isDone: false },
            { id: "2", title: 'Zhmurki', isDone: true },
            { id: "3", title: 'Shameless', isDone: false }
        ]
    })

    const endState = tasksReducer(stateListsObj, changeTaskTitleAC("tid2", "2", "qwert"))

    expect(endState["tid1"].length).toBe(4);
    expect(endState["tid2"].length).toBe(3);
    expect(endState["tid1"][1].title).toBe("Networks Safety")
    expect(endState["tid2"][1].title).toBe("qwert")
});

test('shoud change task status', () => {
    let stateListsObj = <TodolistsObjType>({
        ["tid1"]: [
            { id: "1", title: 'TMP', isDone: true },
            { id: "2", title: 'Networks Safety', isDone: false },
            { id: "3", title: 'Filosofy', isDone: false },
            { id: "4", title: 'Math', isDone: true }
        ],
        ["tid2"]: [
            { id: "1", title: 'Stalker', isDone: false },
            { id: "2", title: 'Zhmurki', isDone: true },
            { id: "3", title: 'Shameless', isDone: false }
        ]
    })

    const endState = tasksReducer(stateListsObj, changeTaskStatusAC("tid1", "3", true))

    expect(endState["tid1"].length).toBe(4);
    expect(endState["tid2"].length).toBe(3);
    expect(endState["tid1"][2].isDone).toBe(true)
    expect(endState["tid2"][2].isDone).toBe(false)
});

test('shoud add tasks array when new list is added', () => {
    let stateListsObj = <TodolistsObjType>({
        ["tid1"]: [
            { id: "1", title: 'TMP', isDone: true },
            { id: "2", title: 'Networks Safety', isDone: false },
            { id: "3", title: 'Filosofy', isDone: false },
            { id: "4", title: 'Math', isDone: true }
        ],
        ["tid2"]: [
            { id: "1", title: 'Stalker', isDone: false },
            { id: "2", title: 'Zhmurki', isDone: true },
            { id: "3", title: 'Shameless', isDone: false }
        ]
    })

    const action = addTodolistAC("some title")
    const endState = tasksReducer(stateListsObj, action)

    expect(Object.keys(endState).length).toBe(3);
    expect(endState[Object.keys(endState)[2]]).toEqual([]);
});

test('shoud delete tasks before deleting list', () => {
    let stateListsObj = <TodolistsObjType>({
        ["tid1"]: [
            { id: "1", title: 'TMP', isDone: true },
            { id: "2", title: 'Networks Safety', isDone: false },
            { id: "3", title: 'Filosofy', isDone: false },
            { id: "4", title: 'Math', isDone: true }
        ],
        ["tid2"]: [
            { id: "1", title: 'Stalker', isDone: false },
            { id: "2", title: 'Zhmurki', isDone: true },
            { id: "3", title: 'Shameless', isDone: false }
        ]
    })

    const action = deleteTodolistAC("tid1")
    const endState = tasksReducer(stateListsObj, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(keys[0]).toBe("tid2")
})