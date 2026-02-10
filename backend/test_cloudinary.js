import dotenv from 'dotenv';
import connectCloudinary from './config/cloudinary.js';

dotenv.config();

console.log("Testing Cloudinary Connection...");
try {
    await connectCloudinary();
    console.log("Cloudinary Configured Successfully");
} catch (error) {
    console.error("Cloudinary Error:", error);
    process.exit(1);
}
