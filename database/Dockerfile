# Database Dockerfile
# Location: ./database/Dockerfile
#
# Build context: project root (.)
#
# The database initialization script is located at:
# ./api/init.sql

FROM postgres:18.6

COPY api/init.sql /docker-entrypoint-initdb.d/init.sql
