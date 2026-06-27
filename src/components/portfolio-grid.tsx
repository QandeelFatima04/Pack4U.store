"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/cards";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/types";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const filters = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.filters.forEach((f) => set.add(f)));
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? projects
      : projects.filter((p) => p.filters.includes(active));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition",
              active === f ? "border-brand bg-brand text-brand-foreground" : "hover:bg-muted",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">No projects in this category yet.</p>
      )}
    </div>
  );
}
