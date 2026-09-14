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
    id,
    title,
    description,
    duration,
    genre,
    release_date
)
VALUES
(
    1,
    'The Matrix',
    'A hacker discovers the true nature of reality.',
    '02:16:00',
    ARRAY['Action','Sci-Fi'],
    '1999-03-31'
),
(
    2,
    'Inception',
    'Dreams within dreams.',
    '02:28:00',
    ARRAY['Sci-Fi','Thriller'],
    '2010-07-16'
),
(
    3,
    'The Dark Knight',
    'Batman faces the Joker.',
    '02:32:00',
    ARRAY['Action','Crime'],
    '2008-07-18'
),
(
    4,
    'Interstellar',
    'Humanity searches for a new home.',
    '02:49:00',
    ARRAY['Sci-Fi','Drama'],
    '2014-11-07'
),
(
    5,
    'The Lord of the Rings',
    'A journey to destroy the One Ring.',
    '03:21:00',
    ARRAY['Fantasy','Adventure'],
    '2001-12-19'
);

-- =====================================================
-- GROUPS
-- =====================================================

INSERT INTO public."group"
(
    id,
    owner_id,
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

INSERT INTO public.favourite_movies
(
    id_account,
    id_movie
)
VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 4),
(3, 3),
(4, 4),
(5, 5);

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
