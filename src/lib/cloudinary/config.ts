import { v2 as cloudinary } from 'cloudinary';

// Server-only Cloudinary configuration
// NEVER import this in Client Components
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export function getCloudinaryUrl(publicId: string, transforms?: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'haihas3q';
  const transformPart = transforms ? `/${transforms}` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload${transformPart}/${publicId}`;
}
