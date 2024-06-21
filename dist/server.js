"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketIDs = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConn_1 = require("./helper/dbConn");
const helper_1 = require("./helper/helper");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config({
    path: './.env',
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
exports.userSocketIDs = new Map();
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
const io = new socket_io_1.Server(server, Object.assign({ cookie: true }, corsOptions));
/*io.use(async(socket:any,next)=>{
    console.log(socket);
     const socketAuthenticator=async(err:any,socket:any,next:any)=>{
        try{
            if(err) return next(err);
            const authToken=socket.request.cookies.token;
            console.log(authToken);
            console.log(socket.request);
            const decodedData=jwt.verify(authToken,process.env.TOKEN_SECRET);
            socket.user=await User.findById(decodedData.id)
            return next();
        }catch(error)
        {
            console.log(error);
        }
    }
    cookieParser()(socket.request,socket.request.res,
        async(err)=>await socketAuthenticator(err,socket,next)
    );
})*/
io.on('connection', (socket) => {
    console.log('connected', socket.id);
    //userSocketIDs.set(socket.user.id,socket.id);
    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
        console.log('/n');
    });
    socket.on('ASSIGN_TASK', (task) => {
        io.to((0, helper_1.getSockets)([task._id])).emit('ASSIGN_TASK');
    });
});
app.get('/', (req, res) => {
    return res.send("hello");
});
(0, dbConn_1.dbConn)(process.env.MONGODB_URI).then(() => {
    console.log('connected to database');
    server.listen(process.env.PORT, () => {
        console.log(`server listening to port ${process.env.PORT}`);
    });
}).catch((error) => console.log(error));
