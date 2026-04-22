export type AdminNavItem = {
  label: string;
  href: string;
};

export const ADMIN_SIDEBAR_ITEMS: AdminNavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Stack", href: "/admin/stack" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Contact", href: "/admin/contact" },
];
