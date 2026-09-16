'use client';

// Custom image loader for Cloudinary CDN & local assets
// Bypasses Vercel's 1,000 image optimization monthly limit (keeps Vercel 100% FREE)
// Delivers crystal-clear WebP/AVIF with Cloudinary's best-in-class q_auto:best
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's a Cloudinary image URL
  if (src.includes('res.cloudinary.com')) {
    const uploadIndex = src.indexOf('/upload/');
    if (uploadIndex !== -1) {
      // Use q_auto:best for razor-sharp fashion detail, or custom quality if provided
      const q = quality ? `q_${quality}` : 'q_auto:best';
      const transforms = `f_auto,${q},w_${width},c_limit`;
      return `${src.slice(0, uploadIndex + 8)}${transforms}/${src.slice(uploadIndex + 8)}`;
    }
  }

  // Local assets (e.g. /Aizora-logo.png) or external non-Cloudinary images
  return src;
}
