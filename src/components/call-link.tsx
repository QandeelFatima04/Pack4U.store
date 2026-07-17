"use client";

import { telLink } from "@/lib/site";
import { track } from "@/lib/track";

/** A tel: link that reports the click. Phone calls were previously invisible in
 *  analytics — `call_click` was defined but never fired. */
export function CallLink({
  source,
  className,
  children,
}: {
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={telLink()}
      onClick={() => track("call_click", { source })}
      className={className}
    >
      {children}
    </a>
  );
}
