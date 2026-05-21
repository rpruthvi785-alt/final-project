const cloudinary = require('../config/cloudinary');

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} Secure URL of uploaded image
 */
const uploadToCloudinary = (buffer, folder = 'travel-trackers') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary by URL
 * @param {string} imageUrl - Cloudinary image URL
 */
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  const parts = imageUrl.split('/');
  const folder = parts[parts.length - 2];
  const filename = parts[parts.length - 1].split('.')[0];
  const publicId = `${folder}/${filename}`;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
