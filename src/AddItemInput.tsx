import { useState } from "react"

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
            <input
                value={newTaskTitle}
                onChange={onNewTitleChangeHandler}
                onKeyDown={onKeyDownHandler}
                className={error ? "error_input" : ""}
            />
            <button onClick={onClickAddTask}>+</button>
            {error && <div className="error_message">{error}</div>}
        </div>
    )
}

export default AddItemInput