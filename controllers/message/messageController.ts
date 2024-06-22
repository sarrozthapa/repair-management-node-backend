import { Request, Response } from "express";
import Message from "../../models/Message";

const getAllMessages=async(req:Request,res:Response)=>{
    try{
        const messages = await Message.find({}).lean();
        return res.status(200).json({
            success:true,
            messages
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"something went wrong",
            success:false,
        })
    }

}
const messageController={
    getAllMessages
};
export default messageController