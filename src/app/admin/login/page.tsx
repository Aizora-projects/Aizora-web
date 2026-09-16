'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loginAdmin } from '@/actions/auth';
import { Eye, EyeOff, Loader2, Shield, Key, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@aizora.in');
  const [password, setPassword] = useState('Admin@Aizora2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fillCredentials = () => {
    setEmail('admin@aizora.in');
    setPassword('Admin@Aizora2026!');
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await loginAdmin(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      window.location.href = '/admin/dashboard';
    } else {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 py-12 font-body text-stone-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo in natural gold & crisp color */}
        <div className="text-center">
          <Link href="/" className="inline-block p-4 bg-white rounded-2xl border border-[#EAE3D8] shadow-xs mb-3 hover:border-tan transition-colors">
            <Image
              src="/Aizora-logo.png"
              alt="AIZORA"
              width={160}
              height={52}
              className="h-10 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
          <p className="text-[11px] tracking-[0.25em] uppercase text-stone-500 font-medium">
            Admin Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E8DFD3] rounded-2xl p-7 sm:p-9 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
            <h2 className="text-xs tracking-[0.18em] uppercase text-stone-900 font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-tan" />
              <span>Sign In to Dashboard</span>
            </h2>
            <button
              type="button"
              onClick={fillCredentials}
              className="text-[11px] text-tan hover:text-tan-dark font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded bg-[#FAF7F2] border border-[#EAE3D8]"
              title="Click to fill default credentials"
            >
              <Key className="w-3 h-3" />
              <span>Auto-Fill</span>
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-lg animate-fade-in font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] tracking-wider uppercase text-stone-600 mb-1.5 font-semibold"
              >
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9CC] rounded-lg px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-tan focus:bg-white transition-colors"
                placeholder="admin@aizora.in"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] tracking-wider uppercase text-stone-600 mb-1.5 font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E2D9CC] rounded-lg px-4 py-3 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-tan focus:bg-white transition-colors"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-tan hover:bg-tan-dark text-white py-3.5 text-xs tracking-[0.2em] uppercase font-semibold rounded-lg transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Credentials Info */}
          <div className="pt-4 border-t border-[#F0EAE1] text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">Configured Admin Account:</p>
            <p>
              Email: <code className="text-tan font-mono font-medium">admin@aizora.in</code>
            </p>
            <p>
              Password: <code className="text-tan font-mono font-medium">Admin@Aizora2026!</code>
            </p>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-tan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
