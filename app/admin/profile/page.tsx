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

type ProfileRow = {
  id: string;
  auth_user_id: string | null;
  display_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: string | null;
  cv_url: string | null;
  contact_email: string | null;
  contact_cta_text: string | null;
  footer_summary: string | null;
  is_public: boolean;
  updated_at: string;
};

type ToastState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

const supabase = createBrowserSupabaseClient();

const initialProfileForm = {
  display_name: "",
  headline: "",
  bio: "",
  location: "",
  availability: "Available for work",
  cv_url: "",
  contact_email: "",
  contact_cta_text: "",
  footer_summary: "",
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

export default function AdminProfilePage() {
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
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileForm, setProfileForm] = useState(initialProfileForm);

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

  async function loadProfilePage() {
    setDashboardError(null);

    const { data, error } = await supabase
      .from("profile")
      .select(
        "id, auth_user_id, display_name, headline, bio, location, availability, cv_url, contact_email, contact_cta_text, footer_summary, is_public, updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setDashboardError(
        `${error.message}. Pastikan schema Supabase terbaru sudah dijalankan.`,
      );
      return;
    }

    const nextProfile = data ?? null;
    setProfile(nextProfile);

    if (nextProfile) {
      setProfileForm({
        display_name: nextProfile.display_name ?? "",
        headline: nextProfile.headline ?? "",
        bio: nextProfile.bio ?? "",
        location: nextProfile.location ?? "",
        availability: nextProfile.availability ?? "Available for work",
        cv_url: nextProfile.cv_url ?? "",
        contact_email: nextProfile.contact_email ?? "",
        contact_cta_text: nextProfile.contact_cta_text ?? "",
        footer_summary: nextProfile.footer_summary ?? "",
      });
    } else {
      setProfileForm(initialProfileForm);
    }
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
          void loadProfilePage();
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
            void loadProfilePage();
          }
        } else {
          setIsAdmin(false);
          setAuthMessage(null);
          setDashboardError(null);
          setSuccessMessage(null);
          setProfile(null);
          setProfileForm(initialProfileForm);
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

  async function saveProfile() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const payload = {
      ...profileForm,
      auth_user_id: (await supabase.auth.getUser()).data.user?.id ?? null,
    };

    const result = profile
      ? await supabase.from("profile").update(payload).eq("id", profile.id)
      : await supabase.from("profile").insert(payload);

    setIsSaving(false);

    if (result.error) {
      setDashboardError(result.error.message);
      showToast("error", result.error.message);
      return;
    }

    setSuccessMessage("Profile berhasil disimpan.");
    showToast("success", "Profile berhasil disimpan.");
    await loadProfilePage();
  }

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
        <AdminSidebar settingsHref="/admin/profile" />

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
                    subtitle="Masuk ke modul profile menggunakan session Supabase admin yang sama."
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
                    title="Profile Editor"
                    subtitle="Halaman ini sekarang jadi editor fokus untuk identitas utama portfolio kamu."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Login dengan akun admin Supabase kamu.</p>
                      <p>2. Edit konten profile lalu simpan.</p>
                      <p>3. Cek perubahan di landing page tanpa kembali ke overview.</p>
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
                            Profile Studio
                          </h1>
                          <p className="mt-2 text-sm leading-7 text-[#7a70aa]">
                            {sessionEmail} • edit identitas utama, headline, contact CTA,
                            dan footer summary portfolio kamu di satu halaman fokus.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={() => {
                              void loadProfilePage();
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
                      <StatCard label="Profile Row" value={profile ? "Ready" : "New"} />
                      <StatCard
                        label="Visibility"
                        value={profile?.is_public ? "Public" : "Private"}
                      />
                      <StatCard
                        label="Contact"
                        value={profileForm.contact_email ? "Connected" : "Empty"}
                      />
                      <StatCard
                        label="CV"
                        value={profileForm.cv_url ? "Attached" : "Missing"}
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

                    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
                      <Panel
                        title="Profile Form"
                        subtitle="Seluruh field penting untuk hero, contact, dan footer ada di sini."
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Display Name">
                            <Input
                              value={profileForm.display_name}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  display_name: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Headline">
                            <Input
                              value={profileForm.headline}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  headline: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Location">
                            <Input
                              value={profileForm.location}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  location: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Availability">
                            <Input
                              value={profileForm.availability}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  availability: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Contact Email">
                            <Input
                              value={profileForm.contact_email}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  contact_email: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="CV URL">
                            <Input
                              value={profileForm.cv_url}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  cv_url: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                        </div>

                        <div className="mt-4 space-y-4">
                          <Field label="Bio">
                            <Textarea
                              value={profileForm.bio}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  bio: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Contact CTA Text">
                            <Textarea
                              value={profileForm.contact_cta_text}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  contact_cta_text: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                          <Field label="Footer Summary">
                            <Textarea
                              value={profileForm.footer_summary}
                              onChange={(event) => {
                                setProfileForm((current) => ({
                                  ...current,
                                  footer_summary: event.target.value,
                                }));
                              }}
                            />
                          </Field>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-sm text-[#8d83bc]">
                            {profile
                              ? `Updated ${new Date(profile.updated_at).toLocaleString("id-ID")}`
                              : "Belum ada profile row."}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              void saveProfile();
                            }}
                            disabled={isSaving}
                            className={primaryButtonClass}
                          >
                            Save Profile
                          </button>
                        </div>
                      </Panel>

                      <div className="space-y-5">
                        <Panel
                          title="Live Snapshot"
                          subtitle="Preview ringkas dari konten profile yang sedang aktif."
                        >
                          <div className="space-y-4">
                            <div className="rounded-[1.4rem] bg-[#f7f4ff] p-4">
                              <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#8f86bc]">
                                Hero Name
                              </p>
                              <p className="mt-3 text-2xl tracking-[-0.04em] text-[#2f245b]">
                                {profileForm.display_name || "Akbar Rayyan"}
                              </p>
                              <p className="mt-2 text-sm text-[#786ea6]">
                                {profileForm.headline || "Fullstack Developer"}
                              </p>
                            </div>
                            <div className="rounded-[1.4rem] bg-[#f7f4ff] p-4">
                              <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#8f86bc]">
                                Contact & Footer
                              </p>
                              <p className="mt-3 text-sm leading-7 text-[#786ea6]">
                                {profileForm.contact_email || "Belum ada contact email"}
                              </p>
                              <p className="mt-2 text-sm leading-7 text-[#786ea6]">
                                {profileForm.footer_summary || "Belum ada footer summary"}
                              </p>
                            </div>
                          </div>
                        </Panel>

                        <Panel
                          title="Publishing Notes"
                          subtitle="Checklist cepat sebelum profile kamu tampil sempurna di landing page."
                        >
                          <div className="space-y-3">
                            <div className="rounded-[1.35rem] bg-[#f7f4ff] px-4 py-4">
                              <p className="text-sm text-[#2f245b]">
                                {profileForm.display_name
                                  ? "Display name sudah terisi."
                                  : "Isi display name terlebih dahulu."}
                              </p>
                            </div>
                            <div className="rounded-[1.35rem] bg-[#f7f4ff] px-4 py-4">
                              <p className="text-sm text-[#2f245b]">
                                {profileForm.contact_email
                                  ? "Contact email siap dipakai di section Contact."
                                  : "Tambahkan contact email untuk section Contact."}
                              </p>
                            </div>
                            <div className="rounded-[1.35rem] bg-[#f7f4ff] px-4 py-4">
                              <p className="text-sm text-[#2f245b]">
                                {profileForm.cv_url
                                  ? "CV URL sudah terhubung."
                                  : "Tambahkan CV URL agar tombol Download CV aktif penuh."}
                              </p>
                            </div>
                          </div>
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
