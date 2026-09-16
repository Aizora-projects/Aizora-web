'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Save,
  Upload,
  Monitor,
  Smartphone,
  MessageCircle,
  Trash2,
  Loader2,
  Check,
  Type,
  ExternalLink,
} from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '@/actions/settings';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch {
        setError('Failed to load settings');
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Sync hero_image_url with hero_desktop_banner_1 for backward compatibility
      const payload = {
        ...settings,
        hero_image_url: settings.hero_desktop_banner_1 || settings.hero_image_url || '',
      };

      const result = await updateSiteSettings(payload);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('All settings and banners saved successfully!');
        setTimeout(() => setSuccess(''), 3500);
        router.refresh();
      }
    } catch {
      setError('An error occurred while saving.');
    }
    setIsSaving(false);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slotKey: string,
    folder: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(slotKey);
    setError('');
    setSuccess('');

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', folder);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Upload failed with status ' + response.status);
      }

      // Delete previous Cloudinary image if replacing to save storage
      const prevUrl = settings[slotKey];
      if (prevUrl && prevUrl.includes('res.cloudinary.com')) {
        const match = prevUrl.match(/\/upload\/(?:(?:[a-z]_[^/]+,)*[a-z]_[^/]+\/)?(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
        const prevPublicId = match ? match[1] : null;
        if (prevPublicId && prevPublicId !== result.public_id) {
          fetch('/api/admin/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: prevPublicId }),
          }).catch((e) => console.error('Cloudinary cleanup error:', e));
        }
      }

      const updatedSettings = {
        ...settings,
        [slotKey]: result.secure_url,
      };

      // Keep legacy hero_image_url in sync if updating primary desktop banner
      if (slotKey === 'hero_desktop_banner_1') {
        updatedSettings.hero_image_url = result.secure_url;
      }

      setSettings(updatedSettings);

      // Auto-save immediately to Supabase
      await updateSiteSettings(updatedSettings);

      setSuccess(`Banner saved successfully to ${slotKey.replace(/_/g, ' ')}!`);
      setTimeout(() => setSuccess(''), 3500);
      router.refresh();
    } catch (err) {
      console.error('Banner upload error:', err);
      setError(err instanceof Error ? err.message : 'Banner upload failed');
    }

    setUploadingSlot(null);
  };

  const handleRemoveBanner = async (slotKey: string) => {
    // Delete from Cloudinary to keep storage clean
    const currentUrl = settings[slotKey];
    if (currentUrl && currentUrl.includes('res.cloudinary.com')) {
      const match = currentUrl.match(/\/upload\/(?:(?:[a-z]_[^/]+,)*[a-z]_[^/]+\/)?(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      const publicId = match ? match[1] : null;
      if (publicId) {
        fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: publicId }),
        }).catch((e) => console.error('Cloudinary cleanup error:', e));
      }
    }

    const updatedSettings = {
      ...settings,
      [slotKey]: '',
    };

    if (slotKey === 'hero_desktop_banner_1') {
      updatedSettings.hero_image_url = '';
    }

    setSettings(updatedSettings);
    await updateSiteSettings(updatedSettings);
    setSuccess(`Banner removed from ${slotKey.replace(/_/g, ' ')} and deleted from Cloudinary.`);
    setTimeout(() => setSuccess(''), 3000);
    router.refresh();
  };

  const desktopSlots = [
    { key: 'hero_desktop_banner_1', label: 'Desktop Banner 1 (Primary)', desc: 'Main slide on wide screens' },
    { key: 'hero_desktop_banner_2', label: 'Desktop Banner 2', desc: 'Second slide in auto-rotation' },
    { key: 'hero_desktop_banner_3', label: 'Desktop Banner 3', desc: 'Third slide in auto-rotation' },
  ];

  const mobileSlots = [
    { key: 'hero_mobile_banner_1', label: 'Mobile Banner 1 (Primary)', desc: 'Main slide on mobile phones' },
    { key: 'hero_mobile_banner_2', label: 'Mobile Banner 2', desc: 'Second slide in mobile rotation' },
    { key: 'hero_mobile_banner_3', label: 'Mobile Banner 3', desc: 'Third slide in mobile rotation' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-stone-200 animate-pulse rounded-lg" />
        <div className="h-44 bg-white border border-admin-border rounded-xl animate-pulse" />
        <div className="h-72 bg-white border border-admin-border rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-admin-border/60">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900 tracking-[0.05em] uppercase">
            Store & Banner Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure up to 3 separate Desktop and Mobile banners, WhatsApp checkout, and storefront copy.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 bg-tan hover:bg-tan-dark text-white px-5 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2 animate-fade-in shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium animate-fade-in shadow-2xs">
          {error}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: DESKTOP BANNERS (UP TO 3 BANNERS)                              */}
      {/* ========================================================================= */}
      <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-7 shadow-2xs space-y-6">
        <div className="flex items-start sm:items-center justify-between gap-3 border-b border-admin-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan/15 text-tan flex items-center justify-center flex-shrink-0">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Desktop Hero Banners
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF5EE] text-tan border border-tan/30 uppercase">
                  Up to 3 Banners
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Displayed on desktop, laptops & wide screens. Recommended ratio: <strong className="text-stone-700">16:9 or 21:9</strong> (e.g. 1920×1080).
              </p>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-tan hover:text-tan-dark font-medium"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Desktop Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {desktopSlots.map((slot, index) => {
            const currentUrl = settings[slot.key];
            const isUploading = uploadingSlot === slot.key;

            return (
              <div
                key={slot.key}
                className="bg-[#FAF8F5]/80 border border-admin-border rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900">
                      Slot {index + 1}: {slot.label}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        currentUrl
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {currentUrl ? 'Active' : 'Empty'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-3">{slot.desc}</p>

                  {/* Preview Container (16:9 aspect) */}
                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-white border-2 border-dashed border-admin-border flex items-center justify-center shadow-2xs">
                    {currentUrl ? (
                      <>
                        <Image
                          src={currentUrl}
                          alt={slot.label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            type="button"
                            onClick={() => handleRemoveBanner(slot.key)}
                            className="p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md transition-colors shadow-sm"
                            title="Remove banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-stone-400">
                        <Monitor className="w-6 h-6 mx-auto mb-1 opacity-40 text-tan" />
                        <span className="text-[10px] block font-medium">No image in Slot {index + 1}</span>
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                        <Loader2 className="w-6 h-6 animate-spin text-tan mb-1" />
                        <span className="text-[11px] font-semibold">Uploading to Cloudinary...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {/* File Upload Button */}
                  <label
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-cream/60 border border-admin-border rounded-lg text-xs font-semibold text-stone-800 cursor-pointer transition-all shadow-2xs ${
                      isUploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-tan" />
                    <span>{currentUrl ? 'Replace Photo' : 'Upload Banner Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, slot.key, 'aizora/banners/desktop')}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {/* Direct URL Input */}
                  <input
                    type="text"
                    value={currentUrl || ''}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [slot.key]: e.target.value }))
                    }
                    placeholder="Or paste image URL"
                    className="w-full bg-white border border-admin-border rounded-lg px-2.5 py-1.5 text-[11px] text-stone-900 font-mono focus:outline-none focus:border-tan"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: MOBILE BANNERS (UP TO 3 BANNERS — SEPARATE!)                   */}
      {/* ========================================================================= */}
      <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-7 shadow-2xs space-y-6">
        <div className="flex items-start sm:items-center justify-between gap-3 border-b border-admin-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan/15 text-tan flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Mobile Hero Banners (Dedicated Portrait)
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF5EE] text-tan border border-tan/30 uppercase">
                  Up to 3 Banners
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Displayed exclusively on mobile phones. Tailored vertical framing (<strong className="text-stone-700">4:5 or 9:16</strong>, e.g. 1080×1350) prevents desktop landscape cropping.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Mobile Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {mobileSlots.map((slot, index) => {
            const currentUrl = settings[slot.key];
            const isUploading = uploadingSlot === slot.key;

            return (
              <div
                key={slot.key}
                className="bg-[#FAF8F5]/80 border border-admin-border rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900">
                      Slot {index + 1}: {slot.label}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        currentUrl
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {currentUrl ? 'Active' : 'Empty'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-3">{slot.desc}</p>

                  {/* Preview Container (4:5 portrait aspect) */}
                  <div className="relative aspect-[4/5] w-full max-w-[240px] mx-auto rounded-lg overflow-hidden bg-white border-2 border-dashed border-admin-border flex items-center justify-center shadow-2xs">
                    {currentUrl ? (
                      <>
                        <Image
                          src={currentUrl}
                          alt={slot.label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            type="button"
                            onClick={() => handleRemoveBanner(slot.key)}
                            className="p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-md transition-colors shadow-sm"
                            title="Remove banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <Smartphone className="w-7 h-7 mx-auto mb-1.5 opacity-40 text-tan" />
                        <span className="text-[10px] block font-medium">No mobile image in Slot {index + 1}</span>
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 p-2 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-tan mb-1" />
                        <span className="text-[10px] font-semibold">Uploading to Cloudinary...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {/* File Upload Button */}
                  <label
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-cream/60 border border-admin-border rounded-lg text-xs font-semibold text-stone-800 cursor-pointer transition-all shadow-2xs ${
                      isUploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-tan" />
                    <span>{currentUrl ? 'Replace Photo' : 'Upload Mobile Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, slot.key, 'aizora/banners/mobile')}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {/* Direct URL Input */}
                  <input
                    type="text"
                    value={currentUrl || ''}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [slot.key]: e.target.value }))
                    }
                    placeholder="Or paste image URL"
                    className="w-full bg-white border border-admin-border rounded-lg px-2.5 py-1.5 text-[11px] text-stone-900 font-mono focus:outline-none focus:border-tan"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: WHATSAPP ORDER CHECKOUT ROUTING                                */}
      {/* ========================================================================= */}
      <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-admin-border/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 fill-[#25D366]" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              WhatsApp Order Receiver Number
            </h2>
            <p className="text-xs text-stone-500">
              When customers tap &ldquo;Buy Now&rdquo; or &ldquo;Order via WhatsApp&rdquo;, their order details and delivery address are routed to this number.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-600 tracking-wider uppercase mb-1.5">
            Store WhatsApp Phone Number (with Country Code)
          </label>
          <div className="max-w-md w-full">
            <input
              type="text"
              value={settings.whatsapp_number || ''}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, whatsapp_number: e.target.value }))
              }
              placeholder="e.g. 919876543210 (91 for India + 10-digit number)"
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm text-stone-900 font-mono focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>
          <p className="text-xs text-stone-500 mt-1.5">
            Enter full number without &lsquo;+&rsquo; or dashes (e.g. for Indian number 9876543210, use <code className="text-tan font-bold font-mono">919876543210</code>).
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: STOREFRONT COPY & ANNOUNCEMENT BAR                             */}
      {/* ========================================================================= */}
      <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-admin-border/60 pb-3">
          <div className="w-10 h-10 rounded-xl bg-tan/15 text-tan flex items-center justify-center flex-shrink-0">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Hero Section Typography & Copy
            </h2>
            <p className="text-xs text-stone-500">
              Customize the editorial brand text, headlines, and announcement bar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Top Eyebrow Line 1
            </label>
            <input
              type="text"
              value={settings.hero_eyebrow1 || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_eyebrow1: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Top Eyebrow Line 2
            </label>
            <input
              type="text"
              value={settings.hero_eyebrow2 || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_eyebrow2: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Hero Title Line 1
            </label>
            <input
              type="text"
              value={settings.hero_title_line1 || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_title_line1: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Hero Title Line 2 (Accent Font)
            </label>
            <input
              type="text"
              value={settings.hero_title_line2 || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_title_line2: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Hero Subtitle / Description
            </label>
            <input
              type="text"
              value={settings.hero_description || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_description: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Hero CTA Button Text
            </label>
            <input
              type="text"
              value={settings.hero_cta_text || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_cta_text: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Hero CTA Destination Link
            </label>
            <input
              type="text"
              value={settings.hero_cta_link || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_cta_link: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Far-Right Script Quote (Alex Brush Calligraphy)
            </label>
            <textarea
              rows={3}
              value={settings.hero_script_quote || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, hero_script_quote: e.target.value }))}
              placeholder="Elegance,&#10;Beyond&#10;Fashion"
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all font-mono"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Shown in elegant calligraphy on the right side of the hero section. Use newlines (Enter) to format lines.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Top Announcement Bar Copy
            </label>
            <input
              type="text"
              value={settings.announcement_text || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, announcement_text: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2 pb-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 bg-tan hover:bg-tan-dark text-white px-8 py-3 text-xs font-bold tracking-wider uppercase rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
}
