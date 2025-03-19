import mongoose from "mongoose";
import Blog from "../models/Blog.js";

// Create Blog
export const createBlog = async (req, res) => {
  try {
    // Validate required fields
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({
        message: "All fields (title, content, author) are required"
      });
    }

    // Verify if author is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        message: "Invalid author ID"
      });
    }

    const blog = new Blog({
      title,
      content,
      author
    });

    const savedBlog = await blog.save();
    
    // Populate author details in the response
    const populatedBlog = await savedBlog.populate("author", "name email");
    
    res.status(201).json({
      success: true,
      data: populatedBlog,
      message: "Blog created successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

// Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

// Update Blog by ID
export const updateBlogById = async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    // Check if at least one field is provided for update
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided"
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
      message: "Blog updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};