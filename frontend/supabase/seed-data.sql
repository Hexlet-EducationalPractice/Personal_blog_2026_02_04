insert into posts (user_id, title, body, image_url, tag) values
  ('<OWNER_UUID>', 'Создаём первый сайт на React', 'Гайд для начинающих по созданию SPA на React.', 'https://picsum.photos/seed/post1/800/400',
 'создание сайтов'),
  ('<OWNER_UUID>', 'TypeScript: зачем он нужен', 'Почему TS экономит часы отладки.', 'https://picsum.photos/seed/post2/800/400',
 'размышления'),
  ('<OWNER_UUID>', 'Supabase vs Firebase', 'Сравнение двух BaaS.', 'https://picsum.photos/seed/post3/800/400',
 'инструменты'),
  ('<OWNER_UUID>', 'Адаптивная вёрстка 2026', 'Container queries, fluid typography.', 'https://picsum.photos/seed/post4/800/400',
 'вёрстка'),
  ('<OWNER_UUID>', 'CSS Modules vs Styled Components', 'Что выбрать в 2026.', 'https://picsum.photos/seed/post5/800/400',
 'инструменты'),
  ('<OWNER_UUID>', 'React Compiler', 'Как новый компилятор оптимизирует код.', 'https://picsum.photos/seed/post6/800/400',
 'размышления'),
  ('<OWNER_UUID>', 'Формы с React Hook Form', 'Туториал.', 'https://picsum.photos/seed/post7/800/400',
 'создание сайтов'),
  ('<OWNER_UUID>', 'Доступность (a11y) — основы', 'Удобство для всех.', 'https://picsum.photos/seed/post8/800/400',
 'вёрстка'),
  ('<OWNER_UUID>', 'Vite vs CRA', 'Сравнение скорости.', 'https://picsum.photos/seed/post9/800/400',
 'инструменты'),
  ('<OWNER_UUID>', '5 книг для разработчика', 'Подборка.', 'https://picsum.photos/seed/post10/800/400',
 'размышления'),
  ('<OWNER_UUID>', 'CSS Grid', 'Практические примеры.', 'https://picsum.photos/seed/post11/800/400',
 'вёрстка'),
  ('<OWNER_UUID>', 'Мой стек 2026', 'Чем пользуюсь.', 'https://picsum.photos/seed/post12/800/400',
 'размышления');

insert into stories (media_url, title) values
  ('https://videocdn.cdnpk.net/videos/4fd1b1f4-5a80-5346-b4ee-1675a8409047/vertical/previews/magnific_watermarked/large.mp4', 'Вечерняя река'),
  ('https://videocdn.cdnpk.net/videos/fd3021c5-a984-479b-9478-3ff679b7a9fb/vertical/previews/magnific_watermarked/large.mp4', 'Лес'),
  ('https://videocdn.cdnpk.net/videos/b7527c17-b8bf-589d-abe2-5c6f3ccba4c4/vertical/previews/magnific_watermarked/large.mp4', 'Космос'),
  ('https://videocdn.cdnpk.net/videos/fe7af2a6-3486-4c59-9a7b-49114a75a949/vertical/previews/magnific_watermarked/large.mp4', 'Лес 2'),
  ('https://videocdn.cdnpk.net/videos/db922dae-64ff-5e6d-9e1d-bb043ca1202c/vertical/previews/magnific_watermarked/large.mp4', 'Река');

insert into works (title, description, image_url, tags, url) values
  ('Лендинг кофейни', 'Адаптив с анимацией', 'https://picsum.photos/seed/w1/600/400',
 '{лендинг,анимация}', 'https://example.com/1'),
  ('Блог на Next.js', 'MDX, тёмная тема', 'https://picsum.photos/seed/w2/600/400',
 '{Next.js,блог}', 'https://example.com/2'),
  ('Дашборд аналитики', 'Графики Chart.js', 'https://picsum.photos/seed/w3/600/400',
 '{дашборд,React}', 'https://example.com/3'),
  ('TG mini-app', 'Магазин в Telegram', 'https://picsum.photos/seed/w4/600/400',
 '{telegram}', 'https://example.com/4'),
  ('Игра на canvas', 'Платформер', 'https://picsum.photos/seed/w5/600/400',
 '{canvas,игра}', 'https://example.com/5');

with first_post as (select id from posts order by created_at limit 1),
  r1 as (insert into comments (post_id, user_id, body) select id, '<REGULAR_UUID>', 'Отличный гайд!' from first_post returning id, post_id),
  r2 as (insert into comments (post_id, user_id, body) select id, '<REGULAR_UUID>', 'А что насчёт SSR?' from first_post returning id, post_id)

insert into comments (post_id, user_id, parent_id, body)
  select post_id, owner_id, id, 'Спасибо!' from (values ('<OWNER_UUID>'::uuid)) as t(owner_id), r1
  union all select post_id, '<OWNER_UUID>', id, 'Будет в следующей.' from r2;

insert into comments (post_id, user_id, body)
  select p.id, '<REGULAR_UUID>', 'Согласен' from posts p offset 1 limit 5;
insert into comments (post_id, user_id, body)
  select p.id, '<OWNER_UUID>', 'Спасибо за фидбек' from posts p offset 2 limit 3;