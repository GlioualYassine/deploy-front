import { Dispatch, SetStateAction } from "react"

export type FormCreateAutomobileProps = {
    setOPenModalCreate : Dispatch<SetStateAction<boolean>>
}

export type User = {
    id : number 
    firstName : string
    lastName : string
    email : string 
    role : string
}