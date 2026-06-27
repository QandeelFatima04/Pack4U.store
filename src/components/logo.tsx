import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="Pack4U home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          {/* open box mark */}
          <path
            d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M3 7.5 12 12l9-4.5M12 12v9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Pack<span className="text-brand">4U</span>
        </span>
      )}
    </Link>
  );
}
