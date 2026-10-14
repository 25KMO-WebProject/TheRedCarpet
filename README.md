# The Red Carpet
The project assignment is to develop a website for movie enthusiasts.

The application will make use of the open-data sources mentioned later. The browser-based part of the application will be implemented using React, and the server will be built with Node. PostgreSQL will be used as the database.

The open-data API to be used is [The Movie Database](https://developer.themoviedb.org/reference/intro/getting-started), which contains a large amount of open data related to movies. Using the API requires registration, after which the necessary API key/token can be obtained.


# Tools
- Swagger
- pgAdmin
- Github:
- Visual Studio Code:
- PostgreSQL


# Documentation

<img width="961" height="912" alt="Tilakaavio" src="https://github.com/user-attachments/assets/7f7d2255-12c5-4aec-aec2-6de43230c11e" />

## UI-Design
<img width="834" height="1263" alt="UI-Design" src="https://github.com/user-attachments/assets/3862379b-f602-4d92-a608-e1723b0c62d3" />


## Tech stack / application architecture
REST API - Node.js/Express\
Frontend - JS React\
Database - PostgreSQL

## ERD
```mermaid
erDiagram

    account {
        serial id PK
        varchar username UK "max 16"
        varchar email "max 64"
        varchar password "max 64"
        varchar favorites_share_token UK "max 36, nullable"
    }

    group {
        serial id PK
        int id_owner FK
        varchar group_name "max 64"
        varchar group_descr "max 255, nullable"
        timestamptz creation_date
    }

    member_list {
        int id_group PK, FK
        int id_account PK, FK
        timestamptz join_date "nullable"
    }

    join_request {
        int id_group PK, FK
        int id_account PK, FK
        varchar status "max 8"
    }

    group_movies {
        int id_group PK, FK
        int tmdb_id PK
        varchar media_type PK "movie or tv"
        timestamptz created_at
    }

    favourite_movies {
        int id_account PK, FK
        int tmdb_id PK
        varchar media_type PK "movie or tv"
        timestamptz created_at
    }

    movie {
        serial id PK
        varchar tmdb_id UK "max 16"
        varchar title "max 255"
        text description "nullable"
        interval duration
        varchar_array genre
        date release_date "nullable"
    }

    review {
        int id_account PK, FK
        int id_movie PK, FK
        smallint rating
        varchar description "max 512"
        timestamptz date
    }

    account ||--o{ group : owns
    account ||--o{ member_list : joins
    group ||--o{ member_list : contains

    account ||--o{ join_request : submits
    group ||--o{ join_request : receives

    group ||--o{ group_movies : contains
    account ||--o{ favourite_movies : saves

    account ||--o{ review : writes
    movie ||--o{ review : receives

```

## API

```mermaid
graph TD
    A("API (localhost:3000)")

    A --> acc["/accounts"]
    acc --> accId["GET /accounts/id/:id"]
    acc --> accAll["GET /accounts/"]
    acc --> accLogin["POST /accounts/login/"]

    A --> mov["/movies"]
    mov --> movAll["GET /movies/"]

    mov --> movId["GET /movies/title/:title"]


```

## Parser

To scrape some data from the API you need the necessary API key and access key.
The default code will scrape 200 top rated movies from January 1st 1800 to current day.

To catch more you need to replace ``fetchMoviesFromApi({value})``.
The value represents pages, my testing resulted that around 100 pages API stream starts putting the break.

```javascript
  await fetchMoviesFromApi(10);

```


```javascript
node scripts/parser/interface.js

```



## Login requirements
- User email works as an username
- User email can be max 64 characters
- Password requirements:
    - 8-64 characters
    - Must contain one uppercase letter
    - Must contain one number
