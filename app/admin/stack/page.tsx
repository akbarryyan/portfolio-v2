"use client";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type StackItemRow = {
  id: string;
  name: string;
  category: string;
  icon_url: string;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

type ToastState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

const supabase = createBrowserSupabaseClient();

const initialStackForm = {
  name: "",
  category: "",
  icon_url: "",
  website_url: "",
  sort_order: "0",
};

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <label className="space-y-2">
      <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#8f86bc]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props: Readonly<InputHTMLAttributes<HTMLInputElement>>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-[#ece7ff] bg-[#f8f5ff] px-4 text-sm text-[#32285d] outline-none transition placeholder:text-[#aaa1cd] focus:border-[#5b33d6] focus:bg-white ${
        props.className ?? ""
      }`}
    />
  );
}

function Panel({
  title,
  subtitle,
  children,
}: Readonly<{
  title: string;
  subtitle: string;
  children: ReactNode;
}>) {
  return (
    <section className="rounded-[2rem] border border-[#ebe6ff] bg-[#fbfaff] p-5 shadow-[0_14px_32px_rgba(92,57,221,0.06)] sm:p-6">
      <div className="mb-6 space-y-2">
        <p
          className="text-[0.72rem] uppercase tracking-[0.22em] text-[#6d5ad7]"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          {title}
        </p>
        <p className="max-w-2xl text-sm leading-7 text-[#786ea6]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-[1.4rem] border border-[#ebe6ff] bg-[#fbfaff] p-4 shadow-[0_10px_24px_rgba(92,57,221,0.05)]">
      <p
        className="text-[0.68rem] uppercase tracking-[0.16em] text-[#9388bc]"
        style={{ fontFamily: "var(--font-bungee)" }}
      >
        {label}
      </p>
      <p className="mt-3 text-3xl leading-none tracking-[-0.06em] text-[#2f245b]">
        {value}
      </p>
    </div>
  );
}

function SidebarGlyph({ label }: Readonly<{ label: string }>) {
  if (label === "Overview") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path
          d="M5.5 10.5 12 5l6.5 5.5V18a1 1 0 0 1-1 1h-3.5v-4h-4v4H6.5a1 1 0 0 1-1-1v-7.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (label === "Stack") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path d="M12 4 4.5 8 12 12 19.5 8 12 4Z" fill="currentColor" />
        <path
          d="M4.5 11.25 12 15.25l7.5-4M4.5 14.5 12 18.5l7.5-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (label === "Projects") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path
          d="M7 4.5h7l3 3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M14 4.5v3h3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 12h5M9 15h4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (label === "Experience") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path
          d="M8 7.5h8M8.75 5h6.5a1.75 1.75 0 0 1 1.75 1.75v10.5A1.75 1.75 0 0 1 15.25 19h-6.5A1.75 1.75 0 0 1 7 17.25V6.75A1.75 1.75 0 0 1 8.75 5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 10.5h6M9 14h4.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
      <path
        d="M12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Zm0-3.25 1.2 1.65 2.04-.28.53 1.98 1.89.82-.82 1.89 1.19 1.7-1.7 1.2.28 2.04-1.98.53-.82 1.89-1.89-.82-1.7 1.19-1.2-1.7-2.04.28-.53-1.98-1.89-.82.82-1.89L4 12l1.7-1.2-.28-2.04 1.98-.53.82-1.89 1.89.82L12 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.4rem] w-[1.4rem]" fill="none">
      <path
        d="M8.5 18.5h7m-5.5 0a2 2 0 0 0 4 0m-7-2.5h10l-1.2-1.8V11a3.8 3.8 0 1 0-7.6 0v3.2L7 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.4rem] w-[1.4rem]" fill="none">
      <path
        d="M12 12a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm-6 7a6 6 0 0 1 12 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none">
      <path
        d="M11 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm7 12-3.2-3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminStackPage() {
  const pathname = usePathname();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [stackItems, setStackItems] = useState<StackItemRow[]>([]);
  const [stackForm, setStackForm] = useState(initialStackForm);
  const [editingStackId, setEditingStackId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  function showToast(type: NonNullable<ToastState>["type"], message: string) {
    setToast({ type, message });
  }

  const checkAdminAccess = useCallback(async () => {
    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return false;
    }

    return Boolean(data);
  }, []);

  async function loadStackPage() {
    setDashboardError(null);

    const { data, error } = await supabase
      .from("stack_items")
      .select(
        "id, name, category, icon_url, website_url, sort_order, is_active, updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setDashboardError(
        `${error.message}. Pastikan schema Supabase terbaru sudah dijalankan.`,
      );
      return;
    }

    setStackItems(data ?? []);
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSessionEmail(session?.user.email ?? null);
      if (session) {
        const allowed = await checkAdminAccess();
        if (!isMounted) {
          return;
        }
        setIsAdmin(allowed);
        setAuthMessage(
          allowed
            ? null
            : "Email ini berhasil login, tetapi belum terdaftar sebagai admin.",
        );
        if (allowed) {
          void loadStackPage();
        }
      } else {
        setIsAdmin(false);
      }

      setIsAuthLoading(false);
    }

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        setSessionEmail(session?.user.email ?? null);

        if (session) {
          const allowed = await checkAdminAccess();
          setIsAdmin(allowed);
          setDashboardError(null);
          setAuthMessage(
            allowed
              ? null
              : "Email ini berhasil login, tetapi belum terdaftar sebagai admin.",
          );
          setIsAuthLoading(false);
          if (allowed) {
            void loadStackPage();
          }
        } else {
          setIsAdmin(false);
          setAuthMessage(null);
          setDashboardError(null);
          setSuccessMessage(null);
          setStackItems([]);
          setIsAuthLoading(false);
        }
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminAccess]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    setIsSaving(false);
    setAuthMessage(error ? error.message : "Sign in berhasil.");
    showToast(error ? "error" : "success", error ? error.message : "Sign in berhasil.");
  }

  async function handleSignUp() {
    setIsSaving(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });

    setIsSaving(false);
    setAuthMessage(
      error
        ? error.message
        : "Akun berhasil dibuat. Cek email kalau verifikasi diaktifkan.",
    );
    showToast(
      error ? "error" : "success",
      error
        ? error.message
        : "Akun berhasil dibuat. Cek email kalau verifikasi diaktifkan.",
    );
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSuccessMessage(null);
    setAuthMessage("Session ditutup.");
    showToast("info", "Session ditutup.");
  }

  async function addStackItem() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("stack_items").insert({
      name: stackForm.name,
      category: stackForm.category,
      icon_url: stackForm.icon_url,
      website_url: stackForm.website_url || null,
      sort_order: Number(stackForm.sort_order || 0),
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setStackForm(initialStackForm);
    setSuccessMessage("Stack item berhasil ditambahkan.");
    showToast("success", "Stack item berhasil ditambahkan.");
    await loadStackPage();
  }

  async function updateStackItem() {
    if (!editingStackId) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase
      .from("stack_items")
      .update({
        name: stackForm.name,
        category: stackForm.category,
        icon_url: stackForm.icon_url,
        website_url: stackForm.website_url || null,
        sort_order: Number(stackForm.sort_order || 0),
      })
      .eq("id", editingStackId);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setEditingStackId(null);
    setStackForm(initialStackForm);
    setSuccessMessage("Stack item berhasil diperbarui.");
    showToast("success", "Stack item berhasil diperbarui.");
    await loadStackPage();
  }

  function startEditingStack(item: StackItemRow) {
    setEditingStackId(item.id);
    setStackForm({
      name: item.name,
      category: item.category,
      icon_url: item.icon_url,
      website_url: item.website_url ?? "",
      sort_order: String(item.sort_order),
    });
    setSuccessMessage(null);
    setDashboardError(null);
  }

  function cancelStackEdit() {
    setEditingStackId(null);
    setStackForm(initialStackForm);
  }

  async function toggleStackActive(item: StackItemRow) {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase
      .from("stack_items")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setSuccessMessage("Status stack item berhasil diperbarui.");
    showToast("success", "Status stack item berhasil diperbarui.");
    await loadStackPage();
  }

  async function removeStackItem(id: string) {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("stack_items").delete().eq("id", id);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setSuccessMessage("Stack item berhasil dihapus.");
    showToast("success", "Stack item berhasil dihapus.");
    await loadStackPage();
  }

  const sidebarItems = [
    { label: "Overview", href: "/admin", isActive: pathname === "/admin" },
    { label: "Stack", href: "/admin/stack", isActive: pathname === "/admin/stack" },
    { label: "Projects", href: "/admin#projects-panel", isActive: false },
    { label: "Experience", href: "/admin#experience-panel", isActive: false },
  ];
  const activeItems = stackItems.filter((item) => item.is_active).length;
  const categoriesCount = new Set(stackItems.map((item) => item.category)).size;
  const primaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full bg-[#16c1e7] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50";
  const secondaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full border border-[#e7e0ff] bg-white px-5 text-sm font-medium text-[#493495] transition hover:border-[#cfc2ff]";

  return (
    <main
      className="h-screen overflow-hidden bg-[#eeebff] text-[#2f245b]"
      style={{ fontFamily: "var(--font-bungee)" }}
    >
      {toast && (
        <div className="pointer-events-none fixed inset-x-4 top-4 z-[120] flex justify-center sm:justify-end">
          <div
            className={`pointer-events-auto w-full max-w-sm rounded-[1.35rem] border px-4 py-3 text-sm shadow-[0_18px_50px_rgba(25,18,64,0.2)] ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : toast.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-sky-200 bg-sky-50 text-sky-700"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

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
            {sidebarItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-4 rounded-[1rem] px-4 py-3 text-left transition-all duration-300 ${
                  item.isActive
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
                  <SidebarGlyph label={item.label} />
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/admin#profile-panel"
            onClick={() => {
              setIsMobileSidebarOpen(false);
            }}
            className={`mt-6 flex items-center gap-4 rounded-[1rem] px-4 py-3 text-left text-[#12d3ef] transition-all duration-300 hover:bg-white/8 ${
              isMobileSidebarOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: isMobileSidebarOpen
                ? `${80 + sidebarItems.length * 45}ms`
                : "0ms",
            }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-black/10">
              <SidebarGlyph label="Settings" />
            </span>
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </div>

      <div className="flex h-screen w-full flex-col overflow-hidden bg-[#5429cf] shadow-[0_24px_90px_rgba(96,70,193,0.16)] lg:grid lg:grid-cols-[108px_1fr]">
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
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-[2.9rem] w-[2.9rem] items-center justify-center rounded-[1rem] transition sm:h-[3.05rem] sm:w-[3.05rem] ${
                  item.isActive
                    ? "bg-[#4520b8] text-[#12d3ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-[#12d3ef] hover:bg-white/8"
                }`}
                aria-label={item.label}
              >
                <SidebarGlyph label={item.label} />
              </Link>
            ))}
          </div>
          <div className="flex justify-center pl-3 lg:pt-3 lg:pl-0">
            <Link
              href="/admin#profile-panel"
              className="flex h-[2.9rem] w-[2.9rem] items-center justify-center rounded-[1rem] text-[#12d3ef] transition hover:bg-white/8 sm:h-[3.05rem] sm:w-[3.05rem]"
              aria-label="Settings"
            >
              <SidebarGlyph label="Settings" />
            </Link>
          </div>
        </aside>

        <div className="relative z-10 h-full overflow-y-auto rounded-t-[2rem] bg-white lg:-ml-2 lg:h-screen lg:rounded-t-none lg:rounded-l-[2.2rem]">
          <section className="px-4 py-4 sm:px-6">
            <div className="space-y-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-center gap-3 rounded-[1.35rem] bg-[#f4f0ff] px-4 py-3 text-sm text-[#8d83bc]">
                  <SearchIcon />
                  <span>Search</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center text-[#5b33d6] transition hover:opacity-75"
                    aria-label="Notifications"
                  >
                    <NotificationIcon />
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center text-[#5b33d6] transition hover:opacity-75"
                    aria-label="Profile"
                  >
                    <ProfileIcon />
                  </button>
                </div>
              </div>

              {isAuthLoading ? (
                <div className="rounded-[1.8rem] bg-[#f7f4ff] p-6 text-[#7a70aa]">
                  Checking session...
                </div>
              ) : !sessionEmail ? (
                <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                  <Panel
                    title="Auth"
                    subtitle="Masuk ke halaman pengelolaan stack. UI ini memakai session Supabase yang sama dengan dashboard utama."
                  >
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <Field label="Email">
                        <Input
                          type="email"
                          value={authEmail}
                          onChange={(event) => {
                            setAuthEmail(event.target.value);
                          }}
                          placeholder="admin@akbar.dev"
                        />
                      </Field>
                      <Field label="Password">
                        <Input
                          type="password"
                          value={authPassword}
                          onChange={(event) => {
                            setAuthPassword(event.target.value);
                          }}
                          placeholder="••••••••"
                        />
                      </Field>
                      <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={isSaving} className={primaryButtonClass}>
                          Sign In
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => {
                            void handleSignUp();
                          }}
                          className={secondaryButtonClass}
                        >
                          Sign Up
                        </button>
                      </div>
                      {authMessage && (
                        <p className="text-sm leading-7 text-[#786ea6]">{authMessage}</p>
                      )}
                    </form>
                  </Panel>

                  <Panel
                    title="Stack Route"
                    subtitle="Halaman ini fokus untuk mengelola nama stack, icon, kategori, urutan tampil, dan status aktif."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Login dengan email admin Supabase kamu.</p>
                      <p>2. Tambahkan item baru atau edit item yang sudah ada.</p>
                      <p>3. Kembali ke `/admin` kapan saja untuk mengelola konten lain.</p>
                    </div>
                  </Panel>
                </div>
              ) : !isAdmin ? (
                <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                  <Panel
                    title="Access Denied"
                    subtitle="User ini sudah login, tetapi belum punya role admin."
                  >
                    <div className="space-y-4 text-sm leading-7 text-[#786ea6]">
                      <p>
                        Signed in as <span className="font-semibold text-[#2f245b]">{sessionEmail}</span>
                      </p>
                      <div className="rounded-[1.4rem] bg-[#f4f0ff] p-4 font-mono text-[0.8rem] leading-7 text-[#4d3d8d]">
                        {`insert into public.admin_users (email)\nvalues ('${sessionEmail}');`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          void handleSignOut();
                        }}
                        className={secondaryButtonClass}
                      >
                        Sign Out
                      </button>
                    </div>
                  </Panel>

                  <Panel
                    title="Whitelist"
                    subtitle="Proteksi admin tetap memakai tabel admin_users + fungsi is_admin()."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Jalankan `supabase/schema.sql` jika belum update.</p>
                      <p>2. Masukkan email ini ke tabel `public.admin_users`.</p>
                      <p>3. Refresh halaman atau login ulang.</p>
                    </div>
                  </Panel>
                </div>
              ) : (
                <>
                  <section className="space-y-5">
                    <div className="rounded-[1.8rem] bg-[#fbfaff] p-4 shadow-[0_14px_32px_rgba(92,57,221,0.06)] sm:p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h1 className="text-[1.8rem] tracking-[-0.04em] text-[#2f245b] sm:text-[2.35rem]">
                            Stack Library
                          </h1>
                          <p className="mt-2 text-sm leading-7 text-[#7a70aa]">
                            {sessionEmail} • atur icon, nama, kategori, urutan tampil, dan
                            status aktif untuk section STACK di landing page.
                          </p>
                        </div>
                        <Link href="/admin" className={secondaryButtonClass}>
                          Back to Dashboard
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                      <StatCard label="Total Stack" value={String(stackItems.length)} />
                      <StatCard label="Active" value={String(activeItems)} />
                      <StatCard label="Categories" value={String(categoriesCount)} />
                      <StatCard
                        label="Last Update"
                        value={stackItems[0] ? new Date(stackItems[0].updated_at).toLocaleDateString("id-ID") : "-"}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] bg-[#f7f4ff] px-5 py-4">
                      <p className="text-sm text-[#786ea6]">
                        Nama stack yang kamu isi di sini akan tampil di bawah ikon pada overlay.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className={secondaryButtonClass}
                          onClick={() => {
                            void loadStackPage();
                          }}
                        >
                          Refresh Data
                        </button>
                        <button
                          type="button"
                          className={secondaryButtonClass}
                          onClick={() => {
                            void handleSignOut();
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>

                    {(dashboardError || successMessage || authMessage) && (
                      <div className="rounded-[1.6rem] bg-[#f7f4ff] px-5 py-4 text-sm leading-7">
                        {dashboardError && <p className="text-[#d64d69]">{dashboardError}</p>}
                        {!dashboardError && successMessage && (
                          <p className="text-[#23996a]">{successMessage}</p>
                        )}
                        {!dashboardError && !successMessage && authMessage && (
                          <p className="text-[#786ea6]">{authMessage}</p>
                        )}
                      </div>
                    )}

                    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                      <Panel
                        title="Stack Form"
                        subtitle="Tambahkan atau edit stack item yang akan tampil pada marquee overlay."
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Stack Name">
                            <Input
                              value={stackForm.name}
                              onChange={(event) => {
                                setStackForm((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }));
                              }}
                              placeholder="TypeScript"
                            />
                          </Field>
                          <Field label="Category">
                            <Input
                              value={stackForm.category}
                              onChange={(event) => {
                                setStackForm((current) => ({
                                  ...current,
                                  category: event.target.value,
                                }));
                              }}
                              placeholder="Languages"
                            />
                          </Field>
                          <Field label="Icon URL">
                            <Input
                              value={stackForm.icon_url}
                              onChange={(event) => {
                                setStackForm((current) => ({
                                  ...current,
                                  icon_url: event.target.value,
                                }));
                              }}
                              placeholder="https://cdn.jsdelivr.net/..."
                            />
                          </Field>
                          <Field label="Website URL">
                            <Input
                              value={stackForm.website_url}
                              onChange={(event) => {
                                setStackForm((current) => ({
                                  ...current,
                                  website_url: event.target.value,
                                }));
                              }}
                              placeholder="https://www.typescriptlang.org"
                            />
                          </Field>
                          <Field label="Sort Order">
                            <Input
                              type="number"
                              value={stackForm.sort_order}
                              onChange={(event) => {
                                setStackForm((current) => ({
                                  ...current,
                                  sort_order: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                        </div>

                        <div className="mt-5 rounded-[1.5rem] border border-[#ebe6ff] bg-[#f7f4ff] p-4">
                          <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#8f86bc]">
                            Live Preview
                          </p>
                          <div className="mt-4 flex items-center gap-4 rounded-[1.2rem] bg-white p-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-[1.1rem] bg-[#f2eeff]">
                              {stackForm.icon_url ? (
                                <Image
                                  src={stackForm.icon_url}
                                  alt={stackForm.name || "Stack icon"}
                                  width={40}
                                  height={40}
                                  unoptimized
                                  className="h-10 w-10 object-contain"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-[#e2dcff]" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-[#2f245b]">
                                {stackForm.name || "Stack name"}
                              </p>
                              <p className="text-xs uppercase tracking-[0.12em] text-[#8f86bc]">
                                {stackForm.category || "Category"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <p className="text-sm text-[#8d83bc]">
                            {editingStackId
                              ? "Mode edit aktif untuk stack item terpilih."
                              : "Tambahkan stack item baru ke portfolio."}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {editingStackId && (
                              <button
                                type="button"
                                onClick={cancelStackEdit}
                                disabled={isSaving}
                                className={secondaryButtonClass}
                              >
                                Cancel Edit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (editingStackId) {
                                  void updateStackItem();
                                  return;
                                }

                                void addStackItem();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              {editingStackId ? "Update Stack" : "Add Stack"}
                            </button>
                          </div>
                        </div>
                      </Panel>

                      <Panel
                        title="Stack Library"
                        subtitle="Seluruh item di bawah ini dipakai untuk overlay STACK. Kamu bisa edit, nonaktifkan, atau hapus item kapan saja."
                      >
                        {stackItems.length === 0 ? (
                          <p className="text-sm text-[#8d83bc]">Belum ada stack item.</p>
                        ) : (
                          <div className="space-y-3">
                            {stackItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col gap-4 rounded-[1.4rem] bg-[#f7f4ff] p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="flex min-w-0 items-center gap-4">
                                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.1rem] bg-white">
                                    <Image
                                      src={item.icon_url}
                                      alt={item.name}
                                      width={40}
                                      height={40}
                                      unoptimized
                                      className="h-10 w-10 object-contain"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-lg text-[#2f245b]">
                                      {item.name}
                                    </p>
                                    <p className="truncate text-sm text-[#6f63a0]">
                                      {item.category}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8f86bc]">
                                      Order {item.sort_order} • {item.is_active ? "Active" : "Hidden"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                  {item.website_url && (
                                    <a
                                      href={item.website_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sm text-[#5b33d6]"
                                    >
                                      Visit
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      startEditingStack(item);
                                    }}
                                    className="text-sm text-[#5b33d6]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      void toggleStackActive(item);
                                    }}
                                    className="text-sm text-[#5b33d6]"
                                  >
                                    {item.is_active ? "Hide" : "Show"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      void removeStackItem(item.id);
                                    }}
                                    className="text-sm text-[#5b33d6]"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Panel>
                    </div>
                  </section>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
