import { createAdminClient } from '@/lib/supabase/admin';
import HeroSlider from './HeroSlider';

export default async function Hero() {
  let settings: Record<string, string> = {};

  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.from('site_settings').select('key, value');
    if (data) {
      data.forEach((s) => {
        settings[s.key] = s.value;
      });
    }
  } catch (err) {
    console.error('Hero settings fetch error:', err);
  }

  // Desktop Banners (Up to 3)
  const desktopBanners = [
    settings.hero_desktop_banner_1 || settings.hero_image_url || '',
    settings.hero_desktop_banner_2 || '',
    settings.hero_desktop_banner_3 || '',
  ].filter(Boolean);

  // Mobile Banners (Up to 3, separate from desktop)
  const mobileBanners = [
    settings.hero_mobile_banner_1 || '',
    settings.hero_mobile_banner_2 || '',
    settings.hero_mobile_banner_3 || '',
  ].filter(Boolean);

  const eyebrow1 = settings.hero_eyebrow1 || 'A MODERN WARDROBE';
  const eyebrow2 = settings.hero_eyebrow2 || 'FOR EVERY YOU';
  const title1 = settings.hero_title_line1 || 'WEAR YOUR';
  const title2 = settings.hero_title_line2 || 'ELEGANCE';
  const description = settings.hero_description || 'Curated fashion for every expression';
  const ctaText = settings.hero_cta_text || 'SHOP COLLECTION';
  const ctaLink = settings.hero_cta_link || '/shop';
  const scriptQuote = settings.hero_script_quote || 'Elegance,\nBeyond\nFashion';

  return (
    <HeroSlider
      desktopBanners={desktopBanners}
      mobileBanners={mobileBanners}
      eyebrow1={eyebrow1}
      eyebrow2={eyebrow2}
      title1={title1}
      title2={title2}
      description={description}
      ctaText={ctaText}
      ctaLink={ctaLink}
      scriptQuote={scriptQuote}
    />
  );
}
