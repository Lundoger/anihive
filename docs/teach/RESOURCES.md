# OAuth + Supabase Resources

## Knowledge

### Первичные источники (спека — истина в последней инстанции)
- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
  Базовая спека. Use for: что такое authorization code grant, `state`, `redirect_uri`, роли client/resource owner/authorization server.
- [RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
  Proof Key for Code Exchange, ровно 20 страниц. Use for: зачем нужен `code_verifier`/`code_challenge`, почему S256, какие атаки это закрывает.
- [RFC 9700 — OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/rfc9700)
  Актуальные рекомендации (PKCE для всех клиентов, запрет implicit flow). Use for: споры «а нужен ли PKCE серверному приложению».
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
  Слой identity поверх OAuth. Use for: `id_token`, `nonce`, claims (`sub`, `email_verified`), чем Google отличается от Discord.
- [Google Identity — OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
  Use for: точный формат authorized redirect URI, `access_type=offline`, `prompt=consent`, ограничения verification.

### Supabase
- [Supabase Docs — Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
  Use for: чек-лист настроек провайдера и callback URL Supabase.
- [Supabase Docs — Server-Side Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
  Use for: канонический вид `createBrowserClient` / `createServerClient` / middleware и route handler колбэка.
- [Supabase Docs — Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
  Use for: allow list, wildcards, поведение Site URL при несовпадении.
- [Supabase Docs — Identity Linking](https://supabase.com/docs/guides/auth/auth-identity-linking)
  Use for: что будет, если один email придёт через пароль и через Google; `linkIdentity`, `unlinkIdentity`.

### Ground truth в этом репозитории (читать вместо догадок)
- `node_modules/.pnpm/@supabase+auth-js@2.87.1/node_modules/@supabase/auth-js/dist/main/GoTrueClient.js`
  Use for: `signInWithOAuth` (стр. ~487), `_exchangeCodeForSession` (стр. ~764), `_handleProviderSignIn` (стр. ~1837).
- `node_modules/@supabase/ssr/dist/main/cookies.js` (стр. ~263) и `createBrowserClient.js` (стр. ~38)
  Use for: доказательство, что `flowType: "pkce"` зашит намертво, и что `-code-verifier` пишется в cookie отдельным проходом.
- [supabase/auth — `internal/api/external.go`](https://github.com/supabase/auth/blob/master/internal/api/external.go)
  Use for: что сервер делает с `code_challenge`, `FlowState`, `OAuthClientState` — второй слой PKCE.
- [supabase/auth — `internal/security/pkce.go`](https://github.com/supabase/auth/blob/master/internal/security/pkce.go)
  Use for: точная проверка `S256`: base64url(sha256(verifier)) без padding, constant-time сравнение.
- [supabase/auth — `internal/api/identity.go`](https://github.com/supabase/auth/blob/master/internal/api/identity.go)
  Use for: `linkIdentityToUser` — реальная логика привязки identity, включая ошибки «already linked».
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` и `proxy.md`
  Use for: конвенции Next 16 (route handler, `proxy.ts` вместо `middleware.ts`).
- [next-intl — Middleware](https://next-intl.dev/docs/routing/middleware)
  Use for: как `localePrefix: "as-needed"` переписывает пути и почему matcher должен исключать `/auth`.

## Wisdom (Communities)

- [Supabase Discord](https://discord.supabase.com)
  Канал `#help`. Use for: живой разбор конкретной ошибки флоу, там сидят мейнтейнеры auth.
- [supabase/auth — GitHub Discussions & Issues](https://github.com/supabase/auth/issues)
  Use for: подтверждение багов/поведения GoTrue; поиск по тексту ошибки даёт первоисточник.
- [r/Supabase](https://reddit.com/r/Supabase)
  Use for: сравнение архитектурных решений с чужими проектами (SSR vs client-side auth).

## Gaps
- Нет хорошего разбора «Supabase Auth под капотом» от третьих лиц — приходится читать Go-исходник. Если найдётся качественный разбор, добавить сюда.
- Не проверен ни один источник про особенности Discord OAuth в связке с Supabase (нужен к уроку про Discord).
