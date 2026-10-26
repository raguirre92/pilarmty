import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TopicPage } from "@/components/topics-page";
import { getResources, getTeachings, getTopicPublicationOverrides } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { pageMetadata, safeJsonLd } from "@/lib/seo";
import {
  getTopicContent,
  getTopicSummaries,
  isTopicIndexable,
  topicDescription
} from "@/lib/topics";

type Props = { params: Promise<{ tema: string }> };

export const revalidate = false;

export async function generateStaticParams() {
  const [teachings, resources, publication] = await Promise.all([
    getTeachings("en"),
    getResources("en"),
    getTopicPublicationOverrides()
  ]);
  return getTopicSummaries(teachings, resources, publication.published, publication.unpublished).filter(isTopicIndexable).map((topic) => ({
    tema: topic.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tema } = await params;
  const [teachings, resources, publication] = await Promise.all([
    getTeachings("en"),
    getResources("en"),
    getTopicPublicationOverrides()
  ]);
  const topic = getTopicContent(tema, teachings, resources, publication.published, publication.unpublished);
  if (!topic) return {};

  return pageMetadata({
    title: topic.name,
    description: topicDescription(topic.name, "en"),
    path: `/en/recursos/temas/${topic.slug}`,
    locale: "en",
    noindex: !isTopicIndexable(topic)
  });
}

export default async function Page({ params }: Props) {
  const { tema } = await params;
  const [teachings, resources, publication] = await Promise.all([
    getTeachings("en"),
    getResources("en"),
    getTopicPublicationOverrides()
  ]);
  const topic = getTopicContent(tema, teachings, resources, publication.published, publication.unpublished);
  if (!topic || !isTopicIndexable(topic)) redirect("/en/recursos/temas");

  const description = topicDescription(topic.name, "en");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.name,
    description,
    url: absoluteUrl(`/en/recursos/temas/${topic.slug}`),
    numberOfItems: topic.count
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <TopicPage locale="en" slug={topic.slug} />
    </>
  );
}
