"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import * as THREE from "three";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const greetings = [
  "selamat datang",
  "welcome",
  "benvenuto",
  "환영합니다",
  "欢迎",
];

const menuItems = [
  "Home",
  "About",
  "Selected Work",
  "Experience",
  "Certificate",
  "Contact",
];

const fallbackSocialItems = [
  { label: "LinkedIn", url: "https://linkedin.com" },
  { label: "Instagram", url: "https://instagram.com" },
  { label: "Github", url: "https://github.com" },
  { label: "Youtube", url: "https://youtube.com" },
];

const fallbackAboutDescription =
  "I am a fresh graduate in Software Engineering with a strong passion for building innovative solutions in web, backend systems, and AI. With over 3 years of practical experience through projects, intensive learning, and professional exposure, I have built a solid foundation in modern application development, problem-solving, and innovation.";
const fallbackStackSections: Array<{
  title: string;
  items: Array<{
    name: string;
    icon: string;
    className?: string;
  }>;
}> = [
  {
    title: "Languages",
    items: [
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        name: "PHP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
    ],
  },
  {
    title: "Frameworks & Libraries",
    items: [
      {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "Bootstrap",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
        className: "invert",
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Express",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
        className: "invert",
      },
      {
        name: "GSAP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/greensock/greensock-original.svg",
      },
      {
        name: "Three.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg",
        className: "invert",
      },
    ],
  },
  {
    title: "Databases & ORM",
    items: [
      {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "Redis",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
      },
      {
        name: "Prisma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
      },
      {
        name: "Sequelize",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sequelize/sequelize-original.svg",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
      },
    ],
  },
];

const fallbackProjectItems = [
  {
    index: "01",
    title: "Portfolio CMS",
    year: "2026",
    category: "Admin Dashboard",
    summary:
      "A content management dashboard for updating profile, stack logos, and highlighted portfolio sections with a clean editorial workflow.",
    stack: ["Next.js", "Supabase", "TypeScript", "Tailwind"],
    accent: "from-[#6f5bf3]/30 via-[#6f5bf3]/10 to-transparent",
    liveUrl: "#",
    screens: [
      {
        eyebrow: "Dashboard",
        title: "Content overview",
        surfaceClass:
          "from-[#6f5bf3]/70 via-[#19132f] to-[#090909]",
      },
      {
        eyebrow: "Editor",
        title: "Stack manager",
        surfaceClass:
          "from-[#8b7cff]/70 via-[#1c1734] to-[#090909]",
      },
      {
        eyebrow: "Media",
        title: "Project upload",
        surfaceClass:
          "from-[#5d49df]/70 via-[#120f24] to-[#090909]",
      },
    ],
  },
  {
    index: "02",
    title: "Project Showcase Platform",
    year: "2026",
    category: "Fullstack Web App",
    summary:
      "A responsive project listing experience with rich case studies, stack metadata, and modular sections designed for future admin-managed content.",
    stack: ["React", "Node.js", "PostgreSQL", "Prisma"],
    accent: "from-[#4ec7d3]/28 via-[#4ec7d3]/10 to-transparent",
    liveUrl: "#",
    screens: [
      {
        eyebrow: "Showcase",
        title: "Landing grid",
        surfaceClass:
          "from-[#4ec7d3]/65 via-[#102126] to-[#090909]",
      },
      {
        eyebrow: "Case Study",
        title: "Detail layout",
        surfaceClass:
          "from-[#34a9b4]/68 via-[#102126] to-[#090909]",
      },
      {
        eyebrow: "Insights",
        title: "Tech breakdown",
        surfaceClass:
          "from-[#5fd4df]/64 via-[#112126] to-[#090909]",
      },
    ],
  },
  {
    index: "03",
    title: "API Monitoring Space",
    year: "2025",
    category: "Backend System",
    summary:
      "A backend-focused workspace for tracking API health, service uptime, and deployment notes with a compact interface and clear operational states.",
    stack: ["Express", "Redis", "MySQL", "Docker"],
    accent: "from-[#f0b65a]/26 via-[#f0b65a]/10 to-transparent",
    liveUrl: "#",
    screens: [
      {
        eyebrow: "Monitor",
        title: "Status board",
        surfaceClass:
          "from-[#f0b65a]/70 via-[#261a0d] to-[#090909]",
      },
      {
        eyebrow: "Logs",
        title: "Request stream",
        surfaceClass:
          "from-[#e59f38]/64 via-[#24180b] to-[#090909]",
      },
      {
        eyebrow: "Alerts",
        title: "Incident feed",
        surfaceClass:
          "from-[#ffca70]/64 via-[#261a0d] to-[#090909]",
      },
    ],
  },
];

const fallbackProfile = {
  displayName: "Akbar Rayyan",
  headline:
    "Fullstack Developer — focused on building fast, reliable, and scalable digital products.",
  bio: fallbackAboutDescription,
  location: "Indonesia",
  availability: "Available for work",
  cvUrl: "#about",
  contactEmail: "akbarrayyan182@gmail.com",
  contactCtaText:
    "Available for freelance work, internships, collaboration, and backend or fullstack opportunities. If you have an idea or a role in mind, feel free to reach out.",
  footerSummary:
    "Fullstack developer focused on building fast, reliable, and scalable digital products.",
};

const fallbackEducation = {
  institution: "Politeknik Negeri Indramayu",
  degree: "Teknik Informatika",
  graduationLabel: "Graduated Oct - 2025",
};

const fallbackCoursework = [
  "Web Programming",
  "Backend Development",
  "AI & ML Enthusiast",
  "UI/UX Design",
];

const fallbackExperienceItems = [
  {
    period: "2025 — Present",
    title: "Freelance Fullstack Developer",
    company: "Independent Projects",
    summary:
      "Designing and shipping web applications, backend services, and admin dashboards with a focus on performance, clean architecture, and scalable interfaces.",
    highlights: ["Next.js", "Supabase", "REST APIs", "UI Systems"],
  },
  {
    period: "2024 — 2025",
    title: "Backend & Product Builder",
    company: "Personal Product Exploration",
    summary:
      "Built experimental platforms for portfolio CMS, API monitoring, and content workflows while strengthening database design, authentication, and deployment practices.",
    highlights: ["Node.js", "PostgreSQL", "Prisma", "Docker"],
  },
  {
    period: "2022 — 2024",
    title: "Software Engineering Learner",
    company: "Academic & Intensive Practice",
    summary:
      "Developed a strong foundation through practical coursework, self-driven learning, and hands-on projects covering web development, backend systems, and application problem-solving.",
    highlights: ["Web Apps", "Backend Logic", "Database Design", "AI Basics"],
  },
];

const fallbackCertificateItems = [
  {
    title: "Fullstack Web Development",
    issuer: "Professional Training",
    year: "2025",
    imageSrc: "/certificates/certificate-01.svg",
  },
  {
    title: "Backend API Engineering",
    issuer: "Technical Program",
    year: "2025",
    imageSrc: "/certificates/certificate-02.svg",
  },
  {
    title: "UI/UX & Product Thinking",
    issuer: "Creative Workshop",
    year: "2024",
    imageSrc: "/certificates/certificate-03.svg",
  },
];

type StackSection = (typeof fallbackStackSections)[number];
type ProjectItem = (typeof fallbackProjectItems)[number];
type SocialItem = (typeof fallbackSocialItems)[number];
type ProfileContent = typeof fallbackProfile;
type EducationContent = typeof fallbackEducation;
type ExperienceItem = (typeof fallbackExperienceItems)[number];
type CertificateItem = (typeof fallbackCertificateItems)[number];

type ProfileRow = {
  display_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: string | null;
  cv_url: string | null;
  contact_email: string | null;
  contact_cta_text: string | null;
  footer_summary: string | null;
};

type StackItemRow = {
  name: string;
  category: string;
  icon_url: string;
};

type SocialLinkRow = {
  label: string;
  url: string;
};

type EducationRow = {
  institution: string;
  degree: string;
  graduation_label: string | null;
};

type CourseworkRow = {
  label: string;
};

type ExperienceRow = {
  period: string;
  title: string;
  company: string;
  summary: string | null;
  highlights: string[] | null;
};

type CertificateRow = {
  title: string;
  issuer: string;
  year: string;
  image_url: string;
};

type ProjectRow = {
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  cover_image_url: string | null;
  gallery: unknown;
  stack: string[] | null;
  year: number | null;
  live_url: string | null;
};

type ProjectScreen = ProjectItem["screens"][number];

const fallbackProjectSurfaces: ProjectScreen[] = fallbackProjectItems.flatMap(
  (item) => item.screens,
);

function inferStackClass(iconUrl: string) {
  const normalized = iconUrl.toLowerCase();

  if (normalized.includes("nextjs") || normalized.includes("threejs")) {
    return "invert";
  }

  return undefined;
}

function titleCaseCategory(category: string) {
  return category
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildStackSections(rows: StackItemRow[] | null | undefined): StackSection[] {
  if (!rows || rows.length === 0) {
    return fallbackStackSections;
  }

  const grouped = rows.reduce<Record<string, StackSection["items"]>>(
    (accumulator, row) => {
      const key = row.category || "Other";
      accumulator[key] ??= [];
      accumulator[key].push({
        name: row.name,
        icon: row.icon_url,
        className: inferStackClass(row.icon_url),
      });
      return accumulator;
    },
    {},
  );

  const sections = Object.entries(grouped).map(([category, items]) => ({
    title: titleCaseCategory(category),
    items,
  }));

  return sections.length > 0 ? sections : fallbackStackSections;
}

function normalizeGallery(gallery: unknown, projectIndex: number): ProjectScreen[] {
  if (!Array.isArray(gallery) || gallery.length === 0) {
    return fallbackProjectItems[projectIndex % fallbackProjectItems.length].screens;
  }

  const fallbackScreens =
    fallbackProjectItems[projectIndex % fallbackProjectItems.length].screens;

  return gallery
    .map((item, screenIndex) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const fallbackScreen =
        fallbackScreens[screenIndex % fallbackScreens.length] ??
        fallbackProjectSurfaces[screenIndex % fallbackProjectSurfaces.length];

      return {
        eyebrow:
          typeof record.eyebrow === "string"
            ? record.eyebrow
            : fallbackScreen.eyebrow,
        title:
          typeof record.title === "string" ? record.title : fallbackScreen.title,
        surfaceClass:
          typeof record.surfaceClass === "string"
            ? record.surfaceClass
            : fallbackScreen.surfaceClass,
      };
    })
    .filter((item): item is ProjectScreen => item !== null);
}

function buildProjectItems(rows: ProjectRow[] | null | undefined): ProjectItem[] {
  if (!rows || rows.length === 0) {
    return fallbackProjectItems;
  }

  return rows.map((row, index) => {
    const fallbackItem = fallbackProjectItems[index % fallbackProjectItems.length];

    return {
      index: String(index + 1).padStart(2, "0"),
      title: row.title,
      year: row.year ? String(row.year) : fallbackItem.year,
      category: row.category || fallbackItem.category,
      summary: row.summary ?? fallbackItem.summary,
      stack: row.stack && row.stack.length > 0 ? row.stack : fallbackItem.stack,
      accent: fallbackItem.accent,
      screens: normalizeGallery(row.gallery, index),
      liveUrl: row.live_url ?? "#",
    };
  });
}

function buildProfileContent(profile: ProfileRow | null | undefined): ProfileContent {
  if (!profile) {
    return fallbackProfile;
  }

  return {
    displayName: profile.display_name || fallbackProfile.displayName,
    headline: profile.headline || fallbackProfile.headline,
    bio: profile.bio || fallbackProfile.bio,
    location: profile.location || fallbackProfile.location,
    availability: profile.availability || fallbackProfile.availability,
    cvUrl: profile.cv_url || fallbackProfile.cvUrl,
    contactEmail: profile.contact_email || fallbackProfile.contactEmail,
    contactCtaText:
      profile.contact_cta_text || fallbackProfile.contactCtaText,
    footerSummary: profile.footer_summary || fallbackProfile.footerSummary,
  };
}

function buildSocialItems(rows: SocialLinkRow[] | null | undefined): SocialItem[] {
  if (!rows || rows.length === 0) {
    return fallbackSocialItems;
  }

  return rows.map((row) => ({
    label: row.label,
    url: row.url,
  }));
}

function buildEducationContent(
  rows: EducationRow[] | null | undefined,
): EducationContent {
  const firstRow = rows?.[0];

  if (!firstRow) {
    return fallbackEducation;
  }

  return {
    institution: firstRow.institution || fallbackEducation.institution,
    degree: firstRow.degree || fallbackEducation.degree,
    graduationLabel:
      firstRow.graduation_label || fallbackEducation.graduationLabel,
  };
}

function buildCourseworkItems(rows: CourseworkRow[] | null | undefined) {
  if (!rows || rows.length === 0) {
    return fallbackCoursework;
  }

  return rows.map((row) => row.label);
}

function buildExperienceItems(
  rows: ExperienceRow[] | null | undefined,
): ExperienceItem[] {
  if (!rows || rows.length === 0) {
    return fallbackExperienceItems;
  }

  return rows.map((row, index) => {
    const fallbackItem =
      fallbackExperienceItems[index % fallbackExperienceItems.length];

    return {
      period: row.period || fallbackItem.period,
      title: row.title || fallbackItem.title,
      company: row.company || fallbackItem.company,
      summary: row.summary || fallbackItem.summary,
      highlights:
        row.highlights && row.highlights.length > 0
          ? row.highlights
          : fallbackItem.highlights,
    };
  });
}

function buildCertificateItems(
  rows: CertificateRow[] | null | undefined,
): CertificateItem[] {
  if (!rows || rows.length === 0) {
    return fallbackCertificateItems;
  }

  return rows.map((row, index) => {
    const fallbackItem =
      fallbackCertificateItems[index % fallbackCertificateItems.length];

    return {
      title: row.title || fallbackItem.title,
      issuer: row.issuer || fallbackItem.issuer,
      year: row.year || fallbackItem.year,
      imageSrc: row.image_url || fallbackItem.imageSrc,
    };
  });
}

const GREETING_INTERVAL_MS = 1600;
const LAST_GREETING_HOLD_MS = 260;

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const heroItem = {
  hidden: {
    opacity: 0,
    y: 36,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const backgroundBands = [
  {
    className: "left-[-10%] top-[-6%] h-40 w-[70vw] rotate-[18deg]",
    duration: 18,
    delay: 0,
  },
  {
    className: "right-[-12%] top-[12%] h-44 w-[78vw] -rotate-[24deg]",
    duration: 22,
    delay: 0.8,
  },
  {
    className: "left-[-18%] top-[44%] h-52 w-[88vw] rotate-[10deg]",
    duration: 24,
    delay: 0.4,
  },
  {
    className: "right-[-16%] bottom-[8%] h-40 w-[72vw] -rotate-[14deg]",
    duration: 20,
    delay: 1.2,
  },
];

function StackGlyph({
  name,
  icon,
  className,
}: Readonly<{
  name: string;
  icon: string;
  className?: string;
}>) {
  return (
    <div className="flex h-28 min-w-28 items-center justify-center px-2">
      <Image
        src={icon}
        alt={name}
        width={96}
        height={96}
        unoptimized
        className={`h-20 w-20 object-contain sm:h-24 sm:w-24 ${className ?? ""}`}
      />
    </div>
  );
}

const supabase = createBrowserSupabaseClient();

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileContent, setProfileContent] =
    useState<ProfileContent>(fallbackProfile);
  const [socialItems, setSocialItems] =
    useState<SocialItem[]>(fallbackSocialItems);
  const [stackSections, setStackSections] =
    useState<StackSection[]>(fallbackStackSections);
  const [projectItems, setProjectItems] =
    useState<ProjectItem[]>(fallbackProjectItems);
  const [educationContent, setEducationContent] =
    useState<EducationContent>(fallbackEducation);
  const [courseworkItems, setCourseworkItems] =
    useState<string[]>(fallbackCoursework);
  const [experienceItems, setExperienceItems] =
    useState<ExperienceItem[]>(fallbackExperienceItems);
  const [certificateItems, setCertificateItems] =
    useState<CertificateItem[]>(fallbackCertificateItems);
  const [overlayVisitCount, setOverlayVisitCount] = useState(0);
  const [projectSlideIndexes, setProjectSlideIndexes] = useState(() =>
    fallbackProjectItems.map(() => 0),
  );

  const introRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<HTMLDivElement | null>(null);
  const overlaySectionRef = useRef<HTMLElement | null>(null);
  const rightOverlayRef = useRef<HTMLDivElement | null>(null);
  const experienceSectionRef = useRef<HTMLElement | null>(null);
  const greetingStageRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressValueRef = useRef<HTMLSpanElement | null>(null);

  const aboutWords = useMemo(
    () => profileContent.bio.split(" "),
    [profileContent.bio],
  );
  const displayNameParts = profileContent.displayName.split(" ");
  const primaryName = displayNameParts[0] ?? fallbackProfile.displayName;
  const secondaryName =
    displayNameParts.slice(1).join(" ") || displayNameParts[0] || "";
  const primarySocialLinks = socialItems.slice(0, 3);
  const roleTitle =
    profileContent.headline.split("—")[0]?.trim() || "Fullstack Developer";
  const { scrollYProgress: overlayProgress } = useScroll({
    target: overlaySectionRef,
    offset: ["start end", "start start"],
  });
  const isRightOverlayInView = useInView(rightOverlayRef, {
    once: false,
    amount: 0.25,
  });
  const isExperienceInView = useInView(experienceSectionRef, {
    once: false,
    amount: 0.3,
  });

  const springConfig = {
    stiffness: 72,
    damping: 22,
    mass: 0.6,
  };

  const overlayTranslateY = useSpring(
    useTransform(overlayProgress, [0, 1], [96, 0]),
    springConfig,
  );
  const overlayScale = useSpring(
    useTransform(overlayProgress, [0, 1], [0.975, 1]),
    springConfig,
  );
  const overlayOpacity = useSpring(
    useTransform(overlayProgress, [0, 1], [0.72, 1]),
    springConfig,
  );
  const overlayRadius = useSpring(
    useTransform(overlayProgress, [0, 1], [48, 24]),
    springConfig,
  );
  const heroTranslateY = useSpring(
    useTransform(overlayProgress, [0, 1], [0, -32]),
    springConfig,
  );
  const heroScale = useSpring(
    useTransform(overlayProgress, [0, 1], [1, 0.985]),
    springConfig,
  );
  const heroOpacity = useSpring(
    useTransform(overlayProgress, [0, 0.3, 1], [1, 0.22, 0.04]),
    springConfig,
  );
  const heroDimOpacity = useSpring(
    useTransform(overlayProgress, [0, 0.45, 1], [0, 0.38, 0.62]),
    springConfig,
  );
  const isOverlayReplay = overlayVisitCount > 1;

  const overlayColumnVariant = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: isOverlayReplay ? 32 : 54,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: isOverlayReplay ? 0.68 : 0.9,
          ease: [0.16, 1, 0.3, 1] as const,
          staggerChildren: isOverlayReplay ? 0.08 : 0.12,
          delayChildren: isOverlayReplay ? 0.04 : 0.08,
        },
      },
    }),
    [isOverlayReplay],
  );

  const overlayItemVariant = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: isOverlayReplay ? 18 : 26,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: isOverlayReplay ? 0.56 : 0.72,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      },
    }),
    [isOverlayReplay],
  );

  const overlayTextGroupVariant = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: isOverlayReplay ? 0.04 : 0.06,
          delayChildren: isOverlayReplay ? 0.12 : 0.22,
        },
      },
    }),
    [isOverlayReplay],
  );

  const overlayTextWordVariant = useMemo(
    () => ({
      hidden: {
        opacity: 1,
        color: "rgba(255,255,255,0.12)",
      },
      show: {
        opacity: 1,
        color: "rgba(255,255,255,0.98)",
        transition: {
          duration: isOverlayReplay ? 0.58 : 0.8,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      },
    }),
    [isOverlayReplay],
  );

  const overlayMaskBoxVariant = useMemo(
    () => ({
      hidden: {
        clipPath: "inset(0 100% 0 0 round 0px)",
      },
      show: {
        clipPath: "inset(0 0% 0 0 round 0px)",
        transition: {
          duration: isOverlayReplay ? 0.72 : 0.95,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      },
    }),
    [isOverlayReplay],
  );

  const overlayMaskTextVariant = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        x: isOverlayReplay ? -18 : -34,
      },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          duration: isOverlayReplay ? 0.5 : 0.72,
          delay: isOverlayReplay ? 0.08 : 0.14,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      },
    }),
    [isOverlayReplay],
  );

  useEffect(() => {
    if (isIntroFinished) {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.touchAction = "none";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isIntroFinished]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.9 : 1.05,
      smoothWheel: true,
      gestureOrientation: "vertical",
    });

    let frameId = 0;

    const update = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!threeRef.current || isIntroFinished) {
      return;
    }

    const container = threeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.15));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const particleCount = prefersReducedMotion ? 40 : 72;
    const positions = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 24;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: "#d8dee9",
      size: 0.07,
      transparent: true,
      opacity: 0.35,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const glowGeometry = new THREE.PlaneGeometry(18, 18, 1, 1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#243041",
      transparent: true,
      opacity: 0.16,
    });

    const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
    glowPlane.position.z = -4;
    scene.add(glowPlane);

    const clock = new THREE.Clock();

    let frameId = 0;

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      particles.rotation.z = elapsed * 0.035;
      particles.rotation.x = Math.sin(elapsed * 0.12) * 0.08;
      particles.position.y = Math.sin(elapsed * 0.32) * 0.12;
      glowPlane.material.opacity = 0.1 + Math.sin(elapsed * 0.45) * 0.03;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    frameId = window.requestAnimationFrame(renderFrame);

    const handleResize = () => {
      if (!container) {
        return;
      }

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isIntroFinished, prefersReducedMotion]);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      const [
        profileResult,
        stackResult,
        projectResult,
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
              "display_name, headline, bio, location, availability, cv_url, contact_email, contact_cta_text, footer_summary",
            )
            .eq("is_public", true)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("stack_items")
            .select("name, category, icon_url")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
          supabase
            .from("projects")
            .select(
              "title, slug, category, summary, cover_image_url, gallery, stack, year, live_url",
            )
            .eq("status", "published")
            .order("sort_order", { ascending: true })
            .order("year", { ascending: false }),
          supabase
            .from("social_links")
            .select("label, url")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
          supabase
            .from("education")
            .select("institution, degree, graduation_label")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .limit(1),
          supabase
            .from("coursework")
            .select("label")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
          supabase
            .from("experience")
            .select("period, title, company, summary, highlights")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false }),
          supabase
            .from("certificates")
            .select("title, issuer, year, image_url")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false }),
        ]);

      if (!isMounted) {
        return;
      }

      if (!profileResult.error) {
        setProfileContent(buildProfileContent(profileResult.data));
      }

      if (!stackResult.error) {
        setStackSections(buildStackSections(stackResult.data));
      }

      if (!projectResult.error) {
        const nextProjectItems = buildProjectItems(projectResult.data);
        setProjectItems(nextProjectItems);
        setProjectSlideIndexes(nextProjectItems.map(() => 0));
      }

      if (!socialResult.error) {
        setSocialItems(buildSocialItems(socialResult.data));
      }

      if (!educationResult.error) {
        setEducationContent(buildEducationContent(educationResult.data));
      }

      if (!courseworkResult.error) {
        setCourseworkItems(buildCourseworkItems(courseworkResult.data));
      }

      if (!experienceResult.error) {
        setExperienceItems(buildExperienceItems(experienceResult.data));
      }

      if (!certificateResult.error) {
        setCertificateItems(buildCertificateItems(certificateResult.data));
      }
    }

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mainRef.current || !introRef.current) {
      return;
    }

    gsap.set(mainRef.current, {
      autoAlpha: 0,
      y: 64,
    });

    gsap.fromTo(
      introRef.current.querySelectorAll("[data-intro-chrome]"),
      {
        autoAlpha: 0,
        y: 16,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.out",
      },
    );
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.32,
        ease: "power2.out",
      });
    }

    if (progressValueRef.current) {
      gsap.to(progressValueRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [progress]);

  useEffect(() => {
    if (isIntroFinished) {
      return;
    }

    const introStartedAt = window.performance.now();
    const totalIntroDuration =
      greetings.length * GREETING_INTERVAL_MS + LAST_GREETING_HOLD_MS;

    const greetingTimer = window.setInterval(() => {
      setGreetingIndex((current) => {
        if (current >= greetings.length - 1) {
          window.clearInterval(greetingTimer);
          return current;
        }

        return current + 1;
      });
    }, GREETING_INTERVAL_MS);

    const progressTimer = window.setInterval(() => {
      const elapsed = window.performance.now() - introStartedAt;
      const nextProgress = Math.min(
        Math.round((elapsed / totalIntroDuration) * 100),
        100,
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(progressTimer);
      }
    }, 80);

    return () => {
      window.clearInterval(greetingTimer);
      window.clearInterval(progressTimer);
    };
  }, [isIntroFinished]);

  useEffect(() => {
    if (progress < 100 || !introRef.current || !mainRef.current) {
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "power4.inOut",
      },
      onComplete: () => {
        setIsIntroFinished(true);
      },
    });

    timeline
      .to(
        greetingStageRef.current,
        {
          autoAlpha: 0,
          y: -16,
          duration: 0.35,
        },
        0,
      )
      .to(
        introRef.current.querySelectorAll("[data-intro-bottom]"),
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.28,
          stagger: 0.04,
        },
        0,
      )
      .to(
        introRef.current,
        {
          yPercent: -100,
          duration: 1.35,
        },
        0.2,
      )
      .to(
        mainRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
        },
        0.55,
      );

    return () => {
      timeline.kill();
    };
  }, [progress]);

  useEffect(() => {
    if (projectItems.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setProjectSlideIndexes((current) =>
        current.map(
          (index, projectIndex) =>
            (index + 1) % projectItems[projectIndex].screens.length,
        ),
      );
    }, prefersReducedMotion ? 4200 : 3600);

    return () => {
      window.clearInterval(interval);
    };
  }, [projectItems, prefersReducedMotion]);

  const currentGreeting = greetings[greetingIndex];

  return (
    <main className="bg-[#050505] text-[#f2f2f2]">
      <div
        ref={mainRef}
        className="fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(78,67,91,0.18),transparent_28%),linear-gradient(180deg,#09080b_0%,#0b090d_48%,#09080b_100%)]"
      >
        <div className="portfolio-vignette" />
        <div className="portfolio-noise" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.02))]" />
        {backgroundBands.map((band) => (
          <motion.div
            key={band.className}
            aria-hidden="true"
            className={`portfolio-band ${band.className}`}
            animate={
              isIntroFinished && !prefersReducedMotion
                ? {
                    x: [0, 18, -12, 0],
                    y: [0, -12, 10, 0],
                  }
                : {
                    x: 0,
                    y: 0,
                  }
            }
            transition={
              isIntroFinished && !prefersReducedMotion
                ? {
                    duration: band.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: band.delay,
                  }
                : {
                    duration: 0.3,
                  }
            }
          />
        ))}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: heroDimOpacity }}
        />
        <motion.section
          variants={heroContainer}
          initial="hidden"
          animate={isIntroFinished ? "show" : "hidden"}
          className="pointer-events-auto relative mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-4 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-5 lg:px-10"
          style={{
            y: heroTranslateY,
            scale: heroScale,
            opacity: heroOpacity,
          }}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <motion.div
              variants={heroItem}
              className="flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-white/42 sm:gap-5 sm:text-[0.72rem] sm:tracking-[0.28em]"
            >
              <svg
                viewBox="0 0 120 120"
                className="h-14 w-14 shrink-0 text-white/88 sm:h-20 sm:w-20"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="portfolio-badge-path"
                    d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
                  />
                </defs>
                <text
                  fill="currentColor"
                  fontSize="12"
                  letterSpacing="3.4"
                  fontWeight="600"
                >
                  <textPath href="#portfolio-badge-path">
                    FULLSTACK DEVELOPER • {profileContent.displayName.toUpperCase()} •
                  </textPath>
                </text>
              </svg>
              <div className="hidden items-center gap-6 lg:flex">
                <span>Portfolio 2026</span>
                <span className="h-px w-8 bg-white/16" />
                <span>{profileContent.location}</span>
                <span className="h-px w-8 bg-white/16" />
                <span
                  className="inline-flex items-center gap-2 normal-case tracking-normal text-white/72"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
                  {profileContent.availability}
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={heroItem}
              className="flex items-center gap-3 text-xs font-medium text-white/64 sm:gap-5 sm:text-sm"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              <div className="hidden items-center gap-3 sm:flex">
                <span className="text-white/52">ID</span>
                <span>/</span>
                <span className="text-[#796bff]">EN</span>
              </div>
              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.03] sm:h-20 sm:w-20"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => {
                  setIsMenuOpen((current) => !current);
                }}
              >
                <span className="flex flex-col gap-1.5 sm:gap-2">
                  <span
                    className={`h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen
                        ? "w-5 translate-y-[4px] rotate-45 sm:w-7 sm:translate-y-[5px]"
                        : "w-5 sm:w-7"
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen
                        ? "w-5 -translate-y-[4px] -rotate-45 sm:w-7 sm:-translate-y-[5px]"
                        : "w-5 sm:w-7"
                    }`}
                  />
                </span>
              </button>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 xl:block">
            <motion.p
              variants={heroItem}
              className="portfolio-side-label"
            >
              sys.intt(2026) // loaded
            </motion.p>
          </div>
          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 xl:block">
            <motion.p
              variants={heroItem}
              className="portfolio-side-label portfolio-side-label--right"
            >
              index // akbar.dev
            </motion.p>
          </div>

          <div className="grid flex-1 items-start gap-8 pt-4 sm:gap-10 sm:pt-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5 self-start pt-4 sm:space-y-10 sm:pt-8 lg:pt-10">
              <motion.div
                variants={heroItem}
                className="space-y-2 sm:hidden"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/42">
                  Portfolio 2026
                  <span className="mx-2 text-white/28">—</span>
                  {profileContent.location}
                </p>
                <p
                  className="inline-flex items-center gap-2 text-sm text-white/78"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
                  {profileContent.availability}
                </p>
              </motion.div>
              <motion.h1
                variants={heroItem}
                className="max-w-5xl text-[3.4rem] leading-[0.92] tracking-[-0.03em] text-white sm:text-[6.2rem] sm:leading-[0.9] sm:tracking-[-0.035em] lg:text-[8.4rem] xl:text-[9.8rem]"
                style={{ fontFamily: 'var(--font-bungee)' }}
              >
                {primaryName}
                <br />
                {secondaryName}
              </motion.h1>

              <motion.div
                variants={heroItem}
                className="space-y-1.5 sm:hidden"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <p className="text-[1.05rem] font-semibold text-white/86">
                  {roleTitle}
                </p>
              </motion.div>

              <motion.p
                variants={heroItem}
                className="max-w-md text-sm leading-7 text-white/62 sm:max-w-xl sm:text-[1.05rem] sm:leading-[1.6]"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                {profileContent.headline}
              </motion.p>
            </div>

            <div className="hidden h-full items-start pt-2 lg:grid lg:justify-items-end lg:pt-14 xl:pt-18">
              <motion.div
                variants={heroContainer}
                className="w-full max-w-none space-y-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 text-left backdrop-blur-sm sm:max-w-[21rem] sm:space-y-7 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-right xl:translate-y-8"
                style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
              >
                <motion.div variants={heroItem} className="space-y-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/28">
                    Role
                  </p>
                  <p className="text-[1rem] leading-[1.42] font-semibold text-white/82 sm:text-[1.62rem]">
                    {roleTitle}
                  </p>
                </motion.div>
                <motion.div
                  variants={heroItem}
                  className="h-px w-full bg-white/10 sm:ml-auto sm:max-w-[16rem]"
                />
                <motion.div variants={heroItem} className="space-y-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/28">
                    Focus
                  </p>
                  <p className="text-[1rem] leading-[1.46] font-semibold text-white/72 sm:text-[1.5rem]">
                    {profileContent.location}
                    <br />
                    Building Digital Products
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="grid items-end gap-5 border-b border-white/8 pb-4 sm:gap-8 sm:pb-6 lg:grid-cols-[1fr_auto_1fr]">
            <div className="hidden lg:block" aria-hidden="true" />

            <motion.div
              variants={heroItem}
              className="hidden items-center justify-center gap-3 self-center lg:col-start-2 lg:flex"
            >
              <span className="text-sm uppercase tracking-[0.32em] text-white/30">
                Scroll
              </span>
              <span className="text-white/42">↓</span>
            </motion.div>

            <motion.div
              variants={heroContainer}
              className="flex flex-wrap gap-2 sm:flex-row sm:flex-wrap sm:justify-start sm:gap-3 lg:col-start-3 lg:justify-end"
              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
            >
              <motion.a
                variants={heroItem}
                href={profileContent.cvUrl}
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 sm:h-12 sm:justify-start sm:px-7"
              >
                Download CV
              </motion.a>
              {primarySocialLinks.map((item) => (
                <motion.a
                  key={item.label}
                  variants={heroItem}
                  href={item.url}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/78 transition-colors duration-300 hover:border-white/28 hover:text-white sm:h-12 sm:justify-start sm:px-6"
                >
                  {item.label} ↗
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              variants={heroItem}
              className="flex items-center justify-center gap-3 pt-12 sm:hidden"
            >
              <span className="text-[11px] uppercase tracking-[0.28em] text-white/28">
                Scroll
              </span>
              <span className="text-white/34">↓</span>
            </motion.div>
          </div>
        </motion.section>
      </div>

      <div
        className="pointer-events-none relative z-10 h-screen min-h-screen"
        aria-hidden="true"
      />

      <div className="relative z-20">
        <motion.section
          ref={overlaySectionRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          onViewportEnter={() => {
            setOverlayVisitCount((current) => current + 1);
          }}
          variants={heroContainer}
          id="about"
          className="portfolio-overlay-section relative min-h-screen px-0"
        >
          <motion.div
            className="portfolio-overlay-shell"
            style={{
              y: overlayTranslateY,
              scale: overlayScale,
              opacity: overlayOpacity,
              borderTopLeftRadius: overlayRadius,
              borderTopRightRadius: overlayRadius,
            }}
          >
            <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[1fr_1fr]">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                variants={overlayColumnVariant}
                className="flex min-h-screen bg-black px-6 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16"
              >
                <motion.div
                  variants={overlayColumnVariant}
                  className="flex h-full w-full flex-col justify-start sm:justify-center"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <motion.p
                    variants={overlayItemVariant}
                    className="hidden text-[0.78rem] uppercase tracking-[0.48em] text-[#6f6148] sm:block"
                  >
                    About
                  </motion.p>
                  <motion.h2
                    variants={overlayItemVariant}
                    className="mt-2 max-w-[10ch] text-[2.95rem] leading-[1.02] font-semibold tracking-[-0.06em] text-white sm:mt-12 sm:max-w-[14ch] sm:text-[4.3rem] lg:text-[4.8rem]"
                  >
                    Building things for the web and backend systems.
                  </motion.h2>
                  <motion.div
                    variants={overlayItemVariant}
                    className="mt-9 h-px w-14 bg-white/18 sm:mt-10"
                  />
                  <motion.p
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.45 }}
                    className="mt-12 max-w-none text-[1.02rem] leading-[1.72] text-white/92 sm:mt-14 sm:max-w-[22ch] sm:text-[1.55rem] sm:leading-[1.52] lg:text-[1.85rem]"
                  >
                    <motion.span
                      variants={overlayTextGroupVariant}
                      className="block"
                    >
                      {aboutWords.map((word, index) => (
                        <motion.span
                          key={`${word}-${index}`}
                          variants={overlayTextWordVariant}
                          className="inline-block pr-[0.24em] align-top sm:pr-[0.28em]"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.span>
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div
                ref={rightOverlayRef}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                variants={overlayColumnVariant}
                className="portfolio-blue-panel relative min-h-screen overflow-hidden px-4 py-10 text-black sm:px-10 sm:py-14 lg:px-12 xl:px-16"
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-12%] bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.16),transparent_26%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,0.12),transparent_24%)]"
                  animate={
                    isRightOverlayInView && !prefersReducedMotion
                      ? {
                          x: ["-2%", "4%", "-1%"],
                          y: ["0%", "-3%", "0%"],
                          scale: [1, 1.04, 1],
                        }
                      : {
                          x: "0%",
                          y: "0%",
                          scale: 1,
                        }
                  }
                  transition={
                    isRightOverlayInView && !prefersReducedMotion
                      ? {
                          duration: 15,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : { duration: 0.3 }
                  }
                />
                <motion.div
                  variants={overlayColumnVariant}
                  className="relative flex h-full flex-col justify-start gap-10 sm:gap-18"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  <motion.div variants={overlayItemVariant} className="space-y-5">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-white/80">
                      01 — I Am
                    </p>
                    <motion.div
                      variants={overlayMaskBoxVariant}
                      className="inline-block overflow-hidden bg-black px-4 py-2 sm:px-5 sm:py-3"
                    >
                      <motion.h3
                        variants={overlayMaskTextVariant}
                        className="text-[2rem] leading-[0.94] font-black tracking-[-0.06em] text-[#6f5bf3] sm:text-[4.3rem] lg:text-[5.3rem]"
                      >
                        Fullstack &amp;
                        <br />
                        Backend Dev.
                      </motion.h3>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={overlayItemVariant} className="space-y-5">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-white/80">
                      02 — Education
                    </p>
                    <motion.div
                      variants={overlayMaskBoxVariant}
                      className="inline-block overflow-hidden bg-black px-4 py-2 sm:px-5 sm:py-3"
                    >
                      <motion.h3
                        variants={overlayMaskTextVariant}
                        className="text-[1.5rem] leading-[0.98] font-black tracking-[-0.05em] text-[#6f5bf3] sm:text-[3.35rem] lg:text-[4rem]"
                      >
                        {educationContent.institution}
                      </motion.h3>
                    </motion.div>
                    <div className="space-y-1 text-white/92">
                      <p className="text-[1.05rem] font-semibold sm:text-[1.35rem]">
                        {educationContent.degree}
                      </p>
                      <p className="text-base text-white/72 sm:text-lg">
                        {educationContent.graduationLabel}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={overlayItemVariant} className="space-y-6">
                    <p className="text-[0.78rem] uppercase tracking-[0.46em] text-white/80">
                      03 — Relevant Coursework
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {courseworkItems.map((item) => (
                        <span
                          key={item}
                          className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-[#6f5bf3] sm:px-6 sm:py-3 sm:text-lg"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                </motion.div>
              </motion.div>
            </div>

            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.18 }}
              variants={overlayItemVariant}
              className="bg-black px-4 py-10 text-white sm:px-10 sm:py-12 lg:px-12 xl:px-16"
            >
              <div className="space-y-10 sm:space-y-14">
                <h2
                  className="text-4xl font-black tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  STACK
                </h2>

                {stackSections.map((section, sectionIndex) => (
                  <div key={section.title} className="space-y-5 sm:space-y-8">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78 sm:px-5 sm:py-3 sm:text-[12px] sm:tracking-[0.16em]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#6f5bf3]" />
                      {section.title}
                    </div>

                    <div className="stack-marquee">
                      <motion.div
                        className="stack-marquee__track"
                        animate={
                          prefersReducedMotion
                            ? { x: "0%" }
                            : { x: ["0%", "-50%"] }
                        }
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.3 }
                            : {
                                duration: 34 + sectionIndex * 5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }
                        }
                      >
                        {[...section.items, ...section.items].map((item, index) => (
                          <div
                            key={`${section.title}-${item.name}-${index}`}
                            className="stack-marquee__item"
                          >
                            <StackGlyph
                              name={item.name}
                              icon={item.icon}
                              className={item.className}
                            />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.18 }}
              variants={overlayItemVariant}
              id="projects"
              className="border-t border-white/8 bg-[#050505] px-4 py-12 text-white sm:px-10 sm:py-16 lg:px-12 xl:px-16"
            >
              <div className="space-y-10 sm:space-y-14">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-4">
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      05 — Projects
                    </p>
                    <h2
                      className="max-w-[9ch] text-[2.8rem] leading-[0.92] tracking-[-0.08em] text-white sm:text-[4.9rem] lg:text-[6.6rem]"
                      style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                    >
                      Selected Work & Product Ideas.
                    </h2>
                  </div>

                  <p
                    className="max-w-xl text-sm leading-7 text-white/58 sm:text-[1rem] sm:leading-8"
                    style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                  >
                    A preview of the project area that will later be connected to
                    Supabase, so portfolio entries can be managed directly from an
                    admin dashboard.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  {projectItems.map((project, index) => (
                    <motion.article
                      key={project.title}
                      variants={overlayItemVariant}
                      transition={{ delay: 0.08 + index * 0.08 }}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                    >
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-80 transition-transform duration-500 group-hover:scale-[1.03]`}
                      />
                      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent)] opacity-50" />

                      <div className="relative flex h-full flex-col gap-8">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {project.index}
                          </div>
                          <div
                            className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/60"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {project.year}
                          </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/40 p-2">
                          <div className="mb-2 flex items-center gap-1.5 px-1.5">
                            <span className="h-2 w-2 rounded-full bg-white/26" />
                            <span className="h-2 w-2 rounded-full bg-white/18" />
                            <span className="h-2 w-2 rounded-full bg-white/12" />
                          </div>

                          <div className="relative aspect-[1.2/1] overflow-hidden rounded-[1rem] bg-[#070707]">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`${project.title}-${projectSlideIndexes[index]}`}
                                initial={{ opacity: 0, x: 18 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -18 }}
                                transition={{
                                  duration: prefersReducedMotion ? 0.45 : 0.62,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className={`absolute inset-0 bg-gradient-to-br ${project.screens[projectSlideIndexes[index]].surfaceClass}`}
                              >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%)]" />
                                <div className="absolute inset-x-4 top-4 h-7 rounded-full border border-white/8 bg-black/28" />
                                <div className="absolute left-4 top-16 h-[42%] w-[42%] rounded-[1rem] border border-white/10 bg-black/28" />
                                <div className="absolute right-4 top-16 h-[22%] w-[42%] rounded-[1rem] border border-white/10 bg-black/32" />
                                <div className="absolute right-4 top-[calc(16%+5.5rem)] h-[28%] w-[42%] rounded-[1rem] border border-white/10 bg-black/22" />
                                <div className="absolute bottom-4 left-4 right-4 h-[20%] rounded-[1rem] border border-white/10 bg-black/26" />

                                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                                  <div className="space-y-2">
                                    <p
                                      className="text-[0.65rem] uppercase tracking-[0.22em] text-white/46"
                                      style={{ fontFamily: "var(--font-bungee)" }}
                                    >
                                      {
                                        project.screens[projectSlideIndexes[index]]
                                          .eyebrow
                                      }
                                    </p>
                                    <p
                                      className="text-lg leading-none tracking-[-0.04em] text-white sm:text-[1.4rem]"
                                      style={{
                                        fontFamily:
                                          '"Helvetica Neue", Arial, sans-serif',
                                      }}
                                    >
                                      {
                                        project.screens[projectSlideIndexes[index]]
                                          .title
                                      }
                                    </p>
                                  </div>

                                  <div className="flex gap-1.5">
                                    {project.screens.map((screen, screenIndex) => (
                                      <span
                                        key={`${project.title}-${screen.eyebrow}`}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${
                                          screenIndex === projectSlideIndexes[index]
                                            ? "w-8 bg-white"
                                            : "w-3 bg-white/24"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div
                            className="inline-flex rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/64"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {project.category}
                          </div>

                          <div className="space-y-4">
                            <h3
                              className="max-w-[10ch] text-[2rem] leading-[0.92] tracking-[-0.06em] text-white sm:text-[2.45rem]"
                              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                            >
                              {project.title}
                            </h3>
                            <p
                              className="text-sm leading-7 text-white/68 sm:text-[0.98rem] sm:leading-8"
                              style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                            >
                              {project.summary}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto space-y-5">
                          <div className="flex flex-wrap gap-2.5">
                            {project.stack.map((item) => (
                              <span
                                key={item}
                                className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[0.72rem] uppercase tracking-[0.08em] text-white/76"
                                style={{ fontFamily: "var(--font-bungee)" }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                          <div
                            className="flex items-center justify-between border-t border-white/10 pt-4 text-[0.74rem] uppercase tracking-[0.18em] text-white/46"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            <span>Case Study</span>
                            <a
                              href={project.liveUrl}
                              className="transition-opacity duration-300 hover:opacity-80"
                            >
                              Preview ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              ref={experienceSectionRef}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.18 }}
              variants={overlayItemVariant}
              id="experience"
              className="border-t border-white/8 bg-black px-4 py-12 text-white sm:px-10 sm:py-16 lg:px-12 xl:px-16"
            >
              <div className="space-y-10 sm:space-y-14">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-4">
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      06 — Experience
                    </p>
                    <h2
                      className="max-w-[10ch] text-[2.8rem] leading-[0.92] tracking-[-0.08em] text-white sm:text-[4.9rem] lg:text-[6.2rem]"
                      style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                    >
                      Growth, practice, and hands-on building.
                    </h2>
                  </div>

                  <p
                    className="max-w-xl text-sm leading-7 text-white/58 sm:text-[1rem] sm:leading-8"
                    style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                  >
                    A timeline view of my development journey, showing how
                    practical projects, backend work, and product thinking have
                    shaped my experience as a fullstack developer.
                  </p>
                </div>

                <div className="relative pl-7 sm:pl-10 lg:pl-0">
                  <div className="absolute bottom-0 left-2 top-0 w-px bg-white/10 sm:left-4 lg:left-[13.4rem]" />
                  <motion.div
                    aria-hidden="true"
                    className="absolute bottom-0 left-2 top-0 w-px origin-top bg-gradient-to-b from-[#8b7cff] via-[#6f5bf3] to-white/18 sm:left-4 lg:left-[13.4rem]"
                    initial={{ scaleY: 0, opacity: 0.4 }}
                    animate={
                      isExperienceInView
                        ? { scaleY: 1, opacity: 1 }
                        : { scaleY: 0, opacity: 0.4 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0.35 : 1.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />

                  <div className="space-y-10 sm:space-y-12">
                    {experienceItems.map((item, index) => (
                      <motion.article
                        key={`${item.period}-${item.title}`}
                        variants={overlayItemVariant}
                        transition={{ delay: 0.05 + index * 0.06 }}
                        className="relative grid gap-4 lg:grid-cols-[12rem_1fr]"
                      >
                        <div className="space-y-2 lg:pr-10">
                          <p
                            className="text-[0.72rem] uppercase tracking-[0.24em] text-white/36"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {item.period}
                          </p>
                          <p
                            className="text-[0.82rem] uppercase tracking-[0.14em] text-white/24"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {item.company}
                          </p>
                        </div>

                        <motion.span
                          aria-hidden="true"
                          className="absolute left-[-1.6rem] top-1 h-3.5 w-3.5 rounded-full border border-white/14 bg-[#6f5bf3] shadow-[0_0_0_6px_rgba(111,91,243,0.12)] sm:left-[-2.1rem] lg:left-[12.95rem]"
                          initial={{ scale: 0.7, opacity: 0.45 }}
                          animate={
                            isExperienceInView
                              ? {
                                  scale: [0.78, 1.08, 1],
                                  opacity: 1,
                                }
                              : {
                                  scale: 0.7,
                                  opacity: 0.45,
                                }
                          }
                          transition={{
                            duration: prefersReducedMotion ? 0.3 : 0.7,
                            delay: prefersReducedMotion ? 0 : 0.18 + index * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />

                        <motion.div
                          initial={{ opacity: 0, x: 34 }}
                          animate={
                            isExperienceInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: 34 }
                          }
                          transition={{
                            duration: prefersReducedMotion ? 0.3 : 0.72,
                            delay: prefersReducedMotion ? 0 : 0.22 + index * 0.09,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h3
                                className="text-[1.8rem] leading-[0.96] tracking-[-0.05em] text-white sm:text-[2.35rem]"
                                style={{
                                  fontFamily:
                                    '"Helvetica Neue", Arial, sans-serif',
                                }}
                              >
                                {item.title}
                              </h3>
                              <p
                                className="text-sm leading-7 text-white/64 sm:text-[0.98rem] sm:leading-8"
                                style={{
                                  fontFamily:
                                    '"Helvetica Neue", Arial, sans-serif',
                                }}
                              >
                                {item.summary}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                              {item.highlights.map((highlight) => (
                                <span
                                  key={highlight}
                                  className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[0.72rem] uppercase tracking-[0.08em] text-white/76"
                                  style={{ fontFamily: "var(--font-bungee)" }}
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.18 }}
              variants={overlayItemVariant}
              id="certificate"
              className="border-t border-white/8 bg-[#050505] px-4 py-12 text-white sm:px-10 sm:py-16 lg:px-12 xl:px-16"
            >
              <div className="space-y-10 sm:space-y-14">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-4">
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      07 — Certificate
                    </p>
                    <h2
                      className="max-w-[10ch] text-[2.8rem] leading-[0.92] tracking-[-0.08em] text-white sm:text-[4.9rem] lg:text-[6.2rem]"
                      style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                    >
                      Visual proof of learning and continuous growth.
                    </h2>
                  </div>

                  <p
                    className="max-w-xl text-sm leading-7 text-white/58 sm:text-[1rem] sm:leading-8"
                    style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                  >
                    A quick gallery of certificates that reflect my learning
                    path in web development, backend systems, and product
                    thinking.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {certificateItems.map((item, index) => (
                    <motion.article
                      key={`${item.title}-${item.year}`}
                      variants={overlayItemVariant}
                      transition={{ delay: 0.05 + index * 0.07 }}
                      className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.03]"
                    >
                      <div className="relative aspect-[1.25/1] overflow-hidden border-b border-white/8 bg-[#111114]">
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="space-y-3 p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                          <p
                            className="text-[0.68rem] uppercase tracking-[0.18em] text-white/42"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {item.issuer}
                          </p>
                          <span
                            className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-white/58"
                            style={{ fontFamily: "var(--font-bungee)" }}
                          >
                            {item.year}
                          </span>
                        </div>
                        <h3
                          className="text-[1.45rem] leading-[0.98] tracking-[-0.05em] text-white sm:text-[1.8rem]"
                          style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.18 }}
              variants={overlayItemVariant}
              id="contact"
              className="border-t border-white/8 bg-black px-4 py-12 text-white sm:px-10 sm:py-16 lg:px-12 xl:px-16"
            >
              <div className="space-y-10 sm:space-y-14">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-4">
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.34em] text-white/38"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      08 — Contact
                    </p>
                    <h2
                      className="max-w-[10ch] text-[2.8rem] leading-[0.92] tracking-[-0.08em] text-white sm:text-[4.9rem] lg:text-[6.2rem]"
                      style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                    >
                      Let&apos;s build something meaningful together.
                    </h2>
                  </div>

                  <p
                    className="max-w-xl text-sm leading-7 text-white/58 sm:text-[1rem] sm:leading-8"
                    style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                  >
                    Available for freelance work, internships, collaboration,
                    and backend or fullstack opportunities. If you have an idea
                    or a role in mind, feel free to reach out.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <motion.div
                    variants={overlayItemVariant}
                    className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
                  >
                    <div className="space-y-5">
                      <p
                        className="text-[0.72rem] uppercase tracking-[0.18em] text-white/42"
                        style={{ fontFamily: "var(--font-bungee)" }}
                      >
                        Direct Contact
                      </p>
                      <a
                        href={`mailto:${profileContent.contactEmail}`}
                        className="block text-[1.7rem] leading-[1.02] tracking-[-0.05em] text-white transition-opacity duration-300 hover:opacity-80 sm:text-[2.8rem]"
                        style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                      >
                        {profileContent.contactEmail}
                      </a>
                      <p
                        className="max-w-2xl text-sm leading-7 text-white/58 sm:text-[0.98rem] sm:leading-8"
                        style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                      >
                        {profileContent.contactCtaText}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={overlayItemVariant}
                    className="space-y-4 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
                  >
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.18em] text-white/42"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      Links
                    </p>
                    <div className="flex flex-col gap-3">
                      {socialItems.map((item) => (
                        <a
                          key={item.label}
                          href={item.url}
                          className="inline-flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/78 transition-colors duration-300 hover:border-white/20 hover:text-white sm:text-[0.95rem]"
                          style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                        >
                          <span>{item.label}</span>
                          <span>↗</span>
                        </a>
                      ))}
                      <a
                        href={profileContent.cvUrl}
                        className="inline-flex items-center justify-between rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5 sm:text-[0.95rem]"
                        style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                      >
                        <span>Download CV</span>
                        <span>↓</span>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <motion.footer
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.18 }}
              variants={overlayItemVariant}
              className="border-t border-white/8 bg-[#050505] px-4 py-8 text-white sm:px-10 sm:py-10 lg:px-12 xl:px-16"
            >
              <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p
                    className="text-[0.72rem] uppercase tracking-[0.18em] text-white/34"
                    style={{ fontFamily: "var(--font-bungee)" }}
                  >
                    {profileContent.displayName}
                  </p>
                  <p
                    className="text-sm leading-7 text-white/52 sm:text-[0.96rem]"
                    style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                  >
                    {profileContent.footerSummary}
                  </p>
                </div>

              </div>

              <div
                className="flex flex-col items-center gap-3 border-t border-white/8 pt-5 text-center text-[0.68rem] uppercase tracking-[0.1em] text-white/34 sm:text-[0.8rem] sm:tracking-[0.12em]"
                style={{ fontFamily: "var(--font-bungee)" }}
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span>All rights reserved.</span>
                  <span>powered with</span>
                </div>
                <div className="inline-flex items-center justify-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-[#ff6b8b]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 21.2 10.55 19.88C5.4 15.22 2 12.14 2 8.36 2 5.28 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.28 22 8.36c0 3.78-3.4 6.86-8.55 11.53L12 21.2Z" />
                  </svg>
                  <span>by Akbar</span>
                </div>
              </div>
            </motion.footer>
          </motion.div>
        </motion.section>
      </div>

      {!isIntroFinished && (
        <div ref={introRef} className="intro-shell">
          <div ref={threeRef} className="intro-webgl" />

          <div className="intro-grid">
            <header className="flex items-start justify-between">
              <p
                data-intro-chrome
                className="text-[0.72rem] uppercase tracking-[0.46em] text-white/38"
              >
                akbar.dev
              </p>
              <p
                data-intro-chrome
                className="text-[0.72rem] uppercase tracking-[0.46em] text-white/38"
              >
                2026
              </p>
            </header>

            <div className="flex flex-1 items-center justify-center">
              <div
                ref={greetingStageRef}
                className="overflow-hidden px-6 text-center"
              >
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentGreeting}
                    initial={{
                      opacity: 0,
                      y: "42%",
                    }}
                    animate={{
                      opacity: 1,
                      y: "0%",
                    }}
                    exit={{
                      opacity: 0,
                      y: "-18%",
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0.8 : 1.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-[2.9rem] leading-none font-medium tracking-tight text-white sm:text-[4.8rem] lg:text-[5.8rem]"
                  >
                    {currentGreeting}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              <div
                data-intro-bottom
                className="h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.08)_8%,rgba(255,255,255,0.06)_100%)]"
              >
                <div
                  ref={progressBarRef}
                  className="intro-progress-fill"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center justify-between">
                <p
                  data-intro-bottom
                  className="text-[0.72rem] uppercase tracking-[0.46em] text-white/38"
                >
                  loading
                </p>
                <span
                  ref={progressValueRef}
                  data-intro-bottom
                  className="translate-y-1 text-[0.72rem] uppercase tracking-[0.36em] text-white/52"
                >
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] bg-black/62 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                x: "100%",
                borderTopLeftRadius: 48,
                borderBottomLeftRadius: 48,
              }}
              animate={{
                x: 0,
                borderTopLeftRadius: 32,
                borderBottomLeftRadius: 32,
              }}
              exit={{
                x: "100%",
                borderTopLeftRadius: 48,
                borderBottomLeftRadius: 48,
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto my-3 mr-3 flex min-h-[calc(100vh-1.5rem)] w-[calc(100%-1rem)] max-w-[31rem] flex-col overflow-hidden bg-black px-4 py-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:my-5 sm:mr-5 sm:min-h-[calc(100vh-2.5rem)] sm:w-[min(31rem,calc(100%-2.5rem))] sm:max-w-[33rem] sm:px-7 sm:py-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className="flex h-12 items-center text-xs leading-none uppercase tracking-[0.12em] text-white/68 sm:h-14 sm:text-sm sm:tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-bungee)" }}
                >
                  <span className="text-white/52">ID</span>
                  <span className="mx-2 text-white/38">/</span>
                  <span className="text-[#796bff]">EN</span>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] text-white transition-transform duration-300 hover:scale-[1.03] sm:h-14 sm:w-14"
                >
                  <span className="relative block h-4.5 w-4.5 sm:h-5 sm:w-5">
                    <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-45 bg-white" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 -rotate-45 bg-white" />
                  </span>
                </button>
              </div>

              <div className="mt-6 border-t border-white/18 pt-8 sm:mt-8 sm:pt-10">
                <p
                  className="mb-4 text-[0.68rem] uppercase tracking-[0.11em] text-[#756246] sm:mb-5 sm:text-[0.78rem] sm:tracking-[0.12em]"
                  style={{ fontFamily: "var(--font-bungee)" }}
                >
                  Navigation
                </p>
                <nav>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: 36 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 18 }}
                        transition={{
                          delay: 0.08 + index * 0.05,
                          duration: 0.48,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                          }}
                          className="text-left text-[1.72rem] leading-[1.02] tracking-[0.01em] text-white transition-opacity duration-300 hover:opacity-70 sm:text-[2.85rem] sm:leading-[0.98] sm:tracking-[0.015em]"
                          style={{ fontFamily: "var(--font-bungee)" }}
                        >
                          {item}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-auto border-t border-white/10 pt-6"
              >
                <p
                  className="mb-3 text-[0.68rem] uppercase tracking-[0.11em] text-[#756246] sm:text-[0.78rem] sm:tracking-[0.12em]"
                  style={{ fontFamily: "var(--font-bungee)" }}
                >
                  Social
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-[0.72rem] text-white sm:text-[0.9rem]">
                  {socialItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.url}
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="transition-opacity duration-300 hover:opacity-70"
                      style={{ fontFamily: "var(--font-bungee)" }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}
