import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  category_id: z.string().uuid('Please select a category'),
  description: z.string().optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  price: z.number().min(0, 'Price must be positive'),
  compare_at_price: z.number().min(0).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().max(500).optional().nullable(),
  tagline: z.string().max(100).optional().nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);
