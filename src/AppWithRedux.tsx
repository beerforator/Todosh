import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';

import { authThunks, loginTC, logoutTC } from './state/authSlice'; // Импортируем thunk

import { tasksThunks, TodolistsObjType as NewTasksStateType, tasksActions } from './state/tasksSlice'; // Используем новый тип и thunks


import './App.css';
import TaskManager, { TaskArr } from './Task-manager'
import AddItemInput from './AddItemInput';
import { addTodolistAC, changeTodolistFiltereAC, changeTodolistTitleAC, deleteTodolistAC } from './state/todoLists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC} from './state/todoTask-reducer';
import { AppDispatch, AppRootState } from './state/store';

import { Alert, AppBar, Button, CircularProgress, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { RequestStatusType, TodolistDomainType, todolistsActions, todolistsThunks } from './state/todolistsSlice';

export type FilterParameterType = 'all' | 'active' | 'completed'

export type TodolistType = {
  id: string
  title: string
  filterParameter: FilterParameterType
}

export type TodolistsObjType = {
  [key: string]: Array<TaskArr>
}

// Тип для фильтра (можно вынести в types.ts)



// Основной компонент приложения
const AppWithRedux = React.memo(() => {
    console.log("App call ###############################");

    

    // Хуки Redux
    const dispatch = useDispatch<AppDispatch>();
    const lists = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.lists.todolists);
    const todolistsStatus = useSelector<AppRootState, RequestStatusType>(state => state.lists.status);
    const todolistsError = useSelector<AppRootState, string | null>(state => state.lists.error); // Получаем ошибку

    // --- Эффект для загрузки данных ---
    useEffect(() => {
        // TODO: Добавить проверку, залогинен ли пользователь
        dispatch(todolistsThunks.fetchTodolists());
        // TODO: Диспатчить загрузку задач, когда будет tasksThunk
    }, [dispatch]);
    
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);

    const handleLogin = () => {
        // Используй реальные данные для логина (сначала зарегистрируйся через API, если нужно)
        dispatch(loginTC({ email: 'test@example.com', password: 'password123' }));
    };

    const handleLogout = () => {
        dispatch(authThunks.logoutTC());
        dispatch(todolistsActions.clearTodolistsData());
        dispatch(tasksActions.clearTasksData()); // <-- Очищаем задачи
    };

    useEffect(() => {
        // Загружаем тудулисты только если залогинены
        if (isLoggedIn) {
            dispatch(todolistsThunks.fetchTodolists());
        }
    }, [dispatch, isLoggedIn]); // Добавили isLoggedIn в зависимости

    // --- Коллбэки для задач (ИСПОЛЬЗУЮТ СТАРЫЕ AC, ПРИНИМАЮТ ID В СООТВЕТСТВИИ С КОМПОНЕНТАМИ) ---
    // Принимаем listId как number (из TaskManager), taskId как string (из TaskLine)
    // Приводим listId к string ПЕРЕД вызовом старого AC
    const tasks = useSelector<AppRootState, TodolistsObjType>(state => state.tasks); // Используем новый тип

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(todolistsThunks.fetchTodolists())
                .unwrap() // unwrap позволяет получить результат thunk (или ошибку)
                .then((data) => {
                    // После успешной загрузки туду-листов, загружаем задачи для каждого
                    data.todolists.forEach(tl => {
                        dispatch(tasksThunks.fetchTasks(tl.id));
                    });
                })
                .catch(error => {
                    console.error("Failed to fetch todolists or initial tasks:", error);
                });
        }
    }, [dispatch, isLoggedIn]);

    // --- Коллбэки для задач (ИСПОЛЬЗУЮТ НОВЫЕ THUNKS) ---
    const deleteTask = useCallback((listId: string, taskId: string) => {
        dispatch(tasksThunks.deleteTask({ todolistId: listId, taskId: taskId }));
    }, [dispatch]);

    const addTask = useCallback((listId: string, title: string) => {
        dispatch(tasksThunks.addTask({ todolistId: listId, title: title }));
    }, [dispatch]);

    const changeTaskTitle = useCallback((listId: string, taskId: string, title: string) => {
        dispatch(tasksThunks.updateTask({ todolistId: listId, taskId: taskId, model: { title } }));
    }, [dispatch]);

    const changeTaskStatus = useCallback((listId: string, taskId: string, isDone: boolean) => {
        dispatch(tasksThunks.updateTask({ todolistId: listId, taskId: taskId, model: { isDone } }));
    }, [dispatch]);


    // --- Коллбэки для туду-листов (ТЕПЕРЬ С THUNKS) ---
    const deleteList = useCallback((listId: string) => { // ID теперь string
        dispatch(todolistsThunks.deleteTodolist(listId));
    }, [dispatch]);

    const addList = useCallback((listTitle: string) => {
        dispatch(todolistsThunks.addTodolist(listTitle));
    }, [dispatch]);

    const changeTodolistTitle = useCallback((listId: string, title: string) => { // ID теперь string
        dispatch(todolistsThunks.updateTodolistTitle({id: listId, title}));
    }, [dispatch]);

    // Коллбэк для изменения фильтра (использует синхронный экшен из slice, ожидает number)
    const filterTasks = useCallback((listId: string, fparam: FilterParameterType) => {
        dispatch(todolistsActions.changeTodolistFilter({ id: listId, filter: fparam }));
    }, [dispatch]);
    // ---------------------------------------------

    // --- Отображение состояния загрузки/ошибки ---
    if (todolistsStatus === 'loading') {
        return (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <CircularProgress />
            </div>
        );
    }

    // --- Основной рендер компонента ---
    return (
        <div className='App'>
            {/* AppBar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        TODO List (RTK ver.)
                    </Typography>
                    НЕ РАБОТАЮТ ТАСКИ
                    {/* TODO: Добавить кнопку Logout и обработчик */}
                    {isLoggedIn
                        ? <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        : <Button color="inherit" onClick={handleLogin}>Login (Test)</Button>
                    }
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {/* Глобальное сообщение об ошибке */}
                {todolistsStatus === 'failed' && <Alert severity="error" style={{ margin: '10px' }}>{todolistsError || 'An error occurred'}</Alert>}
            </AppBar>

            {/* Контент */}
            <Container fixed>
                {/* Форма добавления туду-листа */}
                <Grid container style={{ padding: "20px 0" }}> {/* Уменьшил padding */}
                    <AddItemInput
                        addItem={addList} // TODO: Обновить addList на рабочий thunk
                        //disabled={todolistsStatus === 'loading'} // Блокируем во время загрузки
                    />
                </Grid>

                {/* Список туду-листов */}
                <Grid container spacing={3}>
                    {lists.map((tl) => {
                        // Получаем задачи для текущего туду-листа из старого объекта tasks
                        // Ключ объекта tasks - строка (старый tid), ID тудулиста tl.id - число.
                        // Это НЕ будет работать без адаптации!
                        // ВРЕМЕННОЕ РЕШЕНИЕ: Ищем задачи по tl.title или другому признаку, если возможно,
                        // или просто передаем пустой массив, пока tasks не переписан.
                        // САМЫЙ ПРОСТОЙ ВРЕМЕННЫЙ ВАРИАНТ - ПУСТОЙ МАССИВ:
                        let currentTasks: TaskArr[] = tasks[tl.id] || []; // Пытаемся использовать ID как строку (если ключи в tasks совпадают)
                        return (
                            <Grid key={tl.id} >
                                <Paper style={{ padding: "15px", minWidth: "270px" }}>
                                    <TaskManager
                                        id={tl.id} // Передаем ID (number)
                                        title={tl.title}
                                        tasks={currentTasks} // ВРЕМЕННО - может быть пустым или неправильным
                                        deleteTask={deleteTask}
                                        filterTasks={filterTasks}
                                        addItem={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                        filterParameter={tl.filterParameter}
                                        deleteList={deleteList}
                                        entityStatus={tl.entityStatus}
                                    />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </div>
    );
});

export default AppWithRedux;