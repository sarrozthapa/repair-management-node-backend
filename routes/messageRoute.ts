import express from 'express';
import messageController from '../controllers/message/messageController';
const router =express.Router();

router.route('/getallmessages').get(messageController.getAllMessages);

export default router;