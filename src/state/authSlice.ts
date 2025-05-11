// src/state/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../api/auth-api'; // Предполагается, что auth-api.ts создан
import { AppDispatch } from './store'; // Импортируем AppDispatch

type LoginDataType = Parameters<typeof authAPI.login>[0]; // Получаем тип для данных логина

type AuthState = {
    token: string | null;
    isLoggedIn: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

const initialState: AuthState = {
    token: localStorage.getItem('authToken'), // Пытаемся загрузить токен при старте
    isLoggedIn: !!localStorage.getItem('authToken'),
    status: 'idle',
    error: null,
};

// Thunk для логина
export const loginTC = createAsyncThunk<
    { token: string }, // Что возвращаем при успехе
    LoginDataType,       // Что принимаем в аргументах
    { rejectValue: string }
>(
    'auth/login',
    async (loginData, thunkAPI) => {
        try {
            const response = await authAPI.login(loginData);
            localStorage.setItem('authToken', response.data.token); // Сохраняем токен
            return { token: response.data.token };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Thunk для выхода (просто очищаем токен)
export const logoutTC = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
    'auth/logout',
    async (_, { dispatch }) => {
        localStorage.removeItem('authToken');
        // Здесь можно диспатчить экшены для очистки других стейтов (например, todolists, tasks)
        // dispatch(todolistsActions.clearTodolistsData());
        // dispatch(tasksActions.clearTasksData()); // Когда будет tasksSlice
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Можно добавить синхронный logout, если не нужен thunk
        // logout(state) {
        //     localStorage.removeItem('authToken');
        //     state.token = null;
        //     state.isLoggedIn = false;
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginTC.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginTC.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.isLoggedIn = true;
            })
            .addCase(loginTC.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown login error';
                state.isLoggedIn = false;
                state.token = null;
            })
            .addCase(logoutTC.fulfilled, (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.status = 'idle';
            });
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions; // Если будут синхронные
export const authThunks = { loginTC, logoutTC };