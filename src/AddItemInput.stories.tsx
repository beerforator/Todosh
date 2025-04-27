import AddItemInput from "./AddItemInput";

export default {
    title: 'AddItemInput Component',
    cmponent: AddItemInput
}

export const AddItemInputBaseExample = (props: any) => {
    return <AddItemInput addItem={(title: string)=>{alert(title)}} />
}