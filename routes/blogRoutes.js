import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlogById } from "../controller/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",authMiddleware, createBlog);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id",authMiddleware,updateBlogById);
router.delete("/:id",authMiddleware, deleteBlog);


export default router;
