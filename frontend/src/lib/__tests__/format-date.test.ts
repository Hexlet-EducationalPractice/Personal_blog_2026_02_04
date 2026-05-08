import { formatDate } from "../format-date";
import { describe, it, expect, vi } from "vitest";

describe('formatDate База базированная', () => {

    it('Функция должна возвращать на пустую строку также пустую строку', () => {
     const result = formatDate('')

     expect(result).toBe('')
    })
    it('Функция должна правильно форматировать валидную дату', () => {
        const input = '2026-05-07T10:00:00Z'
        const result = formatDate(input)

        expect(result).toContain('7 мая 2026')
    })
})

describe('Границы часовых поясов', () => {

  it('Начало дня не должно откатываться по дню', () => {
    vi.stubEnv('TZ', 'America/New_York')
    
    const input = '2026-05-07T00:00:01Z' 
    const result = formatDate(input)

    expect(result).toContain('7 мая 2026')
    
    vi.unstubAllEnvs()
  })

  it('Конец дня не должно прыгать на следующее число в восточных поясах', () => {
    vi.stubEnv('TZ', 'Asia/Tokyo') 
    
    const input = '2026-05-07T23:59:59Z' 
    const result = formatDate(input)

    expect(result).toContain('7 мая 2026')
    
    vi.unstubAllEnvs()
  })
})

describe('formatDate Supabase интеграция движухи', () => {

  it('должна обрабатывать null когда поле created_at пустое, никогда не вернемся в 1970 год', () => {
    const result = formatDate(null as unknown as string)
    
    expect(result).toBe('')
  })

  it('Должна обрабатывать undefined', () => {
    const result = formatDate(undefined as unknown as string)
    
    expect(result).toBe('')
  })

  it('Проверка на работу с миллисекундами', () => {
    vi.stubEnv('TZ', 'UTC')
  
    const Supabase = '2026-05-07T18:30:45.123456+00:00'
    const result = formatDate(Supabase)

    expect(result).toContain('7 мая 2026')
  
    vi.unstubAllEnvs()
  })
})