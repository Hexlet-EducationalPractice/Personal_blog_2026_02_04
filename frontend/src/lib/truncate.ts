export const truncate = (text: string, max: number): string => {
    if (text.length <= max) {
        return text
    }
    return text.slice(0, max).trimEnd() + '...'
}
//вот так проверять
console.log('hellooooooooooooooo', 10)