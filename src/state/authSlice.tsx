// src/state/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../api/auth-api'; // Убедись, что auth-api.ts создан и экспортирует authAPI
import { AppDispatch } from './store';
// Импортируем экшены из других слайсов, если нужно их диспатчить при логауте
// import { todolistsActions } from './todolistsSlice';
// import { tasksActions } from './tasksSlice';

type LoginDataType = Parameters<typeof authAPI.login>[0]; // Тип для данных логина/регистрации

// Тип для успешного ответа при логине (содержит токен)
type LoginResponseType = { token: string };
// Тип для успешного ответа при регистрации (содержит сообщение)
type RegisterResponseType = { message: string };


type AuthState = {
    token: string | null;
    isLoggedIn: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    // Можно добавить поле для сообщения об успешной регистрации, если нужно
    // registrationMessage: string | null;
};

const initialState: AuthState = {
    token: localStorage.getItem('authToken'), // Пытаемся загрузить токен при старте
    isLoggedIn: !!localStorage.getItem('authToken'),
    status: 'idle',
    error: null,
    // registrationMessage: null,
};

// --- Thunk для логина ---
export const loginTC = createAsyncThunk<
    LoginResponseType,      // Что возвращаем при успехе (объект с токеном)
    LoginDataType,          // Что принимаем в аргументах (email, password)
    { rejectValue: string }
>(
    'auth/login',
    async (loginData, thunkAPI) => {
        try {
            const response = await authAPI.login(loginData);
            localStorage.setItem('authToken', response.data.token); // Сохраняем токен
            return response.data; // Возвращаем весь объект { token: "..." }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Thunk для регистрации ---
export const registerTC = createAsyncThunk<
    RegisterResponseType,   // Что возвращаем при успехе (объект с сообщением)
    LoginDataType,          // Что принимаем в аргументах (email, password)
    { rejectValue: string }
>(
    'auth/register',
    async (registerData, thunkAPI) => {
        try {
            const response = await authAPI.register(registerData);
            // Токен при регистрации не получаем, только сообщение об успехе
            return response.data; // Возвращаем { message: "..." }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// --- Thunk для выхода (logout) ---
export const logoutTC = createAsyncThunk<
    void, // Ничего не возвращаем при успехе
    void, // Ничего не принимаем в аргументах
    { dispatch: AppDispatch } // Чтобы можно было диспатчить другие экшены
>(
    'auth/logout',
    async (_, { dispatch }) => {
        localStorage.removeItem('authToken');
        // Диспатчим экшены для очистки других частей стейта
        // Убедись, что эти экшены существуют и правильно импортированы
        // dispatch(todolistsActions.clearTodolistsData());
        // dispatch(tasksActions.clearTasksData());
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Можно добавить синхронный экшен для установки isLoggedIn, если нужен
        // setLoggedIn(state, action: PayloadAction<boolean>) {
        //     state.isLoggedIn = action.payload;
        //     if (!action.payload) {
        //         state.token = null;
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder
            // Login Thunk
            .addCase(loginTC.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginTC.fulfilled, (state, action: PayloadAction<LoginResponseType>) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.error = null; // Сбрасываем ошибку при успехе
            })
            .addCase(loginTC.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown login error';
                state.isLoggedIn = false;
                state.token = null;
            })

            // Register Thunk
            .addCase(registerTC.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                // state.registrationMessage = null;
            })
            .addCase(registerTC.fulfilled, (state, action: PayloadAction<RegisterResponseType>) => {
                state.status = 'succeeded'; // Или 'idle', т.к. регистрация не логинит сразу
                // state.registrationMessage = action.payload.message;
                state.error = null;
                // Не меняем isLoggedIn и token, т.к. регистрация не означает автоматический вход
            })
            .addCase(registerTC.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown registration error';
                // state.registrationMessage = null;
            })

            // Logout Thunk
            .addCase(logoutTC.fulfilled, (state) => {
                state.token = null;
                state.isLoggedIn = false;
                state.status = 'idle';
                state.error = null;
                // state.registrationMessage = null;
            });
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const authThunks = { loginTC, registerTC, logoutTC };