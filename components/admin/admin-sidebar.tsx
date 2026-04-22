"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminSidebarGlyph } from "@/components/admin/admin-sidebar-glyph";
import { ADMIN_SIDEBAR_ITEMS } from "@/lib/admin/navigation";

type AdminSidebarProps = {
  settingsHref: string;
};

export function AdminSidebar({
  settingsHref,
}: Readonly<AdminSidebarProps>) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          setIsMobileSidebarOpen(false);
        }}
      />

      <div
        className={`fixed inset-y-0 left-0 z-[111] w-[17.5rem] bg-[#5429cf] px-5 py-5 text-[#14c1e7] shadow-[0_24px_60px_rgba(28,13,85,0.3)] transition-transform duration-300 lg:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div
              className="text-[0.92rem] leading-none tracking-[0.02em] font-bold"
              style={{ fontFamily: "var(--font-bungee)" }}
            >
              AKBAR
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileSidebarOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-[#14c1e7]"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>

          <div className="mt-8 flex flex-1 flex-col gap-4">
            {ADMIN_SIDEBAR_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`flex items-center gap-4 rounded-[1rem] px-4 py-3 text-left transition-all duration-300 ${
                    isActive
                      ? "bg-[#4520b8] text-[#12d3ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "text-[#12d3ef] hover:bg-white/8"
                  } ${
                    isMobileSidebarOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMobileSidebarOpen
                      ? `${80 + index * 45}ms`
                      : "0ms",
                  }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-black/10">
                    <AdminSidebarGlyph label={item.label} />
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href={settingsHref}
            className={`mt-6 flex items-center gap-4 rounded-[1rem] px-4 py-3 text-left text-[#12d3ef] transition-all duration-300 hover:bg-white/8 ${
              isMobileSidebarOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: isMobileSidebarOpen
                ? `${80 + ADMIN_SIDEBAR_ITEMS.length * 45}ms`
                : "0ms",
            }}
            onClick={() => {
              setIsMobileSidebarOpen(false);
            }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-black/10">
              <AdminSidebarGlyph label="Settings" />
            </span>
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-4 text-[#14c1e7] lg:hidden">
        <div
          className="text-[0.9rem] leading-none tracking-[0.02em] font-bold"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          AKBAR
        </div>
        <button
          type="button"
          onClick={() => {
            setIsMobileSidebarOpen(true);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/8"
          aria-label="Open navigation"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-[#14c1e7]" />
            <span className="h-0.5 w-5 bg-[#14c1e7]" />
            <span className="h-0.5 w-5 bg-[#14c1e7]" />
          </span>
        </button>
      </div>

      <aside className="z-0 hidden h-screen flex-col px-4 py-8 text-[#14c1e7] lg:flex">
        <div
          className="text-center text-[0.84rem] leading-none tracking-[0.02em] font-bold"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          AKBAR
        </div>
        <div className="flex flex-1 items-center justify-center gap-3 px-3 lg:mt-10 lg:flex-col lg:px-0 lg:gap-6">
          {ADMIN_SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                className={`flex h-[2.9rem] w-[2.9rem] items-center justify-center rounded-[1rem] transition sm:h-[3.05rem] sm:w-[3.05rem] ${
                  isActive
                    ? "bg-[#4520b8] text-[#12d3ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-[#12d3ef] hover:bg-white/8"
                }`}
                aria-label={item.label}
                href={item.href}
              >
                <AdminSidebarGlyph label={item.label} />
              </Link>
            );
          })}
        </div>
        <div className="flex justify-center pl-3 lg:pt-3 lg:pl-0">
          <Link
            href={settingsHref}
            className="flex h-[2.9rem] w-[2.9rem] items-center justify-center rounded-[1rem] text-[#12d3ef] transition hover:bg-white/8 sm:h-[3.05rem] sm:w-[3.05rem]"
            aria-label="Settings"
          >
            <AdminSidebarGlyph label="Settings" />
          </Link>
        </div>
      </aside>
    </>
  );
}
