"use client";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useCallback, useEffect, useState } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type ExperienceRow = {
  id: string;
  period: string;
  title: string;
  company: string;
  summary: string | null;
  highlights: string[] | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

type ToastState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

const supabase = createBrowserSupabaseClient();

const initialExperienceForm = {
  period: "",
  title: "",
  company: "",
  summary: "",
  highlightsInput: "",
  sort_order: "0",
};

function parseHighlightsInput(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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

export default function AdminExperiencePage() {
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
  const [experienceRows, setExperienceRows] = useState<ExperienceRow[]>([]);
  const [experienceForm, setExperienceForm] = useState(initialExperienceForm);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null,
  );

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

  async function loadExperiencePage() {
    setDashboardError(null);

    const { data, error } = await supabase
      .from("experience")
      .select(
        "id, period, title, company, summary, highlights, sort_order, is_active, updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setDashboardError(
        `${error.message}. Pastikan schema Supabase terbaru sudah dijalankan.`,
      );
      return;
    }

    setExperienceRows(data ?? []);
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
          void loadExperiencePage();
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
            void loadExperiencePage();
          }
        } else {
          setIsAdmin(false);
          setAuthMessage(null);
          setDashboardError(null);
          setSuccessMessage(null);
          setExperienceRows([]);
          setExperienceForm(initialExperienceForm);
          setEditingExperienceId(null);
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

  async function addExperience() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("experience").insert({
      period: experienceForm.period,
      title: experienceForm.title,
      company: experienceForm.company,
      summary: experienceForm.summary || null,
      highlights: parseHighlightsInput(experienceForm.highlightsInput),
      sort_order: Number(experienceForm.sort_order || 0),
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setEditingExperienceId(null);
    setExperienceForm(initialExperienceForm);
    setSuccessMessage("Experience berhasil ditambahkan.");
    showToast("success", "Experience berhasil ditambahkan.");
    await loadExperiencePage();
  }

  async function updateExperience() {
    if (!editingExperienceId) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase
      .from("experience")
      .update({
        period: experienceForm.period,
        title: experienceForm.title,
        company: experienceForm.company,
        summary: experienceForm.summary || null,
        highlights: parseHighlightsInput(experienceForm.highlightsInput),
        sort_order: Number(experienceForm.sort_order || 0),
      })
      .eq("id", editingExperienceId);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setEditingExperienceId(null);
    setExperienceForm(initialExperienceForm);
    setSuccessMessage("Experience berhasil diperbarui.");
    showToast("success", "Experience berhasil diperbarui.");
    await loadExperiencePage();
  }

  function startEditingExperience(item: ExperienceRow) {
    setEditingExperienceId(item.id);
    setExperienceForm({
      period: item.period,
      title: item.title,
      company: item.company,
      summary: item.summary ?? "",
      highlightsInput: item.highlights?.join("\n") ?? "",
      sort_order: String(item.sort_order),
    });
    setSuccessMessage(null);
    setDashboardError(null);
  }

  function cancelExperienceEdit() {
    setEditingExperienceId(null);
    setExperienceForm(initialExperienceForm);
  }

  async function toggleExperienceActive(item: ExperienceRow) {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase
      .from("experience")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setSuccessMessage("Status experience berhasil diperbarui.");
    showToast("success", "Status experience berhasil diperbarui.");
    await loadExperiencePage();
  }

  async function removeExperience(id: string) {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("experience").delete().eq("id", id);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      showToast("error", error.message);
      return;
    }

    setSuccessMessage("Experience berhasil dihapus.");
    showToast("success", "Experience berhasil dihapus.");
    await loadExperiencePage();
  }

  const activeCount = experienceRows.filter((item) => item.is_active).length;
  const highlightCount = experienceRows.reduce(
    (total, item) => total + (item.highlights?.length ?? 0),
    0,
  );
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

      <div className="flex h-screen w-full flex-col overflow-hidden bg-[#5429cf] shadow-[0_24px_90px_rgba(96,70,193,0.16)] lg:grid lg:grid-cols-[108px_1fr]">
        <AdminSidebar settingsHref="/admin/experience" />

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
                    subtitle="Masuk ke modul experience menggunakan session Supabase admin yang sama."
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
                    title="Experience Editor"
                    subtitle="Halaman ini sekarang jadi workspace fokus untuk seluruh timeline pengalaman."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Login dengan akun admin Supabase kamu.</p>
                      <p>2. Tambahkan atau edit experience di halaman ini.</p>
                      <p>3. Atur highlights dan urutan tampil agar timeline overlay lebih rapi.</p>
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
                            Experience Studio
                          </h1>
                          <p className="mt-2 text-sm leading-7 text-[#7a70aa]">
                            {sessionEmail} • atur timeline pengalaman, posisi, nama PT,
                            summary, highlights, dan urutan tampil dalam satu workspace fokus.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={() => {
                              void loadExperiencePage();
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
                      <StatCard label="Total Experience" value={String(experienceRows.length)} />
                      <StatCard label="Active" value={String(activeCount)} />
                      <StatCard label="Highlights" value={String(highlightCount)} />
                      <StatCard
                        label="Companies"
                        value={String(new Set(experienceRows.map((item) => item.company)).size)}
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
                        title="Experience Form"
                        subtitle="Editor lengkap untuk timeline experience yang tampil di overlay."
                      >
                        {editingExperienceId && (
                          <div className="mb-4 rounded-[1.25rem] bg-[#f4f0ff] px-4 py-3 text-sm text-[#6d5ad7]">
                            Editing selected experience. Simpan perubahan atau batalkan
                            untuk kembali ke mode tambah.
                          </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Period">
                            <Input
                              value={experienceForm.period}
                              onChange={(event) => {
                                setExperienceForm((current) => ({
                                  ...current,
                                  period: event.target.value,
                                }));
                              }}
                              placeholder="2025 - Present"
                            />
                          </Field>
                          <Field label="Title">
                            <Input
                              value={experienceForm.title}
                              onChange={(event) => {
                                setExperienceForm((current) => ({
                                  ...current,
                                  title: event.target.value,
                                }));
                              }}
                              placeholder="Fullstack Developer Intern"
                            />
                          </Field>
                          <Field label="Company / PT">
                            <Input
                              value={experienceForm.company}
                              onChange={(event) => {
                                setExperienceForm((current) => ({
                                  ...current,
                                  company: event.target.value,
                                }));
                              }}
                              placeholder="PT Nama Perusahaan"
                            />
                          </Field>
                          <Field label="Sort Order">
                            <Input
                              type="number"
                              value={experienceForm.sort_order}
                              onChange={(event) => {
                                setExperienceForm((current) => ({
                                  ...current,
                                  sort_order: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                        </div>

                        <div className="mt-4 space-y-4">
                          <Field label="Summary">
                            <Textarea
                              value={experienceForm.summary}
                              onChange={(event) => {
                                setExperienceForm((current) => ({
                                  ...current,
                                  summary: event.target.value,
                                }));
                              }}
                              placeholder="Deskripsi singkat pengalaman kerja atau magang."
                            />
                          </Field>
                          <Field label="Highlights">
                            <Textarea
                              value={experienceForm.highlightsInput}
                              onChange={(event) => {
                                setExperienceForm((current) => ({
                                  ...current,
                                  highlightsInput: event.target.value,
                                }));
                              }}
                              placeholder={`Next.js\nSupabase\nREST API\nUI Systems`}
                            />
                          </Field>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-sm text-[#8d83bc]">
                            {editingExperienceId
                              ? "Mode edit aktif untuk experience terpilih."
                              : `${experienceRows.length} experience tersedia.`}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {editingExperienceId && (
                              <button
                                type="button"
                                onClick={cancelExperienceEdit}
                                disabled={isSaving}
                                className={secondaryButtonClass}
                              >
                                Cancel Edit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (editingExperienceId) {
                                  void updateExperience();
                                  return;
                                }

                                void addExperience();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              {editingExperienceId
                                ? "Update Experience"
                                : "Add Experience"}
                            </button>
                          </div>
                        </div>
                      </Panel>

                      <div className="space-y-5">
                        <Panel
                          title="Timeline Snapshot"
                          subtitle="Ringkasan cepat dari timeline yang akan tampil di overlay."
                        >
                          {experienceRows.length === 0 ? (
                            <p className="text-sm text-[#8d83bc]">Belum ada experience.</p>
                          ) : (
                            <div className="space-y-3">
                              {experienceRows.slice(0, 3).map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-[1.35rem] bg-[#f7f4ff] px-4 py-4"
                                >
                                  <p className="text-sm text-[#2f245b]">{item.title}</p>
                                  <p className="mt-1 text-xs text-[#8f86bc]">
                                    {item.company} • {item.period}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </Panel>

                        <Panel
                          title="Experience Library"
                          subtitle="Daftar lengkap experience yang bisa kamu edit, sembunyikan, atau hapus."
                        >
                          {experienceRows.length === 0 ? (
                            <p className="text-sm text-[#8d83bc]">Belum ada experience.</p>
                          ) : (
                            <div className="space-y-3">
                              {experienceRows.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-col gap-3 rounded-[1.4rem] bg-[#f7f4ff] p-4"
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                      <p className="text-lg text-[#2f245b]">{item.title}</p>
                                      <p className="text-sm text-[#6f63a0]">
                                        {item.company} • {item.period}
                                      </p>
                                      <p className="text-sm leading-7 text-[#786ea6]">
                                        {item.summary || "Tanpa summary."}
                                      </p>
                                      <p className="text-xs uppercase tracking-[0.12em] text-[#8f86bc]">
                                        Order {item.sort_order} •{" "}
                                        {item.is_active ? "Active" : "Hidden"}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          startEditingExperience(item);
                                        }}
                                        className="text-sm text-[#5b33d6]"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          void toggleExperienceActive(item);
                                        }}
                                        className="text-sm text-[#5b33d6]"
                                      >
                                        {item.is_active ? "Hide" : "Show"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          void removeExperience(item.id);
                                        }}
                                        className="text-sm text-[#5b33d6]"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {(item.highlights ?? []).map((highlight) => (
                                      <span
                                        key={`${item.id}-${highlight}`}
                                        className="rounded-full bg-white px-3 py-1 text-xs text-[#5b33d6]"
                                      >
                                        {highlight}
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
