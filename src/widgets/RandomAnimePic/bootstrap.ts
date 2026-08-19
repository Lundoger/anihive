export type AuthBackgroundOptions = {
  selector: string;
  count: number;
  quality: number;
  widths: number[];
  fallbackWidth: number;
  sizes: string;
  minViewportWidth: number;
};

export const AUTH_BACKGROUND: AuthBackgroundOptions = {
  selector: "img[data-auth-bg]",
  count: 25,
  quality: 75,
  widths: [640, 750, 828, 1080, 1200, 1920, 2048],
  fallbackWidth: 1080,
  sizes: "100vh",
  minViewportWidth: 992,
};

export function pickAuthBackground(options: AuthBackgroundOptions) {
  const img = document.querySelector<HTMLImageElement>(options.selector);
  if (!img || img.getAttribute("srcset")) return;

  const apply = () => {
    const index = Math.floor(Math.random() * options.count) + 1;
    const file = `/img/${String(index).padStart(2, "0")}.webp`;
    const url = (width: number) =>
      `/_next/image?url=${encodeURIComponent(file)}&w=${width}&q=${options.quality}`;

    img.sizes = options.sizes;
    img.srcset = options.widths.map((w) => `${url(w)} ${w}w`).join(", ");
    img.src = url(options.fallbackWidth);

    const reveal = () => img.setAttribute("data-loaded", "true");
    if (img.complete) reveal();
    else img.addEventListener("load", reveal, { once: true });
  };

  const pane = window.matchMedia(`(min-width: ${options.minViewportWidth}px)`);
  if (pane.matches) apply();
  else pane.addEventListener("change", apply, { once: true });
}
