import React, { useCallback, useState } from "react"

import { IconButton, TextField } from "@mui/material"
import { Add } from "@mui/icons-material";

type AddItemInputProps = {
    addItem: (taskTitle: string) => void
}

const AddItemInput = React.memo((props: AddItemInputProps) => {
    console.log("Input call")

    let [newTaskTitle, setNewTaskTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        
        if (e.key === 'Enter') {
            if (newTaskTitle.trim() === "") {
                setError("Поле обязательно!")
                setNewTaskTitle("")
                return
            }
            props.addItem(newTaskTitle)
            setNewTaskTitle("")
        }
    }

    const onClickAddTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (newTaskTitle.trim() === "") {
            setError("Поле обязательно!")
            setNewTaskTitle("")
            return
        }
        
        props.addItem(newTaskTitle.trim())
        setNewTaskTitle("")
    }

    return (
        <div>
            <TextField variant="outlined" label="Enter title" size="small"
                value={newTaskTitle}
                onChange={onNewTitleChangeHandler}
                onKeyDown={onKeyDownHandler}
                error={!!error}
                helperText={error}
            />
            <IconButton onClick={onClickAddTask} >
                <Add />
            </IconButton>
        </div>
    )
})

export default AddItemInput