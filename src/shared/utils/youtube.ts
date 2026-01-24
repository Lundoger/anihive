import { ThumbnailQuality } from "@/shared/types/youtube";

export function extractYouTubeVideoId(
	url: string | null | undefined,
): string | null {
	if (!url) return null;

	try {
		const patterns = [
			/(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([^?&]+)/,
			/(?:youtube\.com\/watch\?v=)([^&]+)/,
			/(?:youtu\.be\/)([^?&]+)/,
			/(?:youtube\.com\/v\/)([^?&]+)/,
		];

		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match && match[1]) {
				return match[1];
			}
		}

		return null;
	} catch (error) {
		console.error("Error extracting YouTube video ID:", error);
		return null;
	}
}

export function getYouTubeThumbnail(
	videoIdOrUrl: string | null | undefined,
	quality: ThumbnailQuality | string = "maxresdefault",
): string | null {
	if (!videoIdOrUrl) return null;

	const videoId =
		videoIdOrUrl.includes("youtube") || videoIdOrUrl.includes("youtu.be")
			? extractYouTubeVideoId(videoIdOrUrl)
			: videoIdOrUrl;

	if (!videoId) return null;

	const qualityMap: Record<ThumbnailQuality, string> = {
		default: "default",
		mq: "mqdefault",
		hq: "hqdefault",
		sd: "sddefault",
		maxres: "maxresdefault",
	};

	const thumbnailQuality = qualityMap[quality as ThumbnailQuality] || quality;

	return `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`;
}
