# Database Dockerfile
# Location: ./database/Dockerfile
#
# Build context: project root (.)
#

FROM postgres:18.6

COPY database/init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY database/seed.sql /docker-entrypoint-initdb.d/02-seed.sql
