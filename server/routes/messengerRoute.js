import express from "express";

const router = express.Router()

import {getFriends,messageUploadDB,messageGet,ImageMessageSend,messageSeen,delivaredMessage} from "../controller/messengerController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";


router.get('/get-friends',authMiddleware, getFriends);
router.post('/send-message',authMiddleware, messageUploadDB);
router.get('/get-message/:id',authMiddleware, messageGet);
router.post('/image-message-send',authMiddleware, ImageMessageSend);

router.post('/seen-message',authMiddleware, messageSeen);
router.post('/delivared-message',authMiddleware, delivaredMessage);
 

export default router;