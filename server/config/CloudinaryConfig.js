import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";

cloudinary.config({
	cloud_name: "dsw2tkyc8",
	api_key: "286732764749223",
	api_secret: "ioSws4rjG4zMU3WKP5RUGREPeAc"
});

const cloudinaryUploader = async function uploadToCloudinary(localFilePath) {
	const mainFolderName = "RealTimeChatApp";

	const filePathOnCloudinary = mainFolderName + "/" + localFilePath;

	return cloudinary.uploader
		.upload(localFilePath, { public_id: filePathOnCloudinary })
		.then((result) => {
			fs.unlinkSync(localFilePath);

			return {
				message: "Success",
				url: result.url,
			};
		})
		.catch((error) => {
			// console.log("I am in cloudinary")
			fs.unlinkSync(localFilePath);
			console.log(error)
			return { message: "Fail" };
		});
};

export default cloudinaryUploader;