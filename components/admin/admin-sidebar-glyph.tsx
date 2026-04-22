import type { SVGProps } from "react";

export function AdminSidebarGlyph({
  label,
  className = "h-[1.35rem] w-[1.35rem]",
}: Readonly<{ label: string; className?: string }>) {
  const commonStroke: SVGProps<SVGPathElement> = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (label === "Overview") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M5.5 10.5 12 5l6.5 5.5V18a1 1 0 0 1-1 1h-3.5v-4h-4v4H6.5a1 1 0 0 1-1-1v-7.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (label === "Stack") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 4 4.5 8 12 12 19.5 8 12 4Z" fill="currentColor" />
        <path d="M4.5 11.25 12 15.25l7.5-4M4.5 14.5 12 18.5l7.5-4" {...commonStroke} />
      </svg>
    );
  }

  if (label === "Projects") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M7 4.5h7l3 3V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" {...commonStroke} />
        <path d="M14 4.5v3h3" {...commonStroke} />
        <path d="M9 12h5M9 15h4" {...commonStroke} />
      </svg>
    );
  }

  if (label === "Experience") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M8 7.5h8M8.75 5h6.5a1.75 1.75 0 0 1 1.75 1.75v10.5A1.75 1.75 0 0 1 15.25 19h-6.5A1.75 1.75 0 0 1 7 17.25V6.75A1.75 1.75 0 0 1 8.75 5Z" {...commonStroke} />
        <path d="M9 10.5h6M9 14h4.5" {...commonStroke} />
      </svg>
    );
  }

  if (label === "Profile") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 12a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm-6 7a6 6 0 0 1 12 0" {...commonStroke} />
      </svg>
    );
  }

  if (label === "Certificates") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 6.25a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" {...commonStroke} />
        <path d="m10.1 12.55-.95 5.2L12 16.3l2.85 1.45-.95-5.2" {...commonStroke} />
      </svg>
    );
  }

  if (label === "Contact") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M7.25 6.5h9.5A1.75 1.75 0 0 1 18.5 8.25v7.5a1.75 1.75 0 0 1-1.75 1.75h-9.5A1.75 1.75 0 0 1 5.5 15.75v-7.5A1.75 1.75 0 0 1 7.25 6.5Z" {...commonStroke} />
        <path d="M8.75 10h3.75M8.75 13.25h6.5M14.85 9.65a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Zm-1.9 4.1a2.2 2.2 0 0 1 3.8 0" {...commonStroke} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Zm0-3.25 1.2 1.65 2.04-.28.53 1.98 1.89.82-.82 1.89 1.19 1.7-1.7 1.2.28 2.04-1.98.53-.82 1.89-1.89-.82-1.7 1.19-1.2-1.7-2.04.28-.53-1.98-1.89-.82.82-1.89L4 12l1.7-1.2-.28-2.04 1.98-.53.82-1.89 1.89.82L12 4Z"
        fill="currentColor"
      />
    </svg>
  );
}
