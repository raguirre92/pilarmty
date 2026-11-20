import type { Metadata } from "next";

import { ResourcePage } from "@/components/resource-page";
import { getResource, getResources } from "@/lib/content";
import { redirectOrNotFound } from "@/lib/content/navigation";
import { pageMetadata, safeJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = false;

export async function generateStaticParams() {
  const resources = await getResources("en");
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource("en", slug);
  if (!resource) return {};
  return pageMetadata({
    title: resource.seoTitle || resource.title,
    description:
      resource.seoDescription ||
      resource.excerpt ||
      "A resource from Iglesia Pilar.",
    path: `/en/recursos/${slug}`,
    locale: "en",
    alternatePath: resource.translation
      ? `/recursos/${resource.translation.slug}`
      : undefined,
    canonical: resource.canonical,
    noindex: resource.noindex,
    image: resource.socialImage || resource.image,
    imageAlt: resource.imageAlt || resource.title
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const resource = await getResource("en", slug);
  if (!resource) {
    return redirectOrNotFound(`/en/recursos/${slug}`);
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.seoDescription || resource.excerpt,
    datePublished: resource.date,
    dateModified: resource.updatedAt || resource.date,
    inLanguage: "en",
    author: resource.author
      ? { "@type": "Person", name: resource.author, url: resource.authorUrl }
      : { "@type": "Organization", name: "Iglesia Pilar" },
    image: resource.socialImage || resource.image,
    publisher: { "@type": "Organization", name: "Iglesia Pilar", url: absoluteUrl("/en"), logo: { "@type": "ImageObject", url: absoluteUrl("/brand/iglesia-pilar.png") } },
    mainEntityOfPage: absoluteUrl(`/en/recursos/${slug}`)
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <ResourcePage locale="en" slug={slug} />
    </>
  );
}
