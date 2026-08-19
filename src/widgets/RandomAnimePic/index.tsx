import { AUTH_BACKGROUND, pickAuthBackground } from "./bootstrap";
import { PickFallback } from "./components/PickFallback";

const bootstrapScript = `(${pickAuthBackground.toString()})(${JSON.stringify(AUTH_BACKGROUND)})`;

export default function RandomAnimePic() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image would
          need the URL at render time, but the pick has to happen on the client;
          the srcset it would build is assembled in ./bootstrap instead. */}
      <img
        data-auth-bg=""
        alt=""
        suppressHydrationWarning
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 ease-out data-[loaded=true]:opacity-70"
      />
      <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      <PickFallback />
    </>
  );
}
