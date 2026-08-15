import type { Metadata } from "next";

import {
  AnimeDetailPage,
  buildAnimeDetailMetadata,
} from "@/_pages/anime-detail";

export interface AnimePageProps {
  params: Promise<{
    malId: string;
    title: string;
  }>;
}

export async function generateMetadata({
  params,
}: AnimePageProps): Promise<Metadata> {
  const { malId } = await params;

  return buildAnimeDetailMetadata(malId);
}

export default async function AnimePage({ params }: AnimePageProps) {
  const { malId } = await params;

  return <AnimeDetailPage malId={malId} />;
}
