"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: {
        username: {
            type: String,
            required: true,
        },
        _id: {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    createdAt: {
        type: Date,
    },
    content: {
        type: String,
        required: true,
    }
});
const Message = mongoose_1.default.models.Message || mongoose_1.default.model('Message', messageSchema);
exports.default = Message;
