import mongoose from "mongoose";

export const dbConn=async (uri:string)=>{
        return mongoose.connect(uri);
}