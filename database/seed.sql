-- Development seed data
-- Seeds:
--   - account
--   - movie

BEGIN;

-- ============================================================
-- Accounts
-- ============================================================

INSERT INTO public.account
    (id, username, email, password)
VALUES
    (1, 'Alice',   'alice@example.com',   'AliceTEST'),
    (2, 'Bob',     'bob@example.com',     'BobTEST'),
    (3, 'Charlie', 'charlie@example.com', 'CharlieTEST'),
    (4, 'David',   'david@example.com',   'DavidTEST'),
    (5, 'Eve',     'eve@example.com',     'EveTEST');

-- ============================================================
-- Movies
-- ============================================================

INSERT INTO public.movie
    (id, title, description, duration, genre, "release date")
VALUES
    (
        1,
        'The Matrix',
        'A hacker discovers a hidden reality controlled by machines.',
        INTERVAL '2 hours 16 minutes',
        'Science Fiction',
        '1999-03-31'
    ),
    (
        2,
        'Inception',
        'A skilled extractor enters dreams to steal and plant ideas.',
        INTERVAL '2 hours 28 minutes',
        'Science Fiction',
        '2010-07-16'
    ),
    (
        3,
        'The Dark Knight',
        'Batman faces a criminal mastermind who throws Gotham into chaos.',
        INTERVAL '2 hours 32 minutes',
        'Action',
        '2008-07-18'
    ),
    (
        4,
        'Interstellar',
        'Explorers travel through a wormhole in search of a new home for humanity.',
        INTERVAL '2 hours 49 minutes',
        'Science Fiction',
        '2014-11-07'
    ),
    (
        5,
        'Pulp Fiction',
        'Several interconnected stories unfold in the criminal underworld of Los Angeles.',
        INTERVAL '2 hours 34 minutes',
        'Crime',
        '1994-10-14'
    ),
    (
        6,
        'The Shawshank Redemption',
        'A banker forms a friendship and seeks hope while serving a life sentence.',
        INTERVAL '2 hours 22 minutes',
        'Drama',
        '1994-09-23'
    ),
    (
        7,
        'The Lord of the Rings: The Fellowship of the Ring',
        'A hobbit begins a dangerous journey to destroy a powerful ring.',
        INTERVAL '2 hours 58 minutes',
        'Fantasy',
        '2001-12-19'
    ),
    (
        8,
        'Spirited Away',
        'A young girl enters a mysterious spirit world and must find her way home.',
        INTERVAL '2 hours 5 minutes',
        'Animation',
        '2001-07-20'
    ),
    (
        9,
        'Parasite',
        'A struggling family becomes entangled with a wealthy household.',
        INTERVAL '2 hours 12 minutes',
        'Thriller',
        '2019-05-30'
    ),
    (
        10,
        'Whiplash',
        'An ambitious young drummer is pushed to his limits by an uncompromising teacher.',
        INTERVAL '1 hour 46 minutes',
        'Drama',
        '2014-10-10'
    );

-- ============================================================
-- Reset sequences
-- ============================================================
-- Explicit IDs were used above, so make sure future generated
-- IDs continue after the seeded records.

SELECT setval(
    pg_get_serial_sequence('public.account', 'id'),
    COALESCE((SELECT MAX(id) FROM public.account), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('public.movie', 'id'),
    COALESCE((SELECT MAX(id) FROM public.movie), 1),
    true
);

COMMIT;
