import express from "express";
import { CreateBlog, DeleteBlog } from "../controllers/BlogControllers.js";
import multer from 'multer';
import { optionalAuth } from "../middlewares/auth.js";

const blogroute = express.Router();

// Multer configuration: To save the image in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Maximum file size allowed is 5MB
    }
});

// Route for creating a blog and uploading an image
blogroute.post('/create', optionalAuth, upload.single('image'), CreateBlog);

// Route for deleting a blog and its image
blogroute.delete('/delete/:id', DeleteBlog);

export default blogroute;