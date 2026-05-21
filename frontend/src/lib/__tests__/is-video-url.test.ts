import { isVideoUrl } from '../is-video-url'

describe('isVideoUrl должно возвращать тру на формат расширений видосов', () => {
  it('должно возвращать тру для .mp4', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.mp4')).toBe(true)
  })

  it('должно возвращать тру для webm', () => {
    expect(isVideoUrl('https://shakal.com/QQ.webm')).toBe(true)
  })

  it('должно возвращать тру для mov', () => {
    expect(isVideoUrl('https://shakal.com/QQ.mov')).toBe(true)
  })

  it('должно возвращать тру для ogg', () => {
    expect(isVideoUrl('https://shakal.com/QQ.ogg')).toBe(true)
  })
})

describe('isVideoUrl должно возвращать фалс на расширения не видосов', () => {
  it('должно возвращать фалсе для jpg', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779092251972.jpg')).toBe(false)
  })

  it('должно возвращать фалсе для png', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779357449842.png')).toBe(false)
  })

  it('должно возвращать фалсе для webp', () => {
    expect(isVideoUrl('https://shakal.com/QQ.webp')).toBe(false)
  })

  it('должно возвращать фалсе для gif', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779092811179.gif')).toBe(false)
  })

  it('должно возвращать фалсе для юрлки без расширения', () => {
    expect(isVideoUrl('https://shakal.com/NotQQ')).toBe(false)
  })
})

describe('isVideoUrl независимость регистров', () => {
  it('должно распознавать расширение в верхнем регистре MP4', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.Mp4')).toBe(true)
  })

  it('должно распознавать расширение в смешанном регистре WebM', () => {
    expect(isVideoUrl('https://shakal.com/QQ.WebM')).toBe(true)
  })
})

describe('isVideoUrl юрл с query параметрами', () => {
  it('должно возвращать тру для видео с токенами и параметрами mp4?token=xxx', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.mp4?token=token')).toBe(true)
  })

  it('должно возвращать тру для видео с хэш-якорем mp4#content', () => {
    expect(isVideoUrl('https://shakal.com/QQ.mp4#contentNotNull')).toBe(true)
  })

  it('должно возвращать фалсе для картинок с параметрами ширины jpg?width=300...', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779147973868.jpg?width=300&height=200')).toBe(false)
  })
})

describe('isVideoUrl Подлянки', () => {
  it('должно возвращать false для пустой строки', () => {
    expect(isVideoUrl('')).toBe(false)
  })

  it('должно возвращать фалсе, если слово mp4 в названии, но расширение .jpg', () => {
    expect(isVideoUrl('https://shakal.com/myShakalmp4.jpg')).toBe(false)
  })

  it('должно возвращать фалсе для ложных совпадений без точки (somethingmp4)', () => {
    expect(isVideoUrl('https://shakal.com/myShakalmp4')).toBe(false)
  })
})