
-- PostgreSQL database initialization script
BEGIN;

CREATE TABLE IF NOT EXISTS public.account
(
    id serial NOT NULL,
    username character varying(16) NOT NULL,
    email character varying(64) NOT NULL,
    password character varying(64) NOT NULL,

    CONSTRAINT account_pkey
        PRIMARY KEY (id),

    CONSTRAINT account_username_key
        UNIQUE (username),

    CONSTRAINT account_email_key
        UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public."group"
(
    id serial NOT NULL,
    owner_id integer NOT NULL,
    group_name character varying(64) NOT NULL,
    group_descr character varying(255),
    creation_date timestamp with time zone NOT NULL,

    CONSTRAINT group_pkey
        PRIMARY KEY (id),

    CONSTRAINT group_owner_fk
        FOREIGN KEY (owner_id)
        REFERENCES public.account (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE public."group"
    IS 'Users can create different groups';

CREATE TABLE IF NOT EXISTS public.member_list
(
    id serial NOT NULL,
    group_id integer NOT NULL,
    join_date timestamp with time zone,

    CONSTRAINT member_list_pkey
        PRIMARY KEY (id),

    CONSTRAINT member_list_group_fk
        FOREIGN KEY (group_id)
        REFERENCES public."group" (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.join_request
(
    id serial NOT NULL,
    group_id integer NOT NULL,
    account_id integer NOT NULL,
    approved boolean NOT NULL,

    CONSTRAINT join_request_pkey
        PRIMARY KEY (id),

    CONSTRAINT join_request_group_fk
        FOREIGN KEY (group_id)
        REFERENCES public."group" (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT join_request_account_fk
        FOREIGN KEY (account_id)
        REFERENCES public.account (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE public.join_request
    IS 'List of users, who have requested to join the group';

CREATE TABLE IF NOT EXISTS public.movie
(
    id serial NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    duration interval NOT NULL,
    genre character varying(255) NOT NULL,
    "release date" date,

    CONSTRAINT movie_pkey
        PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.favourite_movies
(
    id serial NOT NULL,
    account_id integer NOT NULL,
    movie_id integer NOT NULL,

    CONSTRAINT favourite_movies_pkey
        PRIMARY KEY (id),

    CONSTRAINT favourite_movies_account_fk
        FOREIGN KEY (account_id)
        REFERENCES public.account (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT favourite_movies_movie_fk
        FOREIGN KEY (movie_id)
        REFERENCES public.movie (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT favourite_movies_unique
        UNIQUE (account_id, movie_id)
);

CREATE TABLE IF NOT EXISTS public.review
(
    id serial NOT NULL,
    id_account integer NOT NULL,
    id_movie integer NOT NULL,
    rating smallint NOT NULL,
    description character varying(512) NOT NULL,
    date timestamp with time zone NOT NULL,

    CONSTRAINT review_pkey
        PRIMARY KEY (id),

    CONSTRAINT review_account_fk
        FOREIGN KEY (id_account)
        REFERENCES public.account (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT review_movie_fk
        FOREIGN KEY (id_movie)
        REFERENCES public.movie (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMIT;