import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
} from "@/components/social-icons";
import { Logo } from "@/components/logo";
import { CallLink } from "@/components/call-link";
import { EmailLink } from "@/components/email-link";
import { footerNav } from "@/lib/nav";
import { site } from "@/lib/site";

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition hover:text-brand"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Custom paper packaging for product brands — boxes, bags, tags, sleeves
            and inserts, from concept and material selection to finished production.
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <CallLink source="footer" pageType="site_footer" className="flex items-center gap-2 hover:text-brand">
              <Phone className="h-4 w-4" /> {site.phoneDisplay}
            </CallLink>
            <EmailLink
              clickLocation="footer"
              pageType="site_footer"
              className="flex items-center gap-2 hover:text-brand"
            >
              <Mail className="h-4 w-4" /> {site.email}
            </EmailLink>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {site.country}
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer"
              aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border hover:bg-muted">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer"
              aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border hover:bg-muted">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border hover:bg-muted">
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <Column title="Industries" links={footerNav.industries} />
        <Column title="Packaging Types" links={footerNav.packagingTypes} />
        <Column title="Consultation" links={footerNav.consultation} />
        <Column title="Company" links={footerNav.company} />
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Custom paper packaging for product brands.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brand">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
