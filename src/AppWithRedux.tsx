// src/AppWithRedux.tsx
import React, { JSX, useCallback, useEffect, useState } from 'react'; // Добавили useState
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'; // Добавили Link
import './App.css';

// Компоненты и типы UI
import TaskManager, { TaskArr } from './Task-manager';
import AddItemInput from './AddItemInput';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography, CircularProgress, Alert, TextField, Box } from '@mui/material'; // Добавили TextField, Box
import MenuIcon from '@mui/icons-material/Menu';

// Типы и функции Redux
import { AppDispatch, AppRootState } from './state/store';
import { todolistsActions, todolistsThunks, TodolistDomainType, RequestStatusType } from './state/todolistsSlice';
import { tasksThunks, TodolistsObjType as NewTasksStateType, tasksActions } from './state/tasksSlice'; // Используем tasksActions
import { authThunks, loginTC, logoutTC, registerTC } from './state/authSlice'; // Импортируем registerTC

// Тип для фильтра
export type FilterParameterType = 'all' | 'active' | 'completed';

export type TodolistType = {
  id: string
  title: string
  filterParameter: FilterParameterType
}

export type TodolistsObjType = {
  [key: string]: Array<TaskArr>
}

// --- Компоненты-страницы ---

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Локальное состояние для полей и ошибок валидации
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

    // Состояние из Redux
    const authStatus = useSelector<AppRootState, RequestStatusType>(state => state.auth.status);
    const serverError = useSelector<AppRootState, string | null>(state => state.auth.error); // Переименовал для ясности

    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string } = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Простая проверка email
            errors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        }
        // Можно добавить проверку длины пароля, если нужно
        // else if (password.length < 6) {
        //     errors.password = 'Password must be at least 6 characters';
        //     isValid = false;
        // }

        setFormErrors(errors);
        return isValid;
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({}); // Сбрасываем предыдущие ошибки валидации

        if (!validateForm()) {
            return; // Если валидация не прошла, не отправляем запрос
        }

        dispatch(loginTC({ email, password }))
            .unwrap() // Позволяет использовать .then/.catch с thunk
            .then(() => {
                navigate('/todolists'); // Перенаправляем на главную после успешного логина
            })
            .catch((err) => {
                // Серверная ошибка уже должна быть в serverError (устанавливается в authSlice)
                // Если rejectWithValue вернул объект с полем message, то оно будет в err
                console.error("Login thunk rejected:", err);
                // Если нужно установить кастомную ошибку формы на основе ответа
                // if (err && typeof err === 'string' && err.toLowerCase().includes('credentials')) {
                //    setFormErrors({ email: ' ', password: ' ' }); // Просто чтобы подсветить поля
                // }
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign in</Typography>
                {/* Отображаем серверную ошибку, если она есть и статус 'failed' */}
                {authStatus === 'failed' && serverError &&
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{serverError}</Alert>}

                <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address - test@example.com"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!formErrors.email} // Подсвечиваем поле, если есть ошибка
                        helperText={formErrors.email} // Текст ошибки валидации
                        disabled={authStatus === 'loading'}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password - 111111"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        disabled={authStatus === 'loading'}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={authStatus === 'loading'}
                    >
                        {authStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <div>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Typography>
                            </Link>
                        </div>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

const RegisterPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Поле для подтверждения пароля
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

    const authStatus = useSelector<AppRootState, RequestStatusType>(state => state.auth.status);
    const serverError = useSelector<AppRootState, string | null>(state => state.auth.error);

    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string; confirmPassword?: string } = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) { // Валидация длины пароля
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Confirm password is required';
            isValid = false;
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        if (!validateForm()) {
            return;
        }

        dispatch(registerTC({ email, password }))
            .unwrap()
            .then(() => {
                // Можно показать сообщение об успехе, например, через Snackbar или временное состояние
                alert('Registration successful! Please login.'); // Простое уведомление
                navigate('/login'); // Перенаправляем на страницу логина
            })
            .catch((err) => {
                console.error("Registration thunk rejected:", err);
                // Серверная ошибка должна быть в serverError
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign up</Typography>
                {authStatus === 'failed' && serverError &&
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{serverError}</Alert>}

                <Box component="form" onSubmit={handleRegisterSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email-register" // Уникальный id
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        disabled={authStatus === 'loading'}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password-register" // Уникальный name
                        label="Password"
                        type="password"
                        id="password-register" // Уникальный id
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        disabled={authStatus === 'loading'}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                        disabled={authStatus === 'loading'}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={authStatus === 'loading'}
                    >
                        {authStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <div>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2">
                                    Already have an account? Sign in
                                </Typography>
                            </Link>
                        </div>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);
    // Для более надежной проверки можно также проверять наличие токена в localStorage
    // const token = localStorage.getItem('authToken');
    // if (!isLoggedIn && !token) { ... }
    // Но стейт isLoggedIn должен быть авторитетным источником после инициализации приложения

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


// Основной компонент приложения
const AppWithRedux = () => { // Убрал React.memo, т.к. useNavigate может вызвать проблемы с ним
    const dispatch = useDispatch<AppDispatch>();
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);
    const token = useSelector<AppRootState, string | null>(state => state.auth.token); // Получаем токен из стейта
    const authStatus = useSelector<AppRootState, RequestStatusType>(state => state.auth.status); // Для отладки
    const navigate = useNavigate();

    // --- Эффект для инициализации приложения и загрузки данных ---
    useEffect(() => {
        console.log("AppWithRedux useEffect [isLoggedIn, token, dispatch]:", { isLoggedIn, token }); // ОТЛАДКА

        // Пытаемся загрузить данные, если мы считаем себя залогиненными (isLoggedIn === true)
        // ИЛИ если токен есть в localStorage (проверяется в authSlice initialState)
        // и authSlice уже установил isLoggedIn в true.
        if (isLoggedIn) {
            console.log("User is logged in, attempting to fetch data..."); // ОТЛАДКА
            dispatch(todolistsThunks.fetchTodolists())
                .unwrap()
                .then((data) => {
                    console.log('Todolists fetched after app load/login:', data.todolists); // ОТЛАДКА
                    if (data && data.todolists) {
                        data.todolists.forEach(tl => {
                            dispatch(tasksThunks.fetchTasks(tl.id));
                        });
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch initial data (todolists/tasks):", error); // ОТЛАДКА
                    // Если ошибка связана с токеном (например, 401 от бэкенда), разлогинить
                    // 'error' здесь - это значение из rejectWithValue
                    if (typeof error === 'string' && (error.includes('Unauthorized') || error.includes('401'))) {
                        console.log("Token seems invalid/expired, dispatching logout."); // ОТЛАДКА
                        dispatch(authThunks.logoutTC()); // Диспатчим выход
                        // Очистка данных произойдет в extraReducers для logoutTC или в обработчике handleLogout
                    }
                });
        } else {
            console.log("User is NOT logged in, no initial data fetch."); // ОТЛАДКА
            // Если пользователь не залогинен и находится не на /login или /register,
            // PrivateRoute должен его перенаправить.
            // Если мы на /login или /register, ничего делать не нужно.
        }
    // Запускаем при изменении isLoggedIn или dispatch.
    // Добавление token в зависимости может вызвать лишние запуски, если токен меняется часто (например, при refresh tokens).
    // Пока оставим так, чтобы реагировать на восстановление сессии.
    }, [dispatch, isLoggedIn]);


    const handleLogout = () => {
        dispatch(authThunks.logoutTC()).then(() => {
            // Эти диспатчи можно перенести в extraReducers для logoutTC.fulfilled в соответствующих слайсах
            dispatch(todolistsActions.clearTodolistsData());
            dispatch(tasksActions.clearTasksData());
            navigate('/login');
        });
    };


    // --- Компонент для отображения главной страницы с туду-листами ---
    const TodoListsPage = () => {
        const lists = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.lists.todolists);
        const todolistsStatus = useSelector<AppRootState, RequestStatusType>(state => state.lists.status);
        const todolistsError = useSelector<AppRootState, string | null>(state => state.lists.error);
        const tasks = useSelector<AppRootState, NewTasksStateType>(state => state.tasks);

        // useEffect(() => { // <<--- ЭТОТ useEffect БОЛЬШЕ НЕ НУЖЕН ЗДЕСЬ, данные грузятся в AppWithRedux
        //     // ...
        // }, [dispatch, isLoggedIn]); // isLoggedIn здесь тоже не нужен

        // Коллбэки для CRUD операций (остаются здесь или передаются из AppWithRedux)
        const deleteTaskCB = useCallback((listId: string, taskId: string) => { dispatch(tasksThunks.deleteTask({ todolistId: listId, taskId: taskId })); }, [dispatch]);
        const addTaskCB = useCallback((listId: string, title: string) => { dispatch(tasksThunks.addTask({ todolistId: listId, title: title })); }, [dispatch]);
        const changeTaskTitleCB = useCallback((listId: string, taskId: string, title: string) => { dispatch(tasksThunks.updateTask({ todolistId: listId, taskId: taskId, model: { title } })); }, [dispatch]);
        const changeTaskStatusCB = useCallback((listId: string, taskId: string, isDone: boolean) => { dispatch(tasksThunks.updateTask({ todolistId: listId, taskId: taskId, model: { isDone } })); }, [dispatch]);
        const deleteListCB = useCallback((listId: string) => { dispatch(todolistsThunks.deleteTodolist(listId)); }, [dispatch]);
        const addListCB = useCallback((listTitle: string) => { dispatch(todolistsThunks.addTodolist(listTitle)); }, [dispatch]);
        const changeTodolistTitleCB = useCallback((listId: string, title: string) => { dispatch(todolistsThunks.updateTodolistTitle({ id: listId, title })); }, [dispatch]);
        const filterTasksCB = useCallback((listId: string, fparam: FilterParameterType) => { dispatch(todolistsActions.changeTodolistFilter({ id: listId, filter: fparam })); }, [dispatch]);

        // Показываем глобальный лоадер, только если это первая загрузка и списков еще нет
        if (todolistsStatus === 'loading' && lists.length === 0 && !todolistsError) {
            return <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}><CircularProgress /></div>;
        }
        
        // Отображаем ошибку, если загрузка провалилась и списков нет
        if (todolistsStatus === 'failed' && lists.length === 0 && todolistsError) {
            return <Container><Alert severity="error" style={{ margin: '20px 0' }}>Failed to load todolists: {todolistsError}</Alert></Container>;
        }

        // Если списков нет после успешной загрузки (или если не было ошибки)
        if (todolistsStatus === 'succeeded' && lists.length === 0) {
             return (
                <Container fixed>
                    <Grid container style={{ padding: "20px 0" }}>
                        <AddItemInput addItem={addListCB} />
                    </Grid>
                    <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>No todolists yet. Create one!</Typography>
                </Container>
            );
        }

        return (
            <Container fixed>
                <Grid container style={{ padding: "20px 0" }}>
                    <AddItemInput addItem={addListCB}/>
                </Grid>
                {/* Можно убрать глобальную ошибку отсюда, если она уже обработана выше */}
                {/* {todolistsStatus === 'failed' && todolistsError &&
                    <Alert severity="error" style={{ margin: '10px' }}>{todolistsError}</Alert>} */}

                <Grid container spacing={3}>
                    {/* ... map по lists ... */}
                    {lists.map((tl) => {
                        let currentTasks: TaskArr[] = tasks[tl.id] || [];
                        return (
                            <div key={tl.id}>
                                <Paper style={{ padding: "15px" }}>
                                    <TaskManager
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={currentTasks}
                                        deleteTask={deleteTaskCB}
                                        filterTasks={filterTasksCB}
                                        addItem={addTaskCB}
                                        changeTaskStatus={changeTaskStatusCB}
                                        changeTaskTitle={changeTaskTitleCB}
                                        changeTodolistTitle={changeTodolistTitleCB}
                                        filterParameter={tl.filterParameter}
                                        deleteList={deleteListCB}
                                        entityStatus={tl.entityStatus}
                                    />
                                </Paper>
                            </div>
                        );
                    })}
                </Grid>
            </Container>
        );
    }; // Конец TodoListsPage


    // --- Основной рендер AppWithRedux ---
    return (
        <div className='App'>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>TODO List (late)</Typography>
                    {isLoggedIn
                        ? <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        : <Button color="inherit" component={Link} to="/login">Login</Button>
                    }
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/todolists"
                    element={
                        <PrivateRoute>
                            <TodoListsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/todolists" replace /> : <Navigate to="/login" replace />}
                />
                <Route path="*" element={<Navigate to="/" replace />} /> {/* Или на страницу 404 */}
            </Routes>
        </div>
    );
}; // Конец AppWithRedux

export default AppWithRedux;

// Убедись, что TaskArr и FilterParameterType корректно импортированы или определены.
// export type TaskArr = { id: string; title: string; isDone: boolean; };
// export type FilterParameterType = 'all' | 'active' | 'completed';