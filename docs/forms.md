# Работа с формами

Все формы проекта используют связку **React Hook Form + Zod + наши UI-компоненты** (`<Input>`, `<Textarea>`, `<Button>`). Не используйте `useState` для значений полей — пользуйтесь `react-hook-form`.

## Минимальный пример

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input/Input'
import { Button } from '@/components/ui/Button/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage/ErrorMessage'

// 1. Описываем схему — один источник правды
const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

// 2. Получаем тип ИЗ схемы (не дублируем!)
type FormValues = z.infer<typeof schema>

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    // data типизирован: { email: string, password: string }
    try {
      await someApiCall(data)
    } catch (e) {
      // показать ошибку через setServerError
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Пароль"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        Войти
      </Button>
    </form>
  )
}
```

## Правила

1. **Не использовать `any`** — типы строго через `z.infer<typeof schema>`.
2. **Не передавать `value` и `onChange` руками** — для подключения поля используется `{...register('field')}`.
3. **Состояние сабмита** — берётся из `formState.isSubmitting`, на кнопку передаётся как `loading={isSubmitting}`.
4. **Серверные ошибки** (от Supabase, например) показываются **отдельно над формой** через `<ErrorMessage>`, а не внутри полей. Поля показывают только клиентские ошибки валидации.
5. **Все поля используют наши UI-компоненты** (`<Input>`, `<Textarea>`) — не `<input>` и `<textarea>` напрямую.

## Совпадение паролей

Когда нужно проверить что два поля совпадают (новый пароль и его подтверждение):

```ts
const schema = z.object({
  password: z.string().min(6),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Пароли не совпадают',
  path: ['confirm'], // указываем какому полю принадлежит ошибка
})
```

`refine` принимает функцию-проверку и объект с настройками: `message` — текст ошибки, `path` — куда её прикрепить.

## Опциональные поля

Когда поле необязательное (например, новый пароль в профиле — может быть пустым):

```ts
const schema = z.object({
  password: z.string().min(6).or(z.literal('')),
})
```

`.or(z.literal(''))` означает "либо валидная строка от 6 символов, либо пустая строка".

---

## Файлы для изменения

Перечислите основные файлы:

- 
- `frontend/package.json` 
- `frontend/package-lock.json`
- `docs/forms.md`

---

## Критерии приемки

- [ ] Установлены `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] `frontend/package.json` обновлён, в `dependencies` появились 3 пакета
- [ ] `docs/forms.md` создан и содержит полный пример из шаблона
- [ ] PR создан в `dev`, CI зелёный

---

## Дополнительно

- API-документация: https://inquisitive-gnome-861106.netlify.app/
- Макет: ссылка на Figma (см. README)
- ТЗ: см. корневой `README.md`
- Работа с git: https://docs.google.com/document/d/143cvjPCxAM7DnZ4ef9DKkKEnwyZInurdtIgfV8l3sJc/edit?tab=t.0

- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Resolvers: https://github.com/react-hook-form/resolvers

---

## Чеклист

- [ ] Задача понятна
- [ ] Указаны требования
- [ ] Указаны технические детали
- [ ] Указаны файлы
- [ ] Определена область (frontend/backend/fullstack)
- [ ] Добавлены labels