import { userSocketIDs } from "../server"

export const getSockets=(users:string[]=[])=>{
    return users.map((user)=>userSocketIDs.get(user.toString()))
}