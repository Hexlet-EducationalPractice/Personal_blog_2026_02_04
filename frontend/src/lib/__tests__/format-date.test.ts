import { formatDate } from "../format-date";

describe('formatDate это база', () => {
  it('должна возвращать пустую строку при передаче пустой строки', () => {
    const result = formatDate('')
    expect(result).toBe('')
  })

  it('должна правильно форматировать валидную исошную дату', () => {
    const input = '2026-05-07T10:00:00Z'
    const result = formatDate(input)
    expect(result).toContain('7 мая 2026')
  })
})

describe('formatDate: Timezone Boundaries (UTC Mode)', () => {

  it('начало дня (00:00:01Z) должно оставаться тем же числом', () => {
    const input = '2026-05-07T00:00:01Z' 
    const result = formatDate(input)
    expect(result).toContain('7 мая 2026')
  })

  it('конец дня (23:59:59Z) не должен перепрыгивать на следующее число', () => {
    const input = '2026-05-07T23:59:59Z' 
    const result = formatDate(input)
    expect(result).toContain('7 мая 2026')
  })
})

describe('formatDate: Edge Cases and Integrations', () => {
  it('должна обрабатывать null', () => {
    const result = formatDate(null)
    expect(result).toBe('')
  })

  it('должна обрабатывать undefined', () => {
    const result = formatDate(undefined)
    expect(result).toBe('')
  })

  it('должна корректно работать с форматом дат супавой основой', () => {
    const supabaseDate = '2026-05-07T18:30:45.123456+00:00'
    const result = formatDate(supabaseDate)
    expect(result).toContain('7 мая 2026')
  })
})