# Personal Blog

Персональный блог фронтенд-разработчика. SPA на React + TypeScript + Supabase.

## 📦 Стек

- **React 19** + **TypeScript** (strict mode)
- **Vite** — сборщик и dev-сервер
- **React Router v6** — клиентская маршрутизация
- **React Hook Form + Zod** — формы с runtime-валидацией
- **Supabase** — БД (PostgreSQL), Auth, Storage, Realtime
- **CSS Modules** — изоляция стилей
- **Vitest** — юнит-тесты
- **ESLint + Prettier + Husky** — единый стиль кода

## ✨ Возможности

- Авторизация (регистрация, вход, восстановление пароля)
- Лента постов с пагинацией
- Создание, редактирование, удаление постов (только владелец блога)
- Поддержка изображений и видео в постах
- Полнотекстовый поиск
- Комментарии с realtime-обновлением и древовидной структурой
- Раздел «Мои работы»
- Профиль пользователя
- Адаптивная вёрстка (375 / 768 / 1024 / 1440 px)
- Мобильное burger-меню

## 🚀 Быстрый старт

### Требования

- Node.js ≥ 20
- npm ≥ 10

### Установка

```bash
git clone https://github.com/Hexlet-EducationalPractice/Personal_blog_2026_02_04.git
cd Personal_blog_2026_02_04

# зависимости в корне (husky pre-commit hooks)
npm install

# зависимости фронтенда
cd frontend
npm install
```

### Настройка окружения

Создать `frontend/.env` из примера и заполнить значения:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_BLOG_OWNER_ID=00000000-0000-0000-0000-000000000000
VITE_SITE_URL=http://localhost:5173
```

Откуда взять значения:

- `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` — в Supabase Dashboard → Settings → API
- `VITE_BLOG_OWNER_ID` — UUID пользователя в `auth.users` который будет владельцем блога
- `VITE_SITE_URL` — `http://localhost:5173` для dev, прод-URL для production

### Развёртывание базы данных

В Supabase Dashboard → SQL Editor выполнить по очереди:

1. `frontend/supabase/schema.sql` — создаёт таблицы (profiles, posts, comments, stories, works), RLS-политики, триггеры
2. `frontend/supabase/seed-data.sql` — наполняет демо-данными (замени `<OWNER_UUID>` на свой UUID перед запуском)

### Запуск

```bash
cd frontend
npm run dev
```

Откроется `http://localhost:5173`.

## 📜 npm-скрипты

```bash
npm run dev         # dev-сервер
npm run build       # production-сборка (tsc + vite build)
npm run preview     # локальный просмотр production-сборки
npm run lint        # ESLint
npm run typecheck   # проверка типов без сборки
npm run format      # форматирование Prettier
npm run test        # юнит-тесты (Vitest)
npm run test:run    # тесты без watch
```

## 📁 Структура проекта

```
Personal_blog_2026_02_04/
├── frontend/
│   ├── src/
│   │   ├── app/           — маршрутизация, провайдеры
│   │   ├── pages/         — страницы (Home, TextPage, Profile, Auth, ...)
│   │   ├── features/      — бизнес-модули (posts, comments, auth, profile, stories, works)
│   │   ├── components/    — переиспользуемые UI-компоненты (Button, Modal, Input, ...)
│   │   ├── hooks/         — общие хуки
│   │   ├── lib/           — утилиты (format-date, get-error-message, is-video-url, ...)
│   │   ├── styles/        — глобальные стили и design tokens
│   │   └── types/         — глобальные TypeScript типы
│   ├── supabase/          — SQL-скрипты для развёртывания БД
│   └── package.json
├── .github/workflows/     — CI/CD (typecheck + lint + build на каждый PR)
└── package.json           — husky pre-commit hooks
```

## 🧪 Тесты

```bash
cd frontend
npm run test
```

Покрытие — utility-функции (`build-comment-tree`, `is-video-url`, `format-date`, `truncate`, `get-error-message`).

## 📐 Стандарты кода

- **Airbnb JavaScript / React Style Guide** через `eslint-config-airbnb`
- **TypeScript strict** — запрет `any`
- **Prettier** — единое форматирование (одинарные кавычки, без точки с запятой, 100 char width)
- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- **Husky pre-commit** — автоматический запуск lint, format, typecheck перед каждым коммитом
- **CSS Modules** — изоляция стилей, без глобальных классов
