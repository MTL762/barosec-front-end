"use client";

import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-[oklch(0.12_0.02_250)] text-white items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-white/80">
            <span className="text-2xl font-bold font-mono">404</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">الصفحة غير موجودة | Out of Range</h1>
            <p className="text-sm text-white/60">
              الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
              <br />
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <a
              href="/ar"
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:opacity-90 transition-all"
            >
              العربية
            </a>
            <a
              href="/en"
              className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 font-semibold text-sm transition-all"
            >
              English
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
export const dynamic = "force-dynamic";
