"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSockets = void 0;
const server_1 = require("../server");
const getSockets = (users = []) => {
    return users.map((user) => server_1.userSocketIDs.get(user.toString()));
};
exports.getSockets = getSockets;
