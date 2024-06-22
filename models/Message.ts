import mongoose, { mongo } from "mongoose";

const messageSchema=new mongoose.Schema({
    sender:{
        username:{
            type:String,
            required:true,
        },
        _id:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            required:true,
        }
     },
    createdAt:{
        type:Date,
    },
    content:{
        type:String,
        required:true,
    }
})

const Message=mongoose.models.Message||mongoose.model('Message',messageSchema);
export default Message;