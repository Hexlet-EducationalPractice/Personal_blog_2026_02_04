import { truncate } from "../truncate";

describe('truncate', () => {
    it('должно обрезать строку если она длиннее maxlength', () => {
        const text = 'Длинный текст да да дад аддада дада'
        const maxLength = 13
        const result = truncate(text, maxLength)

        expect(result).toBe('Длинный текст...')
    })

    it('не должно обрезать строку если она короче maxLength', () => {
        const text = 'Привет мир'
        expect(truncate(text, 10)).toBe('Привет мир')
    })

    it('не должно обрезать строку если ее длина равна', () => {
        const text = '123456'
        expect(truncate(text, 6)).toBe('123456')
    })

    it('должно вернуть пустую строку если на вход пришла пустая строка', () => {
        expect(truncate('', 6)).toBe('')
    })

    it('должно корректно работать с maxLength 0', () => {
        expect(truncate('NotHello world', 0)).toBe('...')
    })

    it('должно вернуть всю строку если maxLength в отрицательном росте', () => {
        const text = 'Отрицательный рост'
        expect(truncate(text, -1)).toBe('Отрицательный рост...')
    })
})