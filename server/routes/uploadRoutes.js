import cloudinaryUploader from "../config/CloudinaryConfig.js"
import upload from "../helpers/multer.js";
import express from "express";

const router = express.Router();


router.route("/").patch(upload.single("logo"), async (req, res) => {
	console.log("upload routes")
	const localFilePath = req.file.path;
	console.log(localFilePath)
	const result = await cloudinaryUploader(localFilePath);
	console.log(result);
	res.send(result.url);
});

export default router;