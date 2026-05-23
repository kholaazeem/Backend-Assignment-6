import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [4, "minimum 4 characters required"]
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    public_id: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    authorName: {
        type: String,
        default: "",
    },
    authorProfilePic: {
        type: String,
        default: "",
    }
}, {
    timestamps: true
});

const Blog = mongoose.model('blog', BlogSchema);
export default Blog;