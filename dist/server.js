"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocketIDs = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConn_1 = require("./helper/dbConn");
const helper_1 = require("./helper/helper");
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
const Message_1 = __importDefault(require("./models/Message"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config({
    path: './.env',
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
exports.userSocketIDs = new Map();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5174",
        "https://repair-shop-management-app.vercel.app"
    ],
    credentials: true,
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            'https://repair-shop-management-app.vercel.app'
        ],
        credentials: true,
    }
});
// io.use(async(socket:any,next)=>{
//      const socketAuthenticator=async(err:any,socket:any,next:any)=>{
//         try{
//             if(err) return next(err);
//             const authToken=socket.request.cookies.token;
//             console.log('authToken',authToken);
//             const decodedData:any=jwt.verify(authToken,process.env.TOKEN_SECRET!);
//             socket.user=await User.findById(decodedData.id)
//             return next();
//         }catch(error)
//         {
//             console.log(error);
//         }
//     }
//     cookieParser()(socket.request,socket.request.res,
//         async(err)=>await socketAuthenticator(err,socket,next)
//     );
// })
io.on('connection', (socket) => {
    console.log('connected', socket.id);
    socket.on('LOGGED_IN', ({ _id }) => {
        socket.user = _id;
        exports.userSocketIDs.set(socket.user, socket.id);
    });
    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
        exports.userSocketIDs.delete(socket.user);
        console.log('/n');
    });
    socket.on('ASSIGN_TASK', ({ _id, customer }) => {
        console.log(_id, customer);
        io.to((0, helper_1.getSockets)([_id, customer])).emit('REFETCH_MYTASKS');
    });
    socket.on('TASK_DELETED', ({ _id, customer }) => {
        io.to((0, helper_1.getSockets)([_id, customer])).emit('REFETCH_MYTASKS');
    });
    socket.on('STATUS_CHANGED', ({ _id, customer }) => {
        console.log('check');
        io.to((0, helper_1.getSockets)([_id, customer])).emit('REFETCH_MYTASKS');
    });
    socket.on('NEW_MESSAGE', (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, content }) {
        console.log(sender);
        const messageForRealTime = {
            content,
            sender: {
                _id: sender._id.toString(),
                username: sender.username
            },
            createdAt: new Date().toISOString()
        };
        const messageForDB = {
            content,
            sender: {
                _id: sender._id.toString(),
                username: sender.username
            },
            createdAt: new Date().toISOString()
        };
        yield Message_1.default.create(messageForDB);
        io.sockets.emit('NEW_MESSAGE', messageForRealTime);
        console.log('message sent');
    }));
});
app.get('/', (req, res) => {
    return res.send("hello");
});
app.use('/api/messages', messageRoute_1.default);
(0, dbConn_1.dbConn)(process.env.MONGODB_URI).then(() => {
    console.log('connected to database');
    server.listen(process.env.PORT, () => {
        console.log(`server listening to port ${process.env.PORT}`);
    });
}).catch((error) => console.log(error));
