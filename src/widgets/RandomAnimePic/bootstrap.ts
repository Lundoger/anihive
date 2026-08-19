export type AuthBackgroundOptions = {
  selector: string;
  previewSelector: string;
  count: number;
  minViewportWidth: number;
};

export const AUTH_BACKGROUND: AuthBackgroundOptions = {
  selector: "img[data-auth-bg]",
  previewSelector: "[data-auth-bg-preview]",
  count: 25,
  minViewportWidth: 992,
};

export function pickAuthBackground(
  options: AuthBackgroundOptions,
  previews: string[],
) {
  const img = document.querySelector<HTMLImageElement>(options.selector);
  if (!img || img.getAttribute("src")) return;

  const apply = () => {
    const index = Math.floor(Math.random() * options.count) + 1;

    // Costs no request — the preview is a ~110 byte data URI already in the
    // HTML, so the pane has colour on the very first frame.
    const preview = previews[index - 1];
    if (preview) {
      const layer = document.querySelector<HTMLElement>(
        options.previewSelector,
      );
      if (layer) layer.style.backgroundImage = `url("${preview}")`;
    }

    img.src = `/img/${String(index).padStart(2, "0")}.webp`;

    const reveal = () => img.setAttribute("data-loaded", "true");
    if (img.complete) reveal();
    else img.addEventListener("load", reveal, { once: true });
  };

  const pane = window.matchMedia(`(min-width: ${options.minViewportWidth}px)`);
  if (pane.matches) apply();
  else pane.addEventListener("change", apply, { once: true });
}
