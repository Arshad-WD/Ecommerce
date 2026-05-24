const { v4: uuidv4 } = require('uuid');
const cloudinaryClient = require('../config/cloudinary');
const prisma = require('../prisma/prisma.service');

class UploadService {
  async uploadProductImages(productId, files) {
    const uploadedImages = [];

    // Fallback premium Unsplash images if Cloudinary is not configured or fails
    const fallbackUrls = [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000'
    ];

    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET &&
      !process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let imageUrl = '';

      if (isCloudinaryConfigured) {
        try {
          imageUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinaryClient.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (result) {
                  resolve(result.secure_url || result.url);
                } else {
                  reject(error || new Error('Cloudinary upload returned undefined result'));
                }
              }
            );
            uploadStream.end(file.buffer);
          });
        } catch (err) {
          console.error('Cloudinary upload failed, falling back to mock template image:', err);
          imageUrl = fallbackUrls[i % fallbackUrls.length];
        }
      } else {
        console.warn('Cloudinary credentials not set in backend .env. Utilizing Unsplash preview fallback.');
        imageUrl = fallbackUrls[i % fallbackUrls.length];
      }

      const image = await prisma.productImage.create({
        data: {
          productId,
          imageUrl,
          isPrimary: i === 0,
          sortOrder: i,
        },
      });

      uploadedImages.push(image);
    }

    return uploadedImages;
  }
}

module.exports = new UploadService();