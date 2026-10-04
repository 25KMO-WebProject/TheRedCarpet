import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "127.0.0.1",
  port: Number(process.env.DB_EXPOSED_PORT),

  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  console.log("Testing db connection..");

  try {
    const result = await pool.query("SELECT 1 AS test");

    console.log("Connection successful!");
    console.log(result.rows);
  } catch (error) {
    console.error("Connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

async function importMovies(movieMap) {
  const movies = Array.from(movieMap.values());

  if (movies.length === 0) return 0;

  const batchSize = 500;

  let processed = 0;
  let inserted = 0;

  // Retrieve the property names from our movie objects.
  // Exclude the database-generated primary key.
  const columns = [
    ...new Set(movies.flatMap((movie) => Object.keys(movie))),
  ].filter((column) => column !== "id");

  if (!columns.includes("tmdb_id")) {
    throw new Error("Missing required tmdb_id property.");
  }

  // Safely quote PostgreSQL column identifiers.
  const quoteIdentifier = (identifier) =>
    `"${identifier.replaceAll('"', '""')}"`;

  // Generate the INSERT and SELECT column lists.
  const insertColumns = columns.map(quoteIdentifier).join(", ");

  const selectColumns = columns
    .map((column) => `m.${quoteIdentifier(column)}`)
    .join(", ");

  const query = `
        INSERT INTO public.movie (
            ${insertColumns}
        )

        SELECT
            ${selectColumns}

        FROM jsonb_populate_recordset(
            NULL::public.movie,
            $1::jsonb
        ) AS m

        ON CONFLICT (tmdb_id) DO NOTHING;
    `;

  process.stdout.write(`Movies processed: 0/${movies.length} (0%)`);

  try {
    for (let i = 0; i < movies.length; i += batchSize) {
      const batch = movies.slice(i, i + batchSize);

      const result = await pool.query(query, [JSON.stringify(batch)]);

      processed += batch.length;
      inserted += result.rowCount;

      const percentage = ((processed / movies.length) * 100).toFixed(1);

      process.stdout.write(
        `\rMovies processed: ${processed}/${movies.length} (${percentage}%)`,
      );
    }

    return inserted;
  } finally {
    process.stdout.write("\n");
  }
}

export { importMovies };
