// src/state/todolistsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { todolistsAPI, ApiTodolistType } from '../api/todolists-api'; // Импортируем API и тип
import { AppDispatch, AppRootState } from './store'; // Типы для thunk

// Создаем AsyncThunk
// 1-й аргумент: префикс типа экшена (будут сгенерированы: 'todolists/fetchTodolists/pending', 'todolists/fetchTodolists/fulfilled', 'todolists/fetchTodolists/rejected')
// 2-й аргумент: async функция (payload creator), которая выполняет запрос и ВОЗВРАЩАЕТ ДАННЫЕ (или ошибку)

// TODO: Добавить другие thunks: addTodolist, deleteTodolist, updateTodolistTitle
// TODO: Создать createSlice ниже

// --- Определение типа для состояния этого slice ---
// Добавим статус загрузки и поле для ошибки
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

// Расширим тип тудулиста для UI (добавим filter и status)
export type TodolistDomainType = ApiTodolistType & {
    filterParameter: FilterParameterType; // Возьми тип FilterParameterType из AppWithRedux
    entityStatus: RequestStatusType; // Статус для операций с конкретным тудулистом (удаление, изменение)
};

// Тип всего состояния slice'а
type InitialStateType = {
    todolists: Array<TodolistDomainType>;
    status: RequestStatusType; // Общий статус для всего списка (загрузка)
    error: string | null;      // Сообщение об ошибке
};

// --- Типы для Payload ---
type ChangeListTitlePayload = { id: string; title: string }; // УКАЖИ ПРАВИЛЬНЫЙ ТИП ID
type ChangeListFilterPayload = { id: string; filter: FilterParameterType }; // УКАЖИ ПРАВИЛЬНЫЙ ТИП ID
type ChangeListEntityStatusPayload = { id: string; status: RequestStatusType }; // УКАЖИ ПРАВИЛЬНЫЙ ТИП ID

// --- Thunk для загрузки ---
export const fetchTodolists = createAsyncThunk<
    { todolists: Array<ApiTodolistType> },
    undefined,
    { rejectValue: string }
>(
    'todolists/fetchTodolists',
    async (_, thunkAPI) => {
        try {
            const res = await todolistsAPI.getTodolists();
            return { todolists: res.data };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch todolists';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// --- Начальное состояние Slice ---
const initialState: InitialStateType = {
    todolists: [], // Начинаем с пустого массива
    status: 'idle',
    error: null
};

// --- Создание Slice ---


// src/state/todolistsSlice.ts
// ... (импорты createSlice, PayloadAction, createAsyncThunk, API, типы ... )
// ... (существующий fetchTodolists thunk) ...

// --- Thunk для СОЗДАНИЯ туду-листа ---
export const addTodolist = createAsyncThunk<
    // Тип возвращаемого значения при успехе (созданный тудулист)
    { todolist: ApiTodolistType },
    // Тип аргумента, который передается в thunk (title)
    string,
    // Типы для thunkAPI
    { rejectValue: string }
>(
    'todolists/addTodolist',
    async (title, thunkAPI) => {
        try {
            // Вызываем API запрос для создания тудулиста
            const res = await todolistsAPI.createTodolist(title);
            // Возвращаем созданный тудулист (res.data содержит его)
            return { todolist: res.data };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to add todolist';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Thunk для УДАЛЕНИЯ туду-листа ---
export const deleteTodolist = createAsyncThunk<
    // Тип возвращаемого значения при успехе (ID удаленного тудулиста)
    // Нам нужен ID, чтобы удалить его из стейта
    { todolistId: string }, // ИСПОЛЬЗУЙ number ЕСЛИ ID ЧИСЛО
    // Тип аргумента, который передается в thunk (ID тудулиста для удаления)
    string, // ИСПОЛЬЗУЙ number ЕСЛИ ID ЧИСЛО
    // Типы для thunkAPI
    { rejectValue: string }
>(
    'todolists/deleteTodolist',
    async (todolistId, thunkAPI) => {
        // Перед запросом можно диспатчить экшен для изменения entityStatus на 'loading'
        thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: 'loading' }));
        try {
            // Вызываем API запрос для удаления тудулиста
            await todolistsAPI.deleteTodolist(todolistId);
            // Возвращаем ID удаленного тудулиста для fulfilled экшена
            return { todolistId: todolistId };
        } catch (error: any) {
            // При ошибке можно сбросить entityStatus на 'failed' или 'idle'
            thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: 'failed' }));
            const message = error.response?.data?.message || error.message || 'Failed to delete todolist';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Тип аргумента для thunk обновления
type UpdateTodolistTitleArgType = {
    id: string; // ИСПОЛЬЗУЙ number ЕСЛИ ID ЧИСЛО
    title: string;
};

// --- Thunk для ОБНОВЛЕНИЯ ЗАГОЛОВКА туду-листа ---
export const updateTodolistTitle = createAsyncThunk<
    // Тип возвращаемого значения при успехе (обновленный тудулист)
    { todolist: ApiTodolistType },
    // Тип аргумента, который передается в thunk
    UpdateTodolistTitleArgType,
    // Типы для thunkAPI
    { rejectValue: string }
>(
    'todolists/updateTodolistTitle',
    async (arg, thunkAPI) => {
        thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: 'loading' }));
        try {
            // Вызываем API запрос для обновления
            const res = await todolistsAPI.updateTodolistTitle(arg.id, arg.title);
            // Возвращаем обновленный тудулист
            return { todolist: res.data };
        } catch (error: any) {
            thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, status: 'failed' }));
            const message = error.response?.data?.message || error.message || 'Failed to update todolist title';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Создание Slice (секция extraReducers дополнена) ---
const todolistsSlice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        // ... (существующие синхронные редьюсеры: changeTodolistFilter, changeTodolistEntityStatus, clearTodolistsData) ...
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterParameterType }>) { // Обновил ID на string
            const list = state.todolists.find(tl => tl.id === action.payload.id);
            if (list) {
                list.filterParameter = action.payload.filter;
            }
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) { // Обновил ID на string
            const list = state.todolists.find(tl => tl.id === action.payload.id);
            if (list) {
                list.entityStatus = action.payload.status;
            }
        },
        clearTodolistsData(state) {
            state.todolists = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Обработка fetchTodolists
            .addCase(fetchTodolists.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.todolists = action.payload.todolists.map(tl => ({
                    ...tl,
                    filterParameter: 'all',
                    entityStatus: 'idle'
                }));
            })
            .addCase(fetchTodolists.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown error occurred fetching todolists';
            })

            // Обработка addTodolist
            .addCase(addTodolist.pending, (state) => {
                // Можно установить глобальный статус 'loading', если это нужно для UI
                // state.status = 'loading'; // Или ничего не делать, если есть индикатор на кнопке
                state.error = null;
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                // state.status = 'succeeded'; // Если меняли глобальный статус
                // Добавляем новый тудулист в начало массива
                const newTodolist: TodolistDomainType = {
                    ...action.payload.todolist,
                    filterParameter: 'all',
                    entityStatus: 'idle'
                };
                state.todolists.unshift(newTodolist);
            })
            .addCase(addTodolist.rejected, (state, action) => {
                // state.status = 'failed'; // Если меняли глобальный статус
                state.error = action.payload ?? 'Unknown error occurred adding todolist';
                // Можно также сохранить ошибку для конкретного UI элемента, если нужно
            })

            // Обработка deleteTodolist
            .addCase(deleteTodolist.fulfilled, (state, action) => {
                // Удаляем тудулист из массива по ID
                const index = state.todolists.findIndex(tl => tl.id === action.payload.todolistId);
                if (index > -1) {
                    state.todolists.splice(index, 1);
                }
                // Можно сбросить глобальную ошибку, если она была установлена
                state.error = null;
            })
            .addCase(deleteTodolist.rejected, (state, action) => {
                // Здесь entityStatus для конкретного тудулиста уже должен быть 'failed'
                // из самого thunk. Можно установить глобальную ошибку, если нужно.
                state.error = action.payload ?? 'Unknown error occurred deleting todolist';
            })
            // .addCase(deleteTodolist.pending) - entityStatus обрабатывается в thunk


            // Обработка updateTodolistTitle
            .addCase(updateTodolistTitle.fulfilled, (state, action) => {
                const updatedTodolist = action.payload.todolist;
                const index = state.todolists.findIndex(tl => tl.id === updatedTodolist.id);
                if (index > -1) {
                    // Заменяем старый тудулист на обновленный, сохраняя filterParameter
                    state.todolists[index] = {
                        ...updatedTodolist,
                        filterParameter: state.todolists[index].filterParameter, // Сохраняем старый фильтр
                        entityStatus: 'idle' // Сбрасываем статус после успешного обновления
                    };
                }
                state.error = null;
            })
            .addCase(updateTodolistTitle.rejected, (state, action) => {
                // entityStatus для конкретного тудулиста уже должен быть 'failed'
                state.error = action.payload ?? 'Unknown error occurred updating todolist title';
            });
        // .addCase(updateTodolistTitle.pending) - entityStatus обрабатывается в thunk
    }
});

// Экспортируем редьюсер и экшены
export const todolistsReducer = todolistsSlice.reducer;
export const todolistsActions = todolistsSlice.actions;
// Экспортируем thunks
export const todolistsThunks = {
    fetchTodolists,
    addTodolist,
    deleteTodolist,
    updateTodolistTitle
};


// Экспортируем редьюсер и экшены

// Экспортируем thunk


// Импортируй FilterParameterType из AppWithRedux или определи здесь
type FilterParameterType = 'all' | 'active' | 'completed';