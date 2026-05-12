import { getErrorMessage, DEFAULT_ERROR_MESSAGE} from "../get-error-message";

describe('ggetErrorMessage', () => {
    it('должно возвращать .message из объекта Error', () => {
        const error = new Error('Ошибка из Error')
        expect(getErrorMessage(error)).toBe('Ошибка из Error')
    })

    it('должна вернуть .message из ошибки суповой основы', () => {
        const errorObj = { message: 'Ошибка базы данных'}
        expect(getErrorMessage(errorObj)).toBe('Ошибка базы данных')
    })

    it('должно вернуть саму строку если передана строка', () => {
        const errorString = 'Текстовая ошибка'
        expect(getErrorMessage(errorString)).toBe('Текстовая ошибка')
    })

    it('должно вернуть дефолтное сообщение для null', () => {
        expect(getErrorMessage(null)).toBe(DEFAULT_ERROR_MESSAGE)
    })

    it('должно вернуть дефолтное для undefined', () => {
        expect(getErrorMessage(undefined)).toBe(DEFAULT_ERROR_MESSAGE)
    })

    it('должно вернуть дефолтное сообщение для объекта без поля message', () =>{
        const Obj = {code: 500}
        expect(getErrorMessage(Obj)).toBe(DEFAULT_ERROR_MESSAGE)
    })

    it('должно вернуть дефолтное сообщение для чисел и булева', () => {
        expect(getErrorMessage(1234567890)).toBe(DEFAULT_ERROR_MESSAGE)
        expect(getErrorMessage(false)).toBe(DEFAULT_ERROR_MESSAGE)
    })
})