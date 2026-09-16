import { Metadata } from 'next';
import CheckoutClient from '@/components/storefront/CheckoutClient';

export const metadata: Metadata = {
  title: 'Express Checkout | AIZORA',
  description: 'Complete your order with Free Pan-India Delivery and WhatsApp confirmation.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
