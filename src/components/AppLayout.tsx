import { Link, useRouterState } from "@tanstack/react-router";
import {
  Droplets,
  FileText,
  Hash,
  Heart,
  Minimize2,
  RotateCw,
  Files,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  Moon,
  Scissors,
  Signature,
  Sun,
  Languages,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { InstallButton } from "@/components/InstallButton";
import { useI18n, type TKey } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const links: { to: string; key: TKey; icon: typeof FileText }[] = [
  { to: "/", key: "nav_dashboard", icon: LayoutDashboard },
  { to: "/viewer", key: "nav_viewer", icon: Signature },
  { to: "/merge", key: "nav_merge", icon: Files },
  { to: "/split", key: "nav_split", icon: Scissors },
  { to: "/image-to-pdf", key: "nav_image", icon: ImageIcon },
  { to: "/pdf-to-text", key: "nav_text", icon: FileText },
  { to: "/watermark", key: "nav_watermark", icon: Droplets },
  { to: "/organize", key: "nav_organize", icon: RotateCw },
  { to: "/compress", key: "nav_compress", icon: Minimize2 },
  { to: "/page-numbers", key: "nav_numbers", icon: Hash },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-2 py-1">
        <span className="brand-gradient flex size-10 items-center justify-center rounded-xl text-primary-foreground">
          <FileText className="size-5" />
        </span>
        <span className="text-base font-bold leading-tight">{t("brand")}</span>
      </Link>

      <nav className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("tools")}
        </p>
        {links.map(({ to, key, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {t(key)}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { t, lang, toggle } = useI18n();
  const { dark, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 border-e border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="close"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-72 border-e border-sidebar-border bg-sidebar">
            <button
              onClick={() => setOpen(false)}
              className="absolute end-3 top-3 rounded-lg p-2 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label={t("open_menu")}
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <p className="truncate text-sm font-semibold sm:text-base">{t("tagline")}</p>

          <div className="ms-auto flex items-center gap-2">
            <InstallButton />
            <button
              onClick={toggle}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted"
              aria-label={t("language")}
              title={t("language")}
            >
              <Languages className="size-4" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>
            <button
              onClick={toggleTheme}
              aria-label={dark ? t("theme_light") : t("theme_dark")}
              title={dark ? t("theme_light") : t("theme_dark")}
              className="rounded-xl border border-border bg-card p-2.5 transition-colors hover:bg-muted"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
