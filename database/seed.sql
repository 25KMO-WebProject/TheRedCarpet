BEGIN;


INSERT INTO public.account (id, username, email, password)
VALUES
(
    1,
    'Adam',
    'adam@example.com',
    '$2b$10$dzUe49kj5N3Du8Iw2a6XSebDzWSUj910oHiGIst5sv/Rl8r3esLXy'
),
(
    2,
    'Beth',
    'beth@example.com',
    '$2b$10$YFW2ahxmRDcNGOt2kCsi0uSl4dmnYorVehVVTpZJw./Hz1iJRB516'
),
(
    3,
    'Charlie',
    'charlie@example.com',
    '$2b$10$TNcIBS7al2pZBxPLSqYAbe1JIzP4F57BCnFFYTBjuJhmNO3zFbD.i'
),
(
    4,
    'Diana',
    'diana@example.com',
    '$2b$10$EL6oa9t3TGvzZ1okoxXng.qdigFdfUeVM7W3d13la53.WfElO4hPS'
),
(
    5,
    'Eric',
    'eric@example.com',
    '$2b$10$58uiFJ07EQaRErzXLaVby.uOiTk01j7TR/5L3E.pc..YMMEplZk8O'
);

-- =====================================================
-- MOVIES
-- =====================================================

INSERT INTO public.movie
(
    tmdb_id,
    title,
    description,
    duration,
    genre,
    release_date,
    backdrop_path,
    poster_path,
    small_backdrop_path,
    small_poster_path
)
VALUES
(
    603,
    'The Matrix',
    'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    '02:16:00',
    ARRAY['Action', 'Sci-Fi'],
    '1999-03-31',
    'https://image.tmdb.org/t/p/w600_and_h900_face/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_face/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
    'https://image.tmdb.org/t/p/w342/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg',
    'https://image.tmdb.org/t/p/w342/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg'
),
(
    27205,
    'Inception',
    'Dreams within dreams.',
    '02:28:00',
    ARRAY['Sci-Fi', 'Thriller'],
    '2010-07-16',
    'https://image.tmdb.org/t/p/w600_and_h900_face/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_face/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    'https://image.tmdb.org/t/p/w342/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    'https://image.tmdb.org/t/p/w342/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg'
),
(
    155,
    'The Dark Knight',
    'Batman joins forces with Lieutenant Jim Gordon and District Attorney Harvey Dent to dismantle organized crime in Gotham City. Their efforts are challenged by the Joker, a criminal mastermind who plunges the city into chaos.',
    '02:32:00',
    ARRAY['Drama', 'Action', 'Crime', 'Thriller'],
    '2008-07-16',
    'https://image.tmdb.org/t/p/w600_and_h900_face/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_face/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w342/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    'https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
),
(
    157336,
    'Interstellar',
    'A group of explorers travels through a newly discovered wormhole in space, searching for a habitable planet as Earth faces an environmental catastrophe that threatens the survival of humanity.',
    '02:49:00',
    ARRAY['Adventure', 'Drama', 'Science Fiction'],
    '2014-11-05',
    'https://image.tmdb.org/t/p/w600_and_h900_face/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_face/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://image.tmdb.org/t/p/w342/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
    'https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
),
(
    120,
    'The Lord of the Rings: The Fellowship of the Ring',
    'Young hobbit Frodo Baggins inherits a powerful and dangerous ring. Accompanied by a fellowship of companions, he embarks on a perilous journey toward Mount Doom, where the ring must be destroyed.',
    '02:59:00',
    ARRAY['Adventure', 'Fantasy', 'Action'],
    '2001-12-18',
    'https://image.tmdb.org/t/p/w600_and_h900_face/dUVbWINfRMGojGZRcO6GF1Z2nV8.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_face/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    'https://image.tmdb.org/t/p/w342/dUVbWINfRMGojGZRcO6GF1Z2nV8.jpg',
    'https://image.tmdb.org/t/p/w342/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg'
);

-- =====================================================
-- GROUPS
-- =====================================================

INSERT INTO public."group"
(
    id,
    id_owner,
    group_name,
    group_descr,
    creation_date
)
VALUES
(
    1,
    1,
    'SciFi Fans',
    'Group for science fiction movie enthusiasts.',
    NOW() - INTERVAL '90 days'
),
(
    2,
    2,
    'Movie Critics',
    'Discuss and review movies.',
    NOW() - INTERVAL '60 days'
),
(
    3,
    3,
    'Weekend Watchers',
    'Weekend movie recommendations.',
    NOW() - INTERVAL '30 days'
);

-- =====================================================
-- GROUP MEMBERS
-- =====================================================

INSERT INTO public.member_list
(
    id_group,
    id_account,
    join_date
)
VALUES
(1, 1, NOW() - INTERVAL '90 days'),
(1, 2, NOW() - INTERVAL '80 days'),
(1, 3, NOW() - INTERVAL '75 days'),

(2, 2, NOW() - INTERVAL '60 days'),
(2, 4, NOW() - INTERVAL '55 days'),
(2, 5, NOW() - INTERVAL '50 days'),

(3, 3, NOW() - INTERVAL '30 days'),
(3, 1, NOW() - INTERVAL '25 days');

-- =====================================================
-- JOIN REQUESTS
-- =====================================================

INSERT INTO public.join_request
(
    id_group,
    id_account,
    status
)
VALUES
(1, 5, 'PENDING'),
(2, 1, 'PENDING'),
(3, 4, 'APPROVED');

-- =====================================================
-- FAVOURITE MOVIES
-- =====================================================

-- Example TMDB favorites for seeded test accounts.
INSERT INTO public.favourite_movies
(
    id_account,
    tmdb_id,
    media_type
)
VALUES
    (1, 603, 'movie'),
    (1, 27205, 'movie'),
    (2, 27205, 'movie'),
    (2, 157336, 'movie'),
    (3, 155, 'movie'),
    (4, 157336, 'movie'),
    (5, 120, 'movie');

-- =====================================================
-- REVIEWS
-- =====================================================

INSERT INTO public.review
(
    id_account,
    id_movie,
    rating,
    description,
    date
)
VALUES
(
    1,
    1,
    5,
    'A groundbreaking sci-fi masterpiece.',
    NOW() - INTERVAL '20 days'
),
(
    2,
    2,
    5,
    'Mind-bending and brilliantly executed.',
    NOW() - INTERVAL '15 days'
),
(
    3,
    3,
    4,
    'Excellent performances and action.',
    NOW() - INTERVAL '12 days'
),
(
    4,
    4,
    5,
    'Beautiful and emotional science fiction.',
    NOW() - INTERVAL '10 days'
),
(
    5,
    5,
    4,
    'Epic fantasy adventure.',
    NOW() - INTERVAL '5 days'
);

-- Keep sequence values in sync
SELECT setval('account_id_seq', (SELECT MAX(id) FROM public.account));
SELECT setval('movie_id_seq', (SELECT MAX(id) FROM public.movie));
SELECT setval('"group_id_seq"', (SELECT MAX(id) FROM public."group"));

COMMIT;
