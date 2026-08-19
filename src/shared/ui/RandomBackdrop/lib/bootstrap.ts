export type RandomBackdropOptions = {
  selector: string;
  previewSelector: string;
  images: string[];
  /** Data URIs in the same order as `images`. May be empty. */
  previews: string[];
  /** Below this width nothing is requested at all. */
  minViewportWidth: number;
};

/**
 * Picks one of `images` and wires it onto the <img>. A fresh pick on every page
 * load — caching it in session storage turns "random" into "the same picture for
 * the rest of the tab's life".
 *
 * Runs from two places: an inline <script> next to the markup, so the request
 * starts while the HTML is still being parsed, and an effect in `PickFallback`
 * for soft navigation. The `src` guard makes whichever runs second a no-op.
 *
 * Serialized with `Function.prototype.toString()`, so it must stay
 * self-contained: no imports, no closures, everything through `options`.
 */
export function pickRandomBackdrop(options: RandomBackdropOptions) {
  const img = document.querySelector<HTMLImageElement>(options.selector);
  if (!img || img.getAttribute("src")) return;

  const apply = () => {
    const index = Math.floor(Math.random() * options.images.length);

    // Costs no request — the preview is a ~110 byte data URI already in the
    // HTML, so the area has colour on the very first frame.
    const preview = options.previews[index];
    if (preview) {
      const layer = document.querySelector<HTMLElement>(
        options.previewSelector,
      );
      if (layer) layer.style.backgroundImage = `url("${preview}")`;
    }

    img.src = options.images[index];

    const reveal = () => img.setAttribute("data-loaded", "true");
    if (img.complete) reveal();
    else img.addEventListener("load", reveal, { once: true });
  };

  // An eager <img> is fetched even inside a `display: none` parent.
  const area = window.matchMedia(`(min-width: ${options.minViewportWidth}px)`);
  if (area.matches) apply();
  else area.addEventListener("change", apply, { once: true });
}
