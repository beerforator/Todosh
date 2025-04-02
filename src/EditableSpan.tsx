import { useState } from "react"

type EditableSpanPropsType = {
    title: string
    onChange: (newTitle: string) => void
}

function EditableSpan(props: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState<boolean>(false)
    let [newTaskTitle, setNewTaskTitle] = useState("")

    const changeEditMode = () => {
        if (editMode === false) {
            setNewTaskTitle(props.title)
            setEditMode(true)
        } else {
            setEditMode(false)    
            props.onChange(newTaskTitle)
        }
    }

    const onNewTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    if (editMode) {
        return (
            <div onBlur={changeEditMode}>
                <input
                    onChange={onNewTitleChangeHandler}
                    value={newTaskTitle}
                    autoFocus
                />
                <button onClick={() => { }}>accept</button>
            </div>
        )
    } else {
        return (
            <span onDoubleClick={changeEditMode}>{props.title}</span>
        )
    }
}

export default EditableSpan