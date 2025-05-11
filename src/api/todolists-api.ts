// src/api/todolists-api.ts

import { instance } from "./instance"

// ... импорты, instance ...

export type ApiTaskType = {
    id: string // <-- NUMBER
    title: string
    isDone: boolean
    todolistId: string // <-- NUMBER
    createdAt: string
    updatedAt: string
}
 export type ApiTodolistType = {
    id: string // <-- NUMBER
    title: string
    userId: string // <-- NUMBER (ID пользователя тоже число)
    createdAt: string
    updatedAt: string
}
 export type UpdateTaskModelType = {
    title?: string
    isDone?: boolean
}

export const todolistsAPI = {
    getTodolists() {
        // `.get` возвращает { data: Array<ApiTodolistType> }
        return instance.get<Array<ApiTodolistType>>('todolists');
    },
    createTodolist(title: string) {
        // `.post` возвращает { data: ApiTodolistType }
        return instance.post<ApiTodolistType>('todolists', { title });
    },
    deleteTodolist(todolistId: string) { // <-- number
        return instance.delete<void>(`todolists/${todolistId}`);
    },
    updateTodolistTitle(todolistId: string, title: string) { // <-- number
        return instance.put<ApiTodolistType>(`todolists/${todolistId}`, { title });
    },
    getTasks(todolistId: string) { // <-- number
        return instance.get<Array<ApiTaskType>>(`todolists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, title: string) { // <-- number
        return instance.post<ApiTaskType>(`todolists/${todolistId}/tasks`, { title });
    },
    deleteTask(todolistId: string, taskId: string) { // <-- number, number
        return instance.delete<void>(`todolists/${todolistId}/tasks/${taskId}`);
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) { // <-- number, number
        return instance.put<ApiTaskType>(`todolists/${todolistId}/tasks/${taskId}`, model);
    }
}