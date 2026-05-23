import { deleteImg, uploadImg } from "../config/cloudinary.js";
import Blog from "../models/BlogSchema.js";

const CreateBlog = async (req, res) => {
    try {
        console.log("Body Data:", req.body);
        const { title, content } = req.body;

        if (req.file) {
            const check = await uploadImg(req.file);

            const data1 = { 
                title, 
                content, 
                image: check.image, 
                public_id: check.public_id,
                user: req.user?._id,
                authorName: req.user?.name || "",
                authorProfilePic: req.user?.profilePic || "",
            };
            
            const blog = new Blog(data1);
            const data = await blog.save();
            
            return res.status(201).json({ status: true, message: 'Blog created successfully', data });
        } else {
            return res.status(400).json({ status: false, message: 'Image is required' });
        }

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

const DeleteBlog = async (req, res) => {
    const { id } = req.params;
    try {

        const findd = await Blog.findById(id);
        if (findd == null) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }
        
        const dltImg = await deleteImg(findd.public_id);
        console.log('Cloudinary Delete Result --->', dltImg);

        const blog = await Blog.findByIdAndDelete(id);
        console.log('Database Delete Result --->', blog);
        
        if (blog == null) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }
        
        return res.status(200).json({ status: true, message: 'SUCCESSFULLY DELETED' });

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export { CreateBlog, DeleteBlog };