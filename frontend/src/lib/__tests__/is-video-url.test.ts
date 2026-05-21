import { isVideoUrl } from '../is-video-url'

describe('isVideoUrl должно возвращать true на формат расширений видосов', () => {
  it('должна возвращать true для .mp4', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.mp4')).toBe(true)
  })

  it('должна возвращать true для webm', () => {
    expect(isVideoUrl('https://example.com/QQ.webm')).toBe(true)
  })

  it('должна возвращать true для mov', () => {
    expect(isVideoUrl('https://example.com/QQ.mov')).toBe(true)
  })

  it('должна возвращать true для ogg', () => {
    expect(isVideoUrl('https://example.com/QQ.ogg')).toBe(true)
  })
})

describe('isVideoUrl должно возвращать false на расширения не видосов', () => {
  it('должно возвращать false для jpg', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779092251972.jpg')).toBe(false)
  })

  it('должно возвращать false для png', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779357449842.png')).toBe(false)
  })

  it('должно возвращать false для webp', () => {
    expect(isVideoUrl('https://example.com/QQ.webp')).toBe(false)
  })

  it('должно возвращать false для gif', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779092811179.gif')).toBe(false)
  })

  it('должно возвращать false для юрлки без расширения', () => {
    expect(isVideoUrl('https://example.com/NotQQ')).toBe(false)
  })
})

describe('isVideoUrl независимость регистров', () => {
  it('должно распознавать расширение в верхнем регистре MP4', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.Mp4')).toBe(true)
  })

  it('должно распознавать расширение в смешанном регистре WebM', () => {
    expect(isVideoUrl('https://example.com/QQ.WebM')).toBe(true)
  })
})

describe('isVideoUrl юрл с query параметрами', () => {
  it('должно возвращать true для видео с токенами и параметрами mp4?token=xxx', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.mp4?token=token')).toBe(true)
  })

  it('должно возвращать true для видео с хэш-якорем mp4#content', () => {
    expect(isVideoUrl('https://example.com/QQ.mp4#contentNotNull')).toBe(true)
  })

  it('должно возвращать false для картинок с параметрами ширины jpg?width=300...', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779147973868.jpg?width=300&height=200')).toBe(false)
  })

  it('должно возвращать true для видео с точкой в query signed URL', () => {
    expect(isVideoUrl('https://hwdeioovgmrayxvlsjku.supabase.co/storage/v1/object/public/posts/1779146472267.mp4?token=some.signed.token')).toBe(true)
  })

  it('должно возвращать true для видео с версией в query ?v=1.2.3', () => {
    expect(isVideoUrl('https://example.com/QQ.webm?v=1.2.3')).toBe(true)
  })

  it('должно возвращать false для картинки с точкой в query', () => {
    expect(isVideoUrl('https://example.com/QQ.jpg?v=1.2.3')).toBe(false)
  })
})

describe('isVideoUrl Подлянки', () => {
  it('должно возвращать false для пустой строки', () => {
    expect(isVideoUrl('')).toBe(false)
  })

  it('должна возвращать false, если слово mp4 в названии, но расширение .jpg', () => {
    expect(isVideoUrl('https://example.com/myShakalmp4.jpg')).toBe(false)
  })

  it('должна возвращать false для ложных совпадений без точки (somethingmp4)', () => {
    expect(isVideoUrl('https://example.com/myShakalmp4')).toBe(false)
  })
})