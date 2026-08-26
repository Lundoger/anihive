# Богдан уже уверенно владеет Supabase Auth на email/password + OTP

В anihive самостоятельно реализованы: signUp/signIn как server actions, OTP-подтверждение и recovery через
браузерный клиент, `resetPasswordForEmail`, смена email с `email_change`, reauthenticate перед чувствительными
операциями, zustand-стор сессии с подпиской на `onAuthStateChange`, guard-логика в `src/proxy.ts` и
cookie-based SSR через `@supabase/ssr` (browser/server/proxy клиенты разделены).

**Почему это важно для будущих сессий:** базу (cookie-сессия, JWT vs refresh token, разница server action и
браузерного клиента, зачем middleware обновляет сессию) объяснять не нужно. Zone of proximal development
начинается сразу с redirect-флоу: `code` → `code_verifier` → `session`, и с того, чем OAuth-вход
*структурно* отличается от `signInWithPassword` (третья сторона + навигация браузера, а не fetch).

**Evidence:** код в `src/entities/session/**` и `src/shared/api/supabase/**` написан им до начала обучения;
комментарии в коде объясняют *почему* server action не эмитит auth-событие — это понимание, а не копипаста.

**Implications:** уроки 1–2 сразу про механику redirect + обмен кода. Не тратить время на «что такое JWT».
Зато нужно закрыть слепое пятно: он ещё не сталкивался с флоу, где браузер уходит на чужой домен и
возвращается GET-навигацией, — отсюда все ловушки урока 1.
