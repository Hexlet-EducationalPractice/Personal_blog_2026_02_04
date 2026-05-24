import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { SignInForm } from '@/features/auth/components/SignInForm'
import { SignUpForm } from '@/features/auth/components/SignUpForm'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import styles from './Auth.module.css'

type Mode = 'login' | 'register' | 'restore'

export function Auth() {
  const { user, isLoading } = useAuth()
  const [mode, setMode] = useState<Mode>('login')

  if (isLoading) return null
  if (user) return <Navigate to="/" replace />

  const titles: Record<Mode, string> = {
    login: 'Вход',
    register: 'Регистрация',
    restore: 'Восстановление пароля',
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{titles[mode]}</h1>

        {mode === 'login' && <SignInForm />}
        {mode === 'register' && <SignUpForm />}
        {mode === 'restore' && <ForgotPasswordForm />}

        <div className={styles.links}>
          {mode !== 'restore' && (
            <button type="button" className={styles.linkBtn} onClick={() => setMode('restore')}>
              забыли пароль?
            </button>
          )}

          {mode !== 'register' && (
            <button type="button" className={styles.linkBtn} onClick={() => setMode('register')}>
              регистрация
            </button>
          )}

          {mode !== 'login' && (
            <button type="button" className={styles.linkBtn} onClick={() => setMode('login')}>
              войти
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
