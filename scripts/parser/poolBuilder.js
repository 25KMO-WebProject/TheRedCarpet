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

  // Number of movies processed per query.
  const batchSize = 500;

  // Progress counters.
  let processed = 0;
  let inserted = 0;

  const query = `
        INSERT INTO public.movie

        SELECT *
        FROM jsonb_populate_recordset(
            NULL::public.movie,
            $1::jsonb
        )

        ON CONFLICT (id) DO NOTHING;
    `;

  try {
    // Initial progress indicator.
    process.stdout.write(`\rMovies processed: 0/${movies.length} (0%)`);

    // Iterate through the array in batches.
    for (let i = 0; i < movies.length; i += batchSize) {
      // Extract the next batch.
      const batch = movies.slice(i, i + batchSize);

      // Execute the insertion.
      const result = await pool.query(query, [JSON.stringify(batch)]);

      // Update counters.
      processed += batch.length;
      inserted += result.rowCount;

      // Calculate progress percentage.
      const percentage = ((processed / movies.length) * 100).toFixed(1);

      // Update the same terminal line.
      process.stdout.write(
        `\rMovies processed: ${processed}/${movies.length} (${percentage}%)`,
      );
    }

    // Move to a new line after completing the import.
    process.stdout.write("\n");

    console.log(`New movies inserted: ${inserted}`);

    return inserted;
  } catch (error) {
    process.stdout.write("\n");
    console.error("Movie import failed:", error);

    throw error;
  }
}

export { importMovies };
