# Mission: OAuth (Google, Discord) в anihive через Supabase

## Why
В anihive уже работает вход по email/password + OTP, но регистрация в три шага отпугивает случайного посетителя
аниме-сайта — нужен вход в один клик через Google, потом через Discord (родная соцсеть аудитории).
Богдан хочет не скопировать quickstart, а понимать механику: чтобы самому чинить `invalid flow state`,
`redirect_uri_mismatch` и добавлять новых провайдеров без гайда.

## Success looks like
- Кнопка «Войти через Google» работает в dev и на прод-домене; сессия выживает после reload и F5 на защищённой странице.
- Богдан добавляет Discord **сам, по памяти**, меньше чем за 20 минут, и объясняет, что именно поменялось.
- Может вслух рассказать путь от клика до cookie: кто выдаёт `code`, кто хранит `code_verifier`, где происходят **два** PKCE-рукопожатия.
- Читает ошибку OAuth и называет виновника: Google Cloud, Supabase redirect allow list, `src/proxy.ts` или свой код.
- Понимает, что произойдёт, если один и тот же email придёт и через пароль, и через Google (identity linking).

## Constraints
- Формат: урок → Богдан пишет код сам → я ревьюю. Код за него не писать (кроме контрактов/сигнатур).
- Язык уроков: русский, технические термины — английские (`code_verifier`, route handler, не «проверщик кода»).
- Проект: Next.js 16.3.1 (middleware = `src/proxy.ts`), FSD (`src/_pages`, `entities`, `features`, `shared`),
  next-intl с `localePrefix: "as-needed"` (`ua`/`en`), `@supabase/ssr` 0.8, zustand-стор сессии.
- Ключи Google Cloud уже созданы — этап «настрой консоль» пропускаем, только сверяем URL-ы.

## Out of scope
- GitHub, Apple, Twitter как провайдеры (позже; в мисии только Google + Discord).
- Google One Tap / `signInWithIdToken`, нативные мобильные флоу.
- Свой OAuth-сервер, RLS-модель, MFA, Custom Access Token Hook.
