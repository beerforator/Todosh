// src/state/tasksSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { todolistsAPI, ApiTaskType, UpdateTaskModelType } from '../api/todolists-api';
import { AppRootState } from './store'; // Для доступа к другим частям стейта
import { todolistsThunks, todolistsActions } from './todolistsSlice'; // Импортируем thunks и actions тудулистов

// Тип для задачи в UI (может совпадать с ApiTaskType, если не добавляем доп. поля)
// Если будешь добавлять entityStatus для каждой задачи, раскомментируй и импортируй RequestStatusType
// import { RequestStatusType } from './todolistsSlice';
export type TaskDomainType = ApiTaskType & {
    // entityStatus?: RequestStatusType;
};

// Тип состояния для задач (объект, где ключ - ID тудулиста (string), значение - массив задач)
export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
};
// Экспортируем этот тип под старым именем для совместимости, пока все не переписано
export type TodolistsObjType = TasksStateType;


const initialState: TasksStateType = {}; // Начинаем с пустого объекта

// --- Thunks для задач ---

// Загрузка задач для одного туду-листа
export const fetchTasks = createAsyncThunk<
    { todolistId: string; tasks: Array<ApiTaskType> },
    string, // todolistId
    { rejectValue: string }
>(
    'tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
        console.log('FEEETTCHHHHH')
        try {
            const res = await todolistsAPI.getTasks(todolistId);
            console.log('FEEETTCHHHHH', res.data)
            return { todolistId: todolistId, tasks: res.data };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch tasks';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Добавление задачи
export const addTask = createAsyncThunk<
    { task: ApiTaskType },
    { todolistId: string; title: string },
    { rejectValue: string }
>(
    'tasks/addTask',
    async (arg, thunkAPI) => {
        console.log('ADDDDDDDDDDDD')
        try {
            const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
            console.log('ADDDDDD', res.data)
            return { task: res.data };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to add task';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Удаление задачи
export const deleteTask = createAsyncThunk<
    { todolistId: string; taskId: string },
    { todolistId: string; taskId: string },
    { rejectValue: string }
>(
    'tasks/deleteTask',
    async (arg, thunkAPI) => {
        try {
            await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
            return { todolistId: arg.todolistId, taskId: arg.taskId };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to delete task';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Обновление задачи
type UpdateTaskArgType = {
    todolistId: string;
    taskId: string;
    model: UpdateTaskModelType; // Модель с обновляемыми полями (title, isDone, etc.)
};

export const updateTask = createAsyncThunk<
    { task: ApiTaskType },
    UpdateTaskArgType,
    { rejectValue: string; state: AppRootState }
>(
    'tasks/updateTask',
    async (arg, thunkAPI) => {
        // Можно получить текущие данные задачи из стейта, если API требует все поля
        // const state = thunkAPI.getState();
        // const tasksForCurrentTodolist = state.tasks[arg.todolistId];
        // const currentTask = tasksForCurrentTodolist?.find(t => t.id === arg.taskId);
        // if (!currentTask) {
        //     return thunkAPI.rejectWithValue(`Task with id ${arg.taskId} not found in todolist ${arg.todolistId}`);
        // }
        // const apiUpdateModel = { ...currentTask, ...arg.model }; // Собираем полную модель, если нужно

        try {
            // Отправляем только измененные поля, которые находятся в arg.model
            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, arg.model);
            return { task: res.data };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update task';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// --- Создание Slice ---
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        clearTasksData(state) { // Для очистки при логауте
            // Возвращаем новый пустой объект, чтобы полностью сбросить состояние
            return {};
        }
        // Можно добавить другие синхронные редьюсеры при необходимости
    },
    extraReducers: (builder) => {
        builder
            // Обработка Thunks для задач
            .addCase(fetchTasks.fulfilled, (state, action) => {
                // При загрузке задач для тудулиста, полностью заменяем массив задач для этого ID
                console.log('task FETCH')
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({ ...t }));
            })
            .addCase(addTask.fulfilled, (state, action) => {
                console.log('task ADDED')
                const tasks = state[action.payload.task.todolistId];
                if (tasks) { // Если массив задач для этого тудулиста уже существует
                    tasks.unshift({ ...action.payload.task });
                } else {
                    // Если это первая задача для тудулиста (маловероятно, если тудулист создается первым)
                    state[action.payload.task.todolistId] = [{ ...action.payload.task }];
                }
            })
            .addCase(addTask.rejected, (state, action) => {
                console.log('EXTRA ERRORR')
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                console.log('task DELETE')
                const tasks = state[action.payload.todolistId];
                if (tasks) {
                    const index = tasks.findIndex(t => t.id === action.payload.taskId);
                    if (index > -1) {
                        tasks.splice(index, 1);
                    }
                }
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todolistId];
                if (tasks) {
                    const index = tasks.findIndex(t => t.id === action.payload.task.id);
                    if (index > -1) {
                        tasks[index] = { ...action.payload.task }; // Заменяем старую задачу на обновленную
                    }
                }
            })

            // Обработка Thunks и Actions для туду-листов
            // Когда добавляется новый туду-лист, добавляем для него пустой массив задач
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            // Когда удаляется туду-лист, удаляем соответствующий массив задач
            .addCase(todolistsThunks.deleteTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId];
            })
            // Когда загружаются все туду-листы, можно инициализировать массивы задач, если они еще не существуют
            // Это полезно, если задачи не грузятся сразу с тудулистами.
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    if (!state[tl.id]) { // Если для этого тудулиста еще нет массива задач
                        state[tl.id] = [];
                    }
                });
            })
            // Очистка данных туду-листов (синхронный экшен из todolistsSlice)
            .addCase(todolistsActions.clearTodolistsData, (state) => {
                return initialState; // Сбрасываем все задачи, когда очищаются тудулисты
            });
        // Можно добавить .rejected обработчики для thunks задач, если нужно отображать ошибки,
        // специфичные для операций с задачами (глобально или для конкретной задачи).
    }
});

export const tasksReducer = tasksSlice.reducer;
export const tasksActions = tasksSlice.actions; // Экспортируем синхронные экшены
export const tasksThunks = { // Экспортируем сгруппированные thunks
    fetchTasks,
    addTask,
    deleteTask,
    updateTask
};