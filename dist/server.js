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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./models/User"));
const helper_1 = require("./helper/helper");
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
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const socketAuthenticator = (err, socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err)
                return next(err);
            const authToken = socket.request.cookies.token;
            console.log('authToken', authToken);
            const decodedData = jsonwebtoken_1.default.verify(authToken, process.env.TOKEN_SECRET);
            socket.user = yield User_1.default.findById(decodedData.id);
            return next();
        }
        catch (error) {
            console.log(error);
        }
    });
    (0, cookie_parser_1.default)()(socket.request, socket.request.res, (err) => __awaiter(void 0, void 0, void 0, function* () { return yield socketAuthenticator(err, socket, next); }));
}));
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
    socket.on('ASSIGN_TASK', (task) => {
        io.to((0, helper_1.getSockets)([task._id])).emit('REFETCH_MYTASKS');
    });
    socket.on('TASK_DELETED', ({ _id }) => {
        io.to((0, helper_1.getSockets)([_id])).emit('REFETCH_MYTASKS');
    });
    socket.on('STATUS_CHANGED', ({ _id }) => {
        io.to((0, helper_1.getSockets)([_id])).emit('REFETCH_MYTASKS');
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
