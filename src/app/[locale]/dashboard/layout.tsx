"use client";

import { useRouter } from "@/i18n/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { NAV_ITEMS, NavLink, Sidebar } from "@/components/dashboard/sidebar";
import { listCamerasApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function getPageTitle(pathname: string): { ar: string; en: string } {
  if (pathname.includes("/cameras")) return { ar: "إدارة الكاميرات", en: "Cameras" };
  if (pathname.includes("/emergency")) return { ar: "مركز الطوارئ", en: "Emergency" };
  if (pathname.includes("/billing")) return { ar: "الفواتير والاشتراكات", en: "Billing" };
  if (pathname.includes("/profile")) return { ar: "الملف الشخصي", en: "Profile" };
  return { ar: "نظرة عامة", en: "Overview" };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [cameraCount, setCameraCount] = useState<number>(0);
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !token) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, token, router]);

  useEffect(() => {
    if (token) {
      listCamerasApi({ per_page: 50 }).then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setCameraCount(res.data.length);
        }
      });
    }
  }, [token]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isEmergency = pathname.includes("/emergency");

  return (
    <div className="flex h-screen overflow-hidden bg-[--db-bg] text-foreground relative">

      {/* ── Sidebar (desktop) ───────────────────────────── */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          cameraCount={cameraCount}
        />
      </div>

      {/* ── Mobile overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 start-0 z-50 transition-transform duration-300 ease-out-expo",
          mobileOpen ? "translate-x-0 rtl:translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <Sidebar
          collapsed={false}
          cameraCount={cameraCount}
          mobile={true}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <DashboardHeader
          title={title}
          isEmergency={isEmergency}
          onOpenMobileMenu={() => setMobileOpen(true)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 pb-24 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────── */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 flex items-center justify-around bg-[--db-sidebar] border-t border-[--db-border] px-2 py-1.5 safe-area-bottom">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} collapsed={false} mobile />
        ))}
      </nav>
    </div>
  );
}
