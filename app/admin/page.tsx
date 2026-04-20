"use client";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useState } from "react";

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
  is_public: boolean;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  gallery: unknown;
  year: number | null;
  status: "draft" | "published";
  featured: boolean;
  updated_at: string;
};

type StackItemRow = {
  id: string;
  name: string;
  category: string;
  icon_url: string;
  is_active: boolean;
  updated_at: string;
};

type SocialLinkRow = {
  id: string;
  label: string;
  url: string;
  icon_name: string | null;
  is_active: boolean;
  updated_at: string;
};

type CourseworkRow = {
  id: string;
  label: string;
  is_active: boolean;
  updated_at: string;
};

type ExperienceRow = {
  id: string;
  period: string;
  title: string;
  company: string;
  summary: string | null;
  highlights: string[] | null;
  is_active: boolean;
  updated_at: string;
};

type CertificateRow = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image_url: string;
  is_active: boolean;
  updated_at: string;
};

const supabase = createBrowserSupabaseClient();

const initialProfileForm = {
  display_name: "",
  headline: "",
  bio: "",
  location: "",
  availability: "Available for work",
  cv_url: "",
};

const initialProjectForm = {
  title: "",
  slug: "",
  category: "",
  summary: "",
  galleryInput: "",
  year: "",
  status: "draft",
};

const initialStackForm = {
  name: "",
  category: "",
  icon_url: "",
};

const initialSocialForm = {
  label: "",
  url: "",
  icon_name: "",
};

const initialEducationForm = {
  institution: "",
  degree: "",
  graduation_label: "",
};

const initialCourseworkForm = {
  label: "",
};

const initialExperienceForm = {
  period: "",
  title: "",
  company: "",
  summary: "",
  highlightsInput: "",
};

const initialCertificateForm = {
  title: "",
  issuer: "",
  year: "",
  image_url: "",
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

  if (label === "Content") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path
          d="M12 4a8 8 0 1 0 8 8h-8V4Z"
          fill="currentColor"
          opacity=".92"
        />
        <path d="M12 4a8 8 0 0 1 8 8h-8V4Z" fill="currentColor" opacity=".35" />
      </svg>
    );
  }

  if (label === "Media") {
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

  if (label === "Messages") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.35rem] w-[1.35rem]" fill="none">
        <path
          d="M6 7.5h12a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 18 16.5H11l-3.5 3v-3H6A1.5 1.5 0 0 1 4.5 15V9A1.5 1.5 0 0 1 6 7.5Z"
          fill="currentColor"
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

export default function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [stackItems, setStackItems] = useState<StackItemRow[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);
  const [courseworkRows, setCourseworkRows] = useState<CourseworkRow[]>([]);
  const [experienceRows, setExperienceRows] = useState<ExperienceRow[]>([]);
  const [certificateRows, setCertificateRows] = useState<CertificateRow[]>([]);

  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [stackForm, setStackForm] = useState(initialStackForm);
  const [socialForm, setSocialForm] = useState(initialSocialForm);
  const [educationForm, setEducationForm] = useState(initialEducationForm);
  const [courseworkForm, setCourseworkForm] = useState(initialCourseworkForm);
  const [experienceForm, setExperienceForm] = useState(initialExperienceForm);
  const [certificateForm, setCertificateForm] = useState(initialCertificateForm);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null,
  );
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(
    null,
  );

  async function checkAdminAccess() {
    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      setDashboardError(error.message);
      return false;
    }

    return Boolean(data);
  }

  async function loadDashboard() {
    setDashboardError(null);

    const [
      profileResult,
      projectsResult,
      stackResult,
      socialResult,
      educationResult,
      courseworkResult,
      experienceResult,
      certificateResult,
    ] =
      await Promise.all([
        supabase
          .from("profile")
          .select(
            "id, auth_user_id, display_name, headline, bio, location, availability, cv_url, is_public, updated_at",
          )
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("projects")
          .select(
            "id, title, slug, category, summary, gallery, year, status, featured, updated_at",
          )
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("stack_items")
          .select("id, name, category, icon_url, is_active, updated_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("social_links")
          .select("id, label, url, icon_name, is_active, updated_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("education")
          .select("id, institution, degree, graduation_label, is_active, updated_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("coursework")
          .select("id, label, is_active, updated_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("experience")
          .select(
            "id, period, title, company, summary, highlights, is_active, updated_at",
          )
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("certificates")
          .select("id, title, issuer, year, image_url, is_active, updated_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
      ]);

    const firstError =
      profileResult.error ??
      projectsResult.error ??
      stackResult.error ??
      socialResult.error ??
      educationResult.error ??
      courseworkResult.error ??
      experienceResult.error ??
      certificateResult.error;

    if (firstError) {
      setDashboardError(
        `${firstError.message}. Jalankan dulu file supabase/schema.sql di SQL Editor Supabase.`,
      );
      return;
    }

    const nextProfile = profileResult.data ?? null;
    setProfile(nextProfile);
    setProjects(projectsResult.data ?? []);
    setStackItems(stackResult.data ?? []);
    setSocialLinks(socialResult.data ?? []);
    setCourseworkRows(courseworkResult.data ?? []);
    setExperienceRows(experienceResult.data ?? []);
    setCertificateRows(certificateResult.data ?? []);

    if (nextProfile) {
      setProfileForm({
        display_name: nextProfile.display_name ?? "",
        headline: nextProfile.headline ?? "",
        bio: nextProfile.bio ?? "",
        location: nextProfile.location ?? "",
        availability: nextProfile.availability ?? "Available for work",
        cv_url: nextProfile.cv_url ?? "",
      });
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
          void loadDashboard();
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
            void loadDashboard();
          }
        } else {
          setIsAdmin(false);
          setAuthMessage(null);
          setDashboardError(null);
          setSuccessMessage(null);
          setIsAuthLoading(false);
          setProfile(null);
          setProjects([]);
          setStackItems([]);
          setSocialLinks([]);
          setCourseworkRows([]);
          setExperienceRows([]);
          setCertificateRows([]);
        }
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSuccessMessage(null);
    setAuthMessage("Session ditutup.");
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
      return;
    }

    setSuccessMessage("Profile berhasil disimpan.");
    await loadDashboard();
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
      year: projectForm.year ? Number(projectForm.year) : null,
      status: projectForm.status,
      featured: false,
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setProjectForm(initialProjectForm);
    setSuccessMessage("Project baru berhasil ditambahkan.");
    await loadDashboard();
  }

  async function addStackItem() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("stack_items").insert({
      name: stackForm.name,
      category: stackForm.category,
      icon_url: stackForm.icon_url,
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setStackForm(initialStackForm);
    setSuccessMessage("Stack item berhasil ditambahkan.");
    await loadDashboard();
  }

  async function addSocialLink() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("social_links").insert({
      label: socialForm.label,
      url: socialForm.url,
      icon_name: socialForm.icon_name || null,
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setSocialForm(initialSocialForm);
    setSuccessMessage("Social link berhasil ditambahkan.");
    await loadDashboard();
  }

  async function addEducation() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("education").insert({
      institution: educationForm.institution,
      degree: educationForm.degree,
      graduation_label: educationForm.graduation_label || null,
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setEducationForm(initialEducationForm);
    setSuccessMessage("Education berhasil ditambahkan.");
    await loadDashboard();
  }

  async function addCoursework() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("coursework").insert({
      label: courseworkForm.label,
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setCourseworkForm(initialCourseworkForm);
    setSuccessMessage("Coursework berhasil ditambahkan.");
    await loadDashboard();
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
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setEditingExperienceId(null);
    setExperienceForm(initialExperienceForm);
    setSuccessMessage("Experience berhasil ditambahkan.");
    await loadDashboard();
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
      })
      .eq("id", editingExperienceId);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setEditingExperienceId(null);
    setExperienceForm(initialExperienceForm);
    setSuccessMessage("Experience berhasil diperbarui.");
    await loadDashboard();
  }

  function startEditingExperience(item: ExperienceRow) {
    setEditingExperienceId(item.id);
    setExperienceForm({
      period: item.period,
      title: item.title,
      company: item.company,
      summary: item.summary ?? "",
      highlightsInput: item.highlights?.join("\n") ?? "",
    });
    setSuccessMessage(null);
    setDashboardError(null);
  }

  function cancelExperienceEdit() {
    setEditingExperienceId(null);
    setExperienceForm(initialExperienceForm);
  }

  async function addCertificate() {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from("certificates").insert({
      title: certificateForm.title,
      issuer: certificateForm.issuer,
      year: certificateForm.year,
      image_url: certificateForm.image_url,
    });

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setEditingCertificateId(null);
    setCertificateForm(initialCertificateForm);
    setSuccessMessage("Certificate berhasil ditambahkan.");
    await loadDashboard();
  }

  async function updateCertificate() {
    if (!editingCertificateId) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase
      .from("certificates")
      .update({
        title: certificateForm.title,
        issuer: certificateForm.issuer,
        year: certificateForm.year,
        image_url: certificateForm.image_url,
      })
      .eq("id", editingCertificateId);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setEditingCertificateId(null);
    setCertificateForm(initialCertificateForm);
    setSuccessMessage("Certificate berhasil diperbarui.");
    await loadDashboard();
  }

  function startEditingCertificate(item: CertificateRow) {
    setEditingCertificateId(item.id);
    setCertificateForm({
      title: item.title,
      issuer: item.issuer,
      year: item.year,
      image_url: item.image_url,
    });
    setSuccessMessage(null);
    setDashboardError(null);
  }

  function cancelCertificateEdit() {
    setEditingCertificateId(null);
    setCertificateForm(initialCertificateForm);
  }

  async function removeRow(
    table:
      | "projects"
      | "stack_items"
      | "social_links"
      | "education"
      | "coursework"
      | "experience"
      | "certificates",
    id: string,
  ) {
    setIsSaving(true);
    setSuccessMessage(null);
    setDashboardError(null);

    const { error } = await supabase.from(table).delete().eq("id", id);

    setIsSaving(false);

    if (error) {
      setDashboardError(error.message);
      return;
    }

    setSuccessMessage("Data berhasil dihapus.");
    await loadDashboard();
  }

  const recentContent = projects.slice(0, 5);
  const sidebarItems = [
    { label: "Overview" },
    { label: "Content" },
    { label: "Media" },
    { label: "Messages" },
  ];
  const primaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full bg-[#16c1e7] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50";
  const secondaryButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full border border-[#e7e0ff] bg-white px-5 text-sm font-medium text-[#493495] transition hover:border-[#cfc2ff]";

  return (
    <main
      className="h-screen overflow-hidden bg-[#eeebff] text-[#2f245b]"
      style={{ fontFamily: "var(--font-bungee)" }}
    >
      <div className="grid h-screen w-full overflow-hidden bg-[#5429cf] shadow-[0_24px_90px_rgba(96,70,193,0.16)] lg:grid-cols-[108px_1fr]">
        <aside className="z-0 flex h-screen flex-col px-4 py-8 text-[#14c1e7]">
          <div
            className="text-center text-[0.84rem] leading-none tracking-[0.02em] font-bold"
            style={{ fontFamily: "var(--font-bungee)" }}
          >
            AKBAR
          </div>
          <div className="mt-10 flex flex-1 flex-col items-center gap-6">
            {sidebarItems.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={`flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-[1rem] transition ${
                  index === 0
                    ? "bg-[#4520b8] text-[#12d3ef] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-[#12d3ef] hover:bg-white/8"
                }`}
                aria-label={item.label}
              >
                <SidebarGlyph label={item.label} />
              </button>
            ))}
          </div>
          <div className="flex justify-center pt-3">
            <button
              type="button"
              className="flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-[1rem] text-[#12d3ef] transition hover:bg-white/8"
              aria-label="Settings"
            >
              <SidebarGlyph label="Settings" />
            </button>
          </div>
        </aside>

        <div className="relative z-10 -ml-2 h-screen overflow-y-auto rounded-l-[2.2rem] bg-white">
          <section className="px-5 py-4 sm:px-6">
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
                    subtitle="Masuk ke dashboard Supabase. Tampilan ini sudah mengikuti visual dashboard terang dengan panel lembut seperti referensi."
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
                    title="Setup"
                    subtitle="Jalankan schema terbaru agar kolom category, education, dan coursework tersedia."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Buka SQL Editor di Supabase.</p>
                      <p>2. Jalankan ulang `supabase/schema.sql`.</p>
                      <p>3. Login kembali ke dashboard.</p>
                    </div>
                  </Panel>
                </div>
              ) : !isAdmin ? (
                <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                  <Panel
                    title="Access Denied"
                    subtitle="User ini sudah login, tetapi belum punya role admin. Dashboard dan CRUD tidak akan dibuka sebelum email kamu dimasukkan ke whitelist admin."
                  >
                    <div className="space-y-4 text-sm leading-7 text-[#786ea6]">
                      <p>
                        Signed in as <span className="font-semibold text-[#2f245b]">{sessionEmail}</span>
                      </p>
                      <div className="rounded-[1.4rem] bg-[#f4f0ff] p-4 font-mono text-[0.8rem] leading-7 text-[#4d3d8d]">
                        {`insert into public.admin_users (email)\nvalues ('${sessionEmail}');`}
                      </div>
                      <div className="flex flex-wrap gap-3">
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
                    </div>
                  </Panel>

                  <Panel
                    title="Whitelist"
                    subtitle="Proteksi admin sekarang memakai tabel admin_users + fungsi is_admin(), jadi bukan sekadar user authenticated biasa."
                  >
                    <div className="space-y-3 text-sm leading-7 text-[#786ea6]">
                      <p>1. Jalankan ulang `supabase/schema.sql` di SQL Editor.</p>
                      <p>2. Insert email admin ke tabel `public.admin_users`.</p>
                      <p>3. Refresh halaman atau login ulang.</p>
                    </div>
                  </Panel>
                </div>
              ) : (
                <>
                  <section className="space-y-5">
                    <div className="rounded-[1.8rem] bg-[#fbfaff] p-4 shadow-[0_14px_32px_rgba(92,57,221,0.06)] sm:p-5">
                      <h1 className="text-[1.8rem] tracking-[-0.04em] text-[#2f245b] sm:text-[2.35rem]">
                        Hey {profileForm.display_name || "Akbar"}, Welcome to Cloud 👋
                      </h1>
                      <p className="mt-2 text-sm leading-7 text-[#7a70aa]">
                        {sessionEmail} • dashboard konten untuk profile, projects, stack,
                        social links, education, coursework, experience, dan certificates.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <StatCard label="Projects" value={String(projects.length)} />
                      <StatCard label="Stack" value={String(stackItems.length)} />
                      <StatCard label="Experience" value={String(experienceRows.length)} />
                      <StatCard label="Certificates" value={String(certificateRows.length)} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] bg-[#f7f4ff] px-5 py-4">
                      <p className="text-sm text-[#786ea6]">
                        {sessionEmail} • connected to {process.env.NEXT_PUBLIC_SUPABASE_URL} •{" "}
                        {socialLinks.length} social links
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className={secondaryButtonClass}
                          onClick={() => {
                            void loadDashboard();
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

                    <Panel
                      title="Recent Content"
                      subtitle="Tampilan daftar konten terbaru dibuat seperti tabel dashboard pada referensi, tapi tetap memakai data Supabase project yang asli."
                    >
                      {recentContent.length === 0 ? (
                        <p className="text-sm text-[#8d83bc]">Belum ada project.</p>
                      ) : (
                        <div className="overflow-hidden rounded-[1.6rem] bg-[#f7f4ff]">
                          <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.9fr_80px] gap-3 px-4 py-3 text-[0.72rem] uppercase tracking-[0.12em] text-[#8f86bc]">
                            <span>Name</span>
                            <span>Category</span>
                            <span>Year</span>
                            <span>Status</span>
                            <span className="text-right">Action</span>
                          </div>
                          {recentContent.map((item) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.9fr_80px] gap-3 border-t border-white px-4 py-3 text-sm text-[#4c4178]"
                            >
                              <div>
                                <p>{item.title}</p>
                                <p className="text-xs text-[#9a91c4]">{item.slug}</p>
                              </div>
                              <span>{item.category || "General"}</span>
                              <span>{item.year ?? "-"}</span>
                              <span>{item.status}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  void removeRow("projects", item.id);
                                }}
                                className="text-right text-[#5b33d6]"
                              >
                                •••
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Panel>

                    <div className="grid gap-5 xl:grid-cols-2">
                      <Panel
                        title="Profile"
                        subtitle="Edit identitas utama yang tampil di landing page."
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

                      <Panel
                        title="Projects"
                        subtitle="Tambahkan project baru lengkap dengan category dan gallery."
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
                          <Field label="Category">
                            <Input
                              value={projectForm.category}
                              onChange={(event) => {
                                setProjectForm((current) => ({
                                  ...current,
                                  category: event.target.value,
                                }));
                              }}
                              placeholder="Admin Dashboard"
                            />
                          </Field>
                        </div>
                        <div className="mt-4 space-y-4">
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
                        </div>
                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-sm text-[#8d83bc]">{projects.length} project tersedia.</p>
                          <button
                            type="button"
                            onClick={() => {
                              void addProject();
                            }}
                            disabled={isSaving}
                            className={primaryButtonClass}
                          >
                            Add Project
                          </button>
                        </div>
                      </Panel>

                      <Panel
                        title="Stack & Social"
                        subtitle="Kelola stack item dan social link dalam satu area cepat."
                      >
                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="space-y-4">
                            <Field label="Stack Name">
                              <Input
                                value={stackForm.name}
                                onChange={(event) => {
                                  setStackForm((current) => ({
                                    ...current,
                                    name: event.target.value,
                                  }));
                                }}
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
                              />
                            </Field>
                            <button
                              type="button"
                              onClick={() => {
                                void addStackItem();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              Add Stack
                            </button>
                          </div>

                          <div className="space-y-4">
                            <Field label="Label">
                              <Input
                                value={socialForm.label}
                                onChange={(event) => {
                                  setSocialForm((current) => ({
                                    ...current,
                                    label: event.target.value,
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Icon Name">
                              <Input
                                value={socialForm.icon_name}
                                onChange={(event) => {
                                  setSocialForm((current) => ({
                                    ...current,
                                    icon_name: event.target.value,
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="URL">
                              <Input
                                value={socialForm.url}
                                onChange={(event) => {
                                  setSocialForm((current) => ({
                                    ...current,
                                    url: event.target.value,
                                  }));
                                }}
                              />
                            </Field>
                            <button
                              type="button"
                              onClick={() => {
                                void addSocialLink();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              Add Social
                            </button>
                          </div>
                        </div>
                      </Panel>

                      <Panel
                        title="Education & Coursework"
                        subtitle="Kelola panel kanan overlay."
                      >
                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="space-y-4">
                            <Field label="Institution">
                              <Input
                                value={educationForm.institution}
                                onChange={(event) => {
                                  setEducationForm((current) => ({
                                    ...current,
                                    institution: event.target.value,
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Degree">
                              <Input
                                value={educationForm.degree}
                                onChange={(event) => {
                                  setEducationForm((current) => ({
                                    ...current,
                                    degree: event.target.value,
                                  }));
                                }}
                              />
                            </Field>
                            <Field label="Graduation Label">
                              <Input
                                value={educationForm.graduation_label}
                                onChange={(event) => {
                                  setEducationForm((current) => ({
                                    ...current,
                                    graduation_label: event.target.value,
                                  }));
                                }}
                              />
                            </Field>
                            <button
                              type="button"
                              onClick={() => {
                                void addEducation();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              Add Education
                            </button>
                          </div>
                          <div className="space-y-4">
                            <Field label="Coursework Label">
                              <Input
                                value={courseworkForm.label}
                                onChange={(event) => {
                                  setCourseworkForm({
                                    label: event.target.value,
                                  });
                                }}
                                placeholder="Backend Development"
                              />
                            </Field>
                            <button
                              type="button"
                              onClick={() => {
                                void addCoursework();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              Add Coursework
                            </button>
                          </div>
                        </div>
                      </Panel>

                      <Panel
                        title="Experience"
                        subtitle="Kelola timeline experience untuk section overlay, termasuk nama PT, posisi, periode, summary, dan highlights."
                      >
                        {editingExperienceId && (
                          <div className="mb-4 rounded-[1.25rem] bg-[#f4f0ff] px-4 py-3 text-sm text-[#6d5ad7]">
                            Editing selected experience. Simpan perubahan atau
                            batalkan untuk kembali ke mode tambah.
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
                              placeholder="2025 — Present"
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
                            {experienceRows.length} experience tersedia.
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

                      <Panel
                        title="Certificates"
                        subtitle="Kelola gallery certificate untuk section overlay, termasuk judul, issuer, tahun, dan URL gambar."
                      >
                        {editingCertificateId && (
                          <div className="mb-4 rounded-[1.25rem] bg-[#f4f0ff] px-4 py-3 text-sm text-[#6d5ad7]">
                            Editing selected certificate. Simpan perubahan atau
                            batalkan untuk kembali ke mode tambah.
                          </div>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Title">
                            <Input
                              value={certificateForm.title}
                              onChange={(event) => {
                                setCertificateForm((current) => ({
                                  ...current,
                                  title: event.target.value,
                                }));
                              }}
                              placeholder="Fullstack Web Development"
                            />
                          </Field>
                          <Field label="Issuer">
                            <Input
                              value={certificateForm.issuer}
                              onChange={(event) => {
                                setCertificateForm((current) => ({
                                  ...current,
                                  issuer: event.target.value,
                                }));
                              }}
                              placeholder="Professional Training"
                            />
                          </Field>
                          <Field label="Year">
                            <Input
                              value={certificateForm.year}
                              onChange={(event) => {
                                setCertificateForm((current) => ({
                                  ...current,
                                  year: event.target.value,
                                }));
                              }}
                              placeholder="2025"
                            />
                          </Field>
                          <Field label="Image URL">
                            <Input
                              value={certificateForm.image_url}
                              onChange={(event) => {
                                setCertificateForm((current) => ({
                                  ...current,
                                  image_url: event.target.value,
                                }));
                              }}
                              placeholder="https://... atau /certificates/file.svg"
                            />
                          </Field>
                        </div>
                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-sm text-[#8d83bc]">
                            {certificateRows.length} certificate tersedia.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {editingCertificateId && (
                              <button
                                type="button"
                                onClick={cancelCertificateEdit}
                                disabled={isSaving}
                                className={secondaryButtonClass}
                              >
                                Cancel Edit
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (editingCertificateId) {
                                  void updateCertificate();
                                  return;
                                }

                                void addCertificate();
                              }}
                              disabled={isSaving}
                              className={primaryButtonClass}
                            >
                              {editingCertificateId
                                ? "Update Certificate"
                                : "Add Certificate"}
                            </button>
                          </div>
                        </div>
                      </Panel>
                    </div>

                    <Panel
                      title="Experience List"
                      subtitle="Daftar experience yang saat ini tampil di timeline overlay."
                    >
                      {experienceRows.length === 0 ? (
                        <p className="text-sm text-[#8d83bc]">Belum ada experience.</p>
                      ) : (
                        <div className="space-y-3">
                          {experienceRows.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col gap-3 rounded-[1.4rem] bg-[#f7f4ff] p-4 sm:flex-row sm:items-start sm:justify-between"
                            >
                              <div className="space-y-1">
                                <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#8f86bc]">
                                  {item.period}
                                </p>
                                <p className="text-lg text-[#2f245b]">{item.title}</p>
                                <p className="text-sm text-[#6f63a0]">{item.company}</p>
                                <p className="text-sm leading-7 text-[#786ea6]">
                                  {item.summary || "Tanpa summary."}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
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
                                    void removeRow("experience", item.id);
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

                    <Panel
                      title="Certificate List"
                      subtitle="Daftar certificate yang saat ini tampil di gallery overlay."
                    >
                      {certificateRows.length === 0 ? (
                        <p className="text-sm text-[#8d83bc]">Belum ada certificate.</p>
                      ) : (
                        <div className="space-y-3">
                          {certificateRows.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col gap-3 rounded-[1.4rem] bg-[#f7f4ff] p-4 sm:flex-row sm:items-start sm:justify-between"
                            >
                              <div className="space-y-1">
                                <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#8f86bc]">
                                  {item.year}
                                </p>
                                <p className="text-lg text-[#2f245b]">{item.title}</p>
                                <p className="text-sm text-[#6f63a0]">{item.issuer}</p>
                                <p className="text-sm leading-7 text-[#786ea6]">
                                  {item.image_url}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    startEditingCertificate(item);
                                  }}
                                  className="text-sm text-[#5b33d6]"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    void removeRow("certificates", item.id);
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
