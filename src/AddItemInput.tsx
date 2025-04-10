import { Button, Icon, IconButton, TextField } from "@mui/material"
import { useState } from "react"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Add } from "@mui/icons-material";

type AddItemInputProps = {
    addItem: (taskTitle: string) => void
}

function AddItemInput(props: AddItemInputProps) {
    let [newTaskTitle, setNewTaskTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.ctrlKey && e.key === 'Enter') {
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
}

export default AddItemInput