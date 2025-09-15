// Server component to inject global structured data

export default function StructuredData() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Style at Home",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Style at Home",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}










