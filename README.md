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

    ACCOUNT {
        SERIAL id PK
        VARCHAR_16 username
        VARCHAR_64 email
        VARCHAR_64 password
    }

    GROUP {
        SERIAL id PK
        INTEGER id_owner FK
        VARCHAR_64 group_name
        VARCHAR_255 group_descr
        TIMESTAMPTZ creation_date

        UNIQUE group_name_owner_id
    }

    MEMBER_LIST {
        INTEGER id_account PK,FK
        INTEGER id_group PK,FK
        TIMESTAMPTZ join_date
    }

    JOIN_REQUEST {
        INTEGER id_account PK,FK
        INTEGER id_group PK,FK
        VARCHAR_8 status
    }

    MOVIE {
        SERIAL id PK
        VARCHAR_255 title
        TEXT description
        INTERVAL duration
        VARCHAR_ARRAY genre
        DATE release_date
    }

    FAVOURITE_MOVIES {
        INTEGER id_account PK,FK
        INTEGER id_movie PK,FK
    }

    REVIEW {
        INTEGER id_account PK,FK
        INTEGER id_movie PK,FK
        SMALLINT rating
        VARCHAR_512 description
        TIMESTAMPTZ date
    }


    %% Group ownership
    ACCOUNT ||--o{ GROUP : owns

    %% Memberships
    ACCOUNT ||--o{ MEMBER_LIST : has_membership
    GROUP ||--o{ MEMBER_LIST : contains_member

    %% Join requests
    ACCOUNT ||--o{ JOIN_REQUEST : submits
    GROUP ||--o{ JOIN_REQUEST : receives

    %% Favourite movies
    ACCOUNT ||--o{ FAVOURITE_MOVIES : favorites
    MOVIE ||--o{ FAVOURITE_MOVIES : favorited_by

    %% Reviews
    ACCOUNT ||--o{ REVIEW : writes
    MOVIE ||--o{ REVIEW : receives
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


## Login requirements
- User email works as an username
- User email can be max 64 characters
- Password requirements:
    - 8-64 characters
    - Must contain one uppercase letter
    - Must contain one number
