import Image from "next/image";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/sections";
import { FadeIn, StaggerIn, StaggerItem } from "@/components/ui/animate";
import { testimonials } from "@/content/testimonials";
import { clients } from "@/content/clients";

function Stars({ rating }: { rating: number }) {
  const count = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < count ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-border"}
          aria-hidden
        />
      ))}
    </div>
  );
}

/**
 * Social proof: customer testimonials + a client-logo trust strip.
 * Renders nothing while both data arrays are empty, so the site stays clean
 * until real content is added in src/content/{testimonials,clients}.ts.
 */
export function Testimonials() {
  const hasTestimonials = testimonials.length > 0;
  const hasClients = clients.length > 0;
  if (!hasTestimonials && !hasClients) return null;

  return (
    <section className="section">
      <div className="container-page">
        {hasTestimonials && (
          <>
            <FadeIn>
              <SectionHeading
                eyebrow="What clients say"
                title="Brands that trust Pack4U with their packaging"
              />
            </FadeIn>
            <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
              {testimonials.map((t) => (
                <StaggerItem key={t.name} className="h-full">
                  <figure className="flex h-full flex-col rounded-2xl border bg-card p-6">
                    {typeof t.rating === "number" && <Stars rating={t.rating} />}
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      {t.avatar && (
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                          <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-semibold">{t.name}</span>
                        {t.role && (
                          <span className="block text-xs text-muted-foreground">{t.role}</span>
                        )}
                      </span>
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </StaggerIn>
          </>
        )}

        {hasClients && (
          <FadeIn delay={0.1} className={hasTestimonials ? "mt-14" : ""}>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Trusted by product brands
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {clients.map((c) => {
                const img = (
                  <span className="relative block h-8 w-28 opacity-70 transition hover:opacity-100">
                    <Image src={c.logo} alt={c.name} fill className="object-contain" sizes="112px" />
                  </span>
                );
                return (
                  <li key={c.name}>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={c.name}>
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
