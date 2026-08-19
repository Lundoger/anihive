import { AUTH_BACKGROUND, pickAuthBackground } from "./bootstrap";
import { PickFallback } from "./components/PickFallback";
import { AUTH_BACKGROUND_PREVIEWS } from "./placeholders";

const bootstrapScript = `(${pickAuthBackground.toString()})(${JSON.stringify(AUTH_BACKGROUND)},${JSON.stringify(AUTH_BACKGROUND_PREVIEWS)})`;

/**
 * Decorative background for the auth panes. Server-rendered on purpose: the
 * markup is in the initial HTML so the inline script below can paint the preview
 * and start the request during parsing, instead of after the bundle has
 * hydrated.
 */
export default function RandomAnimePic() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden opacity-70">
        <div
          data-auth-bg-preview=""
          suppressHydrationWarning
          className="absolute inset-0 scale-105 bg-cover bg-center blur-2xl"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image
            would need the URL at render time, but the pick has to happen on the
            client, and these files are served without the optimizer anyway. */}
        <img
          data-auth-bg=""
          alt=""
          suppressHydrationWarning
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 ease-out data-[loaded=true]:opacity-100"
        />
      </div>
      <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      <PickFallback />
    </>
  );
}
