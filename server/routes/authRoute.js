import express from "express";

const router = express.Router()

import { userRegister, userLogin, userLogout } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



router.post('/user-login',userLogin);
router.post('/user-register',userRegister);
router.post('/user-logout',authMiddleware,userLogout);

export default router;