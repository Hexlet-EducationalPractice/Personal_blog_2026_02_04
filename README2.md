## Installation

````markdown
## Установка после клона

### Пошаговая инструкция

1. **Клонируем репозиторий и переключаемся на dev:**

   ```bash
   git clone https://github.com/Hexlet-EducationalPractice/Personal_blog_2026_02_04.git
   cd Personal_blog_2026_02_04
   git checkout dev
   ```
````

2. **Устанавливаем зависимости в корне репо** (это активирует husky pre-commit hook):

   ```bash
   npm install
   ```

   ⚠️ **Этот шаг обязателен.** В корневом `package.json` есть скрипт `prepare: husky`, который при `npm install` настраивает git-хуки. Без этого `npm run lint` не будет автоматически запускаться при коммите, и можно случайно закоммитить сломанный код.

3. **Устанавливаем зависимости фронта:**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Устанавливаем зависимости бэка:**

   ```bash
   cd backend
   npm install
   cd ..
   ```

5. **Создаём локальные `.env` файлы:**

   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

   Заполнить значения (URL API, секреты JWT, connection string Supabase). Эти файлы НЕ коммитятся — они у каждого свои.

6. **Запускаем фронт (в отдельном терминале):**

   ```bash
   cd frontend
   npm run dev
   ```

   Откроется на http://localhost:5173

7. **Запускаем бэк (в отдельном терминале):**

   ```bash
   cd backend
   npm run dev
   ```

   Слушает на http://localhost:3000

### Проверка что pre-commit hook работает

После `npm install` в корне сделай тестовый коммит:

1. Создай файл `frontend/src/test.ts` с заведомо сломанным кодом:
   ```ts
   const unused: any = 42;
   ```
2. `git add frontend/src/test.ts`
3. `git commit -m "test"` — **должно упасть** с ошибками ESLint (any запрещён, unused-vars).
4. Удали тестовый файл, ничего не пушь.

Если коммит **прошёл без ошибок** — значит pre-commit hook не активировался.

### Если pre-commit hook не работает

1. **Убедись что ты сделал `npm install` в корне** репо (не только во `frontend/`):

   ```bash
   cd <корень репо>
   npm install
   ```

2. **Проверь что файл `.git/hooks/pre-commit` существует:**

   ```bash
   ls .git/hooks/pre-commit
   ```

   Если не существует — установи husky вручную из корня:

   ```bash
   npx husky init
   ```

3. **Проверь содержимое `.husky/pre-commit`:**

   Должно быть:

   ```
   npx lint-staged
   ```

4. **Если на Windows и видишь иероглифы вместо ошибок ESLint** — используй PowerShell или VSCode Terminal вместо Git Bash. Либо включи UTF-8 в Git Bash командой:
   ```bash
   chcp.com 65001
   ```

### Если очень срочно нужно закоммитить (НЕ рекомендуется)

```bash
git commit -m "msg" --no-verify
```
