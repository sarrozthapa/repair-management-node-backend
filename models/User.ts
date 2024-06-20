import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide a username"],
        unique:true,
    },
    name:{
        type:String,
        required:[true,"Please provide a name"],
    },
    gender:{
        type:String,
        enum:['male','female','guest'],
        required:[true,"Please provide a gender"],
    },
    email:{
        type:String,
        required:[true,"Please Provide a email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
})

const User = mongoose.models.User||mongoose.model("User",userSchema);
export default User;