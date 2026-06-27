import { site } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness"],
        name: site.legalName,
        url: site.url,
        description: site.description,
        telephone: site.phoneE164,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressCountry: "PK",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phoneE164,
          contactType: "customer service",
          availableLanguage: ["English", "Urdu"],
          contactOption: "TollFree",
        },
        areaServed: "PK",
        sameAs: [
          site.social.instagram,
          site.social.facebook,
          site.social.linkedin,
        ],
      }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.question,
          acceptedAnswer: { "@type": "Answer", text: i.answer },
        })),
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string; // path, e.g. "/custom-boxes"
  image?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: name,
        name,
        description,
        url: `${site.url}${url}`,
        image: image ? `${site.url}${image}` : undefined,
        provider: {
          "@type": "Organization",
          name: site.legalName,
          url: site.url,
        },
        areaServed: "PK",
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${site.url}${it.url}`,
        })),
      }}
    />
  );
}
