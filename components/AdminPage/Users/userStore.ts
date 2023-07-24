import { create } from "zustand";

interface User{
    id:string;
    name:string;
    email:string;
    userType:string;
    active:Boolean;
    userName:string
}

export interface userState{
    usersList:Array<User>;
    updateUser:(user:User)=>void;
    deleteUserById:(id:string) => void,
}

const userStore = create<userState>((set)=>({
    usersList:[],
    updateUser:(user:User)=>
    set((state)=>{
        return{usersList:state.usersList}
    }),
    deleteUserById:(id:string)=>
    set((state)=>{
        return {usersList:state.usersList}
    })
}))


export default userStore