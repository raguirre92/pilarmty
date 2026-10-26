import type { Metadata } from "next";

import { TeachingPage } from "@/components/teaching-page";
import {
  getTeaching,
  getTeachings,
  getTeachingTranslation
} from "@/lib/content";
import { redirectOrNotFound } from "@/lib/content/navigation";
import { localePath } from "@/lib/site";
import {
  pageMetadata,
  safeJsonLd,
  teachingStructuredData
} from "@/lib/seo";

type Props = {
  params: Promise<{ collection: string; slug: string }>;
};

export const revalidate = false;

export async function generateStaticParams() {
  const teachings = await getTeachings("es");
  return teachings.map((teaching) => ({
    collection: teaching.collection,
    slug: teaching.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, slug } = await params;
  const teaching = await getTeaching("es", collection, slug);
  if (!teaching) return {};
  const translation = teaching.translation || getTeachingTranslation("es", collection, slug);
  return pageMetadata({
    title: teaching.seoTitle || teaching.title,
    description:
      teaching.seoDescription ||
      teaching.excerpt ||
      "Explorando la Palabra de Dios para vivir el evangelio en nuestra vida diaria.",
    path: `/ensenanzas/${collection}/${slug}`,
    locale: "es",
    canonical: teaching.canonical,
    noindex: teaching.noindex,
    alternatePath: translation
      ? localePath(
          "en",
          `/ensenanzas/${translation.collection}/${translation.slug}`
        )
      : undefined,
    image: teaching.socialImage || teaching.image,
    imageAlt: teaching.imageAlt || teaching.title
  });
}

export default async function Page({ params }: Props) {
  const { collection, slug } = await params;
  const teaching = await getTeaching("es", collection, slug);
  if (!teaching) {
    return redirectOrNotFound(`/ensenanzas/${collection}/${slug}`);
  }

  const jsonLd = teachingStructuredData({
    teaching,
    locale: "es",
    collection,
    slug
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <TeachingPage
        locale="es"
        collectionSlug={collection}
        slug={slug}
      />
    </>
  );
}
