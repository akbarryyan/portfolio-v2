"use client";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  gallery: unknown;
  stack: string[] | null;
  year: number | null;
  status: "draft" | "published";
  featured: boolean;
  live_url: string | null;
  repo_url: string | null;
  sort_order: number;
  updated_at: string;
};

type ToastState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

const supabase = createBrowserSupabaseClient();

const initialProjectForm = {
  title: "",
  slug: "",
  category: "",
  summary: "",
  galleryInput: "",
  stackInput: "",
  year: "",
  status: "draft",
  featured: false,
  live_url: "",
  repo_url: "",
  sort_order: "0",
};

function parseGalleryInput(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [eyebrow = "", title = "", surfaceClass = ""] = line
        .split("|")
        .map((part) => part.trim());

      return {
        eyebrow,
        title,
        surfaceClass,
      };
    });
}

function parseStackInput(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function stringifyGalleryInput(gallery: unknown) {
  if (!Array.isArray(gallery)) {
    return "";
  }

  return gallery
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const record = item as Record<string, unknown>;
      const eyebrow = typeof record.eyebrow === "string" ? record.eyebrow : "";
      const title = typeof record.title === "string" ? record.title : "";
      const surfaceClass =
        typeof record.surfaceClass === "string" ? record.surfaceClass : "";

      return [eyebrow, title, surfaceClass].join(" | ");
    })
    .filter(Boolean)
    .join("\n");
}

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

function Textarea(
  props: Readonly<TextareaHTMLAttributes<HTMLTextAreaElement>>,
) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-2xl border border-[#ece7ff] bg-[#f8f5ff] px-4 py-3 text-sm text-[#32285d] outline-none transition placeholder:text-[#aaa1cd] focus:border-[#5b33d6] focus:bg-white ${
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

  if (label === "Profile") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path
          d="M12 12a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm-6 7a6 6 0 0 1 12 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
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

export default function AdminProjectsPage() {
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
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
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

  async function loadProjectsPage() {
    setDashboardError(null);

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, title, slug, category, summary, gallery, stack, year, status, featured, live_url, repo_url, sort_order, updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setDashboardError(
        `${error.message}. Pastikan schema Supabase terbaru sudah dijalankan.`,
      );
      return;
    }

    setProjects(data ?? []);
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
          void loadProjectsPage();
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
            void loadProjectsPage();
          }
        } else {
          setIsAdmin(false);
          setAuthMessage(null);
          setDashboardError(null);
          setSuccessMessage(null);
          setProjects([]);
          setProjectForm(initialProjectForm);
          setEditingProjectId(null);
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

  async function addProject() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("projects").insert({
      title: projectForm.title,
      slug: projectForm.slug,
      category: projectForm.category || null,
      summary: projectForm.summary,
      gallery: parseGalleryInput(projectForm.galleryInput),
      stack: parseStackInput(projectForm.stackInput),
      year: projectForm.year ? Number(projectForm.year) : null,
      status: projectForm.status,
      featured: projectForm.featured,
      live_url: projectForm.live_url || null,
      repo_url: projectForm.repo_url || null,
      sort_order: Number(projectForm.sort_order || 0),
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setProjectForm(initialProjectForm);
    setSuccessMessage("Project berhasil ditambahkan.");
    showToast("success", "Project berhasil ditambahkan.");
    await loadProjectsPage();
  }

  async function updateProject() {
    if (!editingProjectId) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase
      .from("projects")
      .update({
        title: projectForm.title,
        slug: projectForm.slug,
        category: projectForm.category || null,
        summary: projectForm.summary,
        gallery: parseGalleryInput(projectForm.galleryInput),
        stack: parseStackInput(projectForm.stackInput),
        year: projectForm.year ? Number(projectForm.year) : null,
        status: projectForm.status,
        featured: projectForm.featured,
        live_url: projectForm.live_url || null,
        repo_url: projectForm.repo_url || null,
        sort_order: Number(projectForm.sort_order || 0),
      })
      .eq("id", editingProjectId);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setEditingProjectId(null);
    setProjectForm(initialProjectForm);
    setSuccessMessage("Project berhasil diperbarui.");
    showToast("success", "Project berhasil diperbarui.");
    await loadProjectsPage();
  }

  function startEditingProject(item: ProjectRow) {
    setEditingProjectId(item.id);
    setProjectForm({
      title: item.title,
      slug: item.slug,
      category: item.category ?? "",
      summary: item.summary ?? "",
      galleryInput: stringifyGalleryInput(item.gallery),
      stackInput: item.stack?.join("\n") ?? "",
      year: item.year ? String(item.year) : "",
      status: item.status,
      featured: item.featured,
      live_url: item.live_url ?? "",
      repo_url: item.repo_url ?? "",
      sort_order: String(item.sort_order),
    });
    setSuccessMessage(null);
    setDashboardError(null);
  }

  function cancelProjectEdit() {
    setEditingProjectId(null);
    setProjectForm(initialProjectForm);
  }

  async function removeProject(id: string) {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("projects").delete().eq("id", id);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setSuccessMessage("Project berhasil dihapus.");
    showToast("success", "Project berhasil dihapus.");
    await loadProjectsPage();
  }

  const sidebarItems = [
    { label: "Overview", href: "/admin", isActive: pathname === "/admin" },
    { label: "Stack", href: "/admin/stack", isActive: pathname === "/admin/stack" },
    { label: "Projects", href: "/admin/projects", isActive: pathname === "/admin/projects" },
    {
      label: "Experience",
      href: "/admin/experience",
      isActive: pathname === "/admin/experience",
    },
    { label: "Profile", href: "/admin/profile", isActive: pathname === "/admin/profile" },
    {
      label: "Certificates",
      href: "/admin/certificates",
      isActive: pathname === "/admin/certificates",
    },
    {
      label: "Contact",
      href: "/admin/contact",
      isActive: pathname === "/admin/contact",
    },
  ];

  const recentProjects = projects.slice(0, 4);
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
            <div className="text-[0.92rem] leading-none tracking-[0.02em] font-bold">
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
            href="/admin/projects"
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
          <div className="text-[0.9rem] leading-none tracking-[0.02em] font-bold">
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
          <div className="text-center text-[0.84rem] leading-none tracking-[0.02em] font-bold">
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
              href="/admin/projects"
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
                    subtitle="Masuk ke modul projects menggunakan session Supabase admin yang sama."
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
                    title="Projects Editor"
                    subtitle="Halaman ini sekarang jadi workspace fokus untuk seluruh daftar project portfolio."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Login dengan akun admin Supabase kamu.</p>
                      <p>2. Tambahkan atau edit project di halaman ini.</p>
                      <p>3. Gunakan stack tags dan gallery slides supaya card portfolio lebih kaya.</p>
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
                      <p>1. Jalankan schema Supabase terbaru jika perlu.</p>
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
                            Projects Studio
                          </h1>
                          <p className="mt-2 text-sm leading-7 text-[#7a70aa]">
                            {sessionEmail} • tambah, edit, dan urutkan project yang tampil
                            di portfolio kamu tanpa membuat overview kembali penuh form.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={() => {
                              void loadProjectsPage();
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
                    </div>

                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                      <StatCard label="Total Projects" value={String(projects.length)} />
                      <StatCard
                        label="Published"
                        value={String(projects.filter((item) => item.status === "published").length)}
                      />
                      <StatCard
                        label="Featured"
                        value={String(projects.filter((item) => item.featured).length)}
                      />
                      <StatCard
                        label="Drafts"
                        value={String(projects.filter((item) => item.status === "draft").length)}
                      />
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

                    <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
                      <Panel
                        title="Project Form"
                        subtitle="Editor lengkap untuk project card dan detail visualnya."
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Title">
                            <Input
                              value={projectForm.title}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  title: event.target.value,
                                  slug:
                                    current.slug ||
                                    event.target.value
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, "-")
                                      .replace(/^-|-$/g, ""),
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Slug">
                            <Input
                              value={projectForm.slug}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  slug: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Category">
                            <Input
                              value={projectForm.category}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  category: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Year">
                            <Input
                              value={projectForm.year}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  year: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Status">
                            <Input
                              value={projectForm.status}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  status: event.target.value as "draft" | "published",
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Sort Order">
                            <Input
                              type="number"
                              value={projectForm.sort_order}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  sort_order: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Live URL">
                            <Input
                              value={projectForm.live_url}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  live_url: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Repo URL">
                            <Input
                              value={projectForm.repo_url}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  repo_url: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                        </div>

                        <div className="mt-4 space-y-4">
                          <label className="flex items-center gap-3 text-sm text-[#5f548b]">
                            <input
                              type="checkbox"
                              checked={projectForm.featured}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  featured: event.target.checked,
                                }));
                              }}
                              className="h-4 w-4 rounded border border-[#d9d0ff]"
                            />
                            Featured Project
                          </label>

                          <Field label="Summary">
                            <Textarea
                              value={projectForm.summary}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  summary: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Gallery Slides">
                            <Textarea
                              value={projectForm.galleryInput}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  galleryInput: event.target.value,
                                }));
                              }}
                              placeholder="Dashboard | Content overview | from-[#6f5bf3]/70 via-[#19132f] to-[#090909]"
                            />
                          </Field>
                          <Field label="Stack Tags">
                            <Textarea
                              value={projectForm.stackInput}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  stackInput: event.target.value,
                                }));
                              }}
                              placeholder={`Next.js\nSupabase\nTypeScript`}
                            />
                          </Field>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-sm text-[#8d83bc]">
                            {editingProjectId
                              ? "Mode edit aktif untuk project terpilih."
                              : `${projects.length} project tersedia.`}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {editingProjectId && (
                              <button
                                type="button"
                                onClick={cancelProjectEdit}
                                disabled={isSaving}
                                className={secondaryButtonClass}
                              >
                                Cancel Edit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (editingProjectId) {
                                  void updateProject();
                                  return;
                                }

                                void addProject();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              {editingProjectId ? "Update Project" : "Add Project"}
                            </button>
                          </div>
                        </div>
                      </Panel>

                      <div className="space-y-5">
                        <Panel
                          title="Recent Projects"
                          subtitle="Snapshot cepat dari project terbaru di library."
                        >
                          {recentProjects.length === 0 ? (
                            <p className="text-sm text-[#8d83bc]">Belum ada project.</p>
                          ) : (
                            <div className="space-y-3">
                              {recentProjects.map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-[1.35rem] bg-[#f7f4ff] px-4 py-4"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div>
                                      <p className="text-sm text-[#2f245b]">{item.title}</p>
                                      <p className="mt-1 text-xs text-[#8f86bc]">
                                        {item.category || "General"} • {item.year ?? "-"} •{" "}
                                        {item.status}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        startEditingProject(item);
                                      }}
                                      className="text-sm text-[#5b33d6]"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Panel>

                        <Panel
                          title="Project Library"
                          subtitle="Daftar lengkap project yang bisa kamu edit atau hapus."
                        >
                          {projects.length === 0 ? (
                            <p className="text-sm text-[#8d83bc]">Belum ada project.</p>
                          ) : (
                            <div className="space-y-3">
                              {projects.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-col gap-3 rounded-[1.4rem] bg-[#f7f4ff] p-4"
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                      <p className="text-lg text-[#2f245b]">{item.title}</p>
                                      <p className="text-sm text-[#6f63a0]">{item.slug}</p>
                                      <p className="text-sm leading-7 text-[#786ea6]">
                                        {item.summary || "Tanpa summary."}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          startEditingProject(item);
                                        }}
                                        className="text-sm text-[#5b33d6]"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          void removeProject(item.id);
                                        }}
                                        className="text-sm text-[#5b33d6]"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {(item.stack ?? []).map((stackItem) => (
                                      <span
                                        key={`${item.id}-${stackItem}`}
                                        className="rounded-full bg-white px-3 py-1 text-xs text-[#5b33d6]"
                                      >
                                        {stackItem}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Panel>
                      </div>
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
