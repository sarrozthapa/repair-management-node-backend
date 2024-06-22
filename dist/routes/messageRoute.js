"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../controllers/message/messageController"));
const router = express_1.default.Router();
router.route('/getallmessages').get(messageController_1.default.getAllMessages);
exports.default = router;
