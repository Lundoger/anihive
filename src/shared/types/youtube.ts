export type ThumbnailQuality = "default" | "mq" | "hq" | "sd" | "maxres";

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
  loop?: boolean;
  enablejsapi?: boolean;
  noCookie?: boolean;
}
