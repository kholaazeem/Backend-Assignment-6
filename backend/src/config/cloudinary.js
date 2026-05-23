import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.CLOUD_NAME,process.env.CLOUD_NAME,process.env.CLOUD_API_SECRET);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadImg = async (file) => {
  try {
    const fileName = `blog-${file.originalname.split(".")[0]}_${Date.now()}`;

    const uploadStr = await new Promise((resolve, reject) => {
      const uploadd = cloudinary.uploader.upload_stream(
        {
          public_id: fileName,
          folder: "blogs",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      uploadd.end(file.buffer);
    });

    return { image: uploadStr.secure_url, public_id: uploadStr.public_id };
  } catch (error) {
    throw error;
  }
};

// Function to delete image
const deleteImg = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image"
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export { uploadImg, deleteImg };