import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {

    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
        console.warn("Cloudinary env vars missing; image uploads will use placeholders. Set CLOUDINARY_NAME/CLOUDINARY_API_KEY/CLOUDINARY_SECRET_KEY to enable uploads.");
        return;
    }

    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

}

export default connectCloudinary;