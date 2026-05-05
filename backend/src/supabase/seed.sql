insert into posts (user_id, title, body, image_url, tag) values
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Создаём первый сайт на React', 'Гайд для начинающих по созданию SPA на React.', 'https://picsum.photos/seed/post1/800/400',
 'создание сайтов'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'TypeScript: зачем он нужен', 'Почему TS экономит часы отладки.', 'https://picsum.photos/seed/post2/800/400',
 'размышления'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Supabase vs Firebase', 'Сравнение двух BaaS.', 'https://picsum.photos/seed/post3/800/400',
 'инструменты'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Адаптивная вёрстка 2026', 'Container queries, fluid typography.', 'https://picsum.photos/seed/post4/800/400',
 'вёрстка'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'CSS Modules vs Styled Components', 'Что выбрать в 2026.', 'https://picsum.photos/seed/post5/800/400',
 'инструменты'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'React Compiler', 'Как новый компилятор оптимизирует код.', 'https://picsum.photos/seed/post6/800/400',
 'размышления'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Формы с React Hook Form', 'Туториал.', 'https://picsum.photos/seed/post7/800/400',
 'создание сайтов'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Доступность (a11y) — основы', 'Удобство для всех.', 'https://picsum.photos/seed/post8/800/400',
 'вёрстка'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Vite vs CRA', 'Сравнение скорости.', 'https://picsum.photos/seed/post9/800/400',
 'инструменты'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', '5 книг для разработчика', 'Подборка.', 'https://picsum.photos/seed/post10/800/400',
 'размышления'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'CSS Grid', 'Практические примеры.', 'https://picsum.photos/seed/post11/800/400',
 'вёрстка'),
  ('d55ad54b-3310-4b32-bd68-3793428a81a8', 'Мой стек 2026', 'Чем пользуюсь.', 'https://picsum.photos/seed/post12/800/400',
 'размышления');

insert into stories (media_url) values
  ('https://picsum.photos/seed/story1/600/900'),
  ('https://picsum.photos/seed/story2/600/900'),
  ('https://picsum.photos/seed/story3/600/900'),
  ('https://picsum.photos/seed/story4/600/900'),
  ('https://picsum.photos/seed/story5/600/900');

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
  r1 as (insert into comments (post_id, user_id, body) select id, '4f860fb5-c6c0-4d19-aff0-69cedf6e1428', 'Отличный гайд!' from first_post returning id, post_id),
  r2 as (insert into comments (post_id, user_id, body) select id, '4f860fb5-c6c0-4d19-aff0-69cedf6e1428', 'А что насчёт SSR?' from first_post returning id, post_id)

insert into comments (post_id, user_id, parent_id, body)
  select post_id, owner_id, id, 'Спасибо!' from (values ('d55ad54b-3310-4b32-bd68-3793428a81a8'::uuid)) as t(owner_id), r1
  union all select post_id, 'd55ad54b-3310-4b32-bd68-3793428a81a8', id, 'Будет в следующей.' from r2;

insert into comments (post_id, user_id, body)
  select p.id, '4f860fb5-c6c0-4d19-aff0-69cedf6e1428', 'Согласен' from posts p offset 1 limit 5;
insert into comments (post_id, user_id, body)
  select p.id, 'd55ad54b-3310-4b32-bd68-3793428a81a8', 'Спасибо за фидбек' from posts p offset 2 limit 3;
