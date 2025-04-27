import React, { useCallback } from "react";

import { TaskArr } from "./Task-manager"
import EditableSpan from "./EditableSpan"
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, IconButton } from "@mui/material"

type TaskLineType = {
    task: TaskArr
    id_list: string
    deleteTask: (tlId: string, taskId: string) => void
    changeTaskStatus: (tlId: string, taskId: string, isDone: boolean) => void
    changeTaskTitle: (tlId: string, taskId: string, title: string) => void
}

const TaskLine = React.memo((props: TaskLineType) => {
    const onClickDeleteTaskHandler = () => props.deleteTask(props.id_list, props.task.id)
    const onChangeTaskStatusHandler = (e: React.ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(props.id_list, props.task.id, e.currentTarget.checked)
    const onChangeTaskTitleHandler = useCallback((title: string) => props.changeTaskTitle(props.id_list, props.task.id, title), [props.changeTaskTitle, props.id_list, props.task.id])
   
    return (
        <li key={props.task.id} className={props.task.isDone ? "doned_task" : ""}>
            <Checkbox
                checked={props.task.isDone}
                onChange={onChangeTaskStatusHandler}
            />
            <EditableSpan
                title={props.task.title}
                onChange={onChangeTaskTitleHandler}
            />
            <IconButton aria-label="delete" onClick={onClickDeleteTaskHandler} size="small">
                <DeleteIcon color="secondary" fontSize='small' />
            </IconButton>
        </li>
    )
})

export default TaskLine