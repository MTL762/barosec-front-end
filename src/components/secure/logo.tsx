import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-8 text-primary transition-transform duration-300 hover:scale-105", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Premium Shield Outer Path */}
      <path
        d="M12 2L4 5V11C4 16.52 7.42 20.74 12 22C16.58 20.74 20 16.52 20 11V5L12 2Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Modern stylized 'B' */}
      <path
        d="M9.5 7H13C14.38 7 15.5 8.12 15.5 9.5C15.5 10.88 14.38 12 13 12H9.5V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12H13.5C14.88 12 16 13.12 16 14.5C16 15.88 14.88 17 13.5 17H9.5V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Camera lens indicator dot */}
      <circle cx="12.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
