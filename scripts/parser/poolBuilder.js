import { writeFile } from "node:fs/promises";
import path from "node:path";

async function importMovies(movieMap) {
  const movies = Array.from(movieMap.values());

  if (movies.length === 0) return 0;

  const batchSize = 500;
  const sqlStatements = [
    "-- Generated movie seed data",
    "SET standard_conforming_strings = on;",
    "BEGIN;",
  ];

  const columns = [
    ...new Set(movies.flatMap((movie) => Object.keys(movie))),
  ].filter((column) => column !== "id");

  if (!columns.includes("tmdb_id")) {
    throw new Error("Missing required tmdb_id property.");
  }

  const quoteIdentifier = (identifier) =>
    `"${identifier.replaceAll('"', '""')}"`;

  const insertColumns = columns.map(quoteIdentifier).join(", ");

  const selectColumns = columns
    .map((column) => `m.${quoteIdentifier(column)}`)
    .join(", ");

  let processed = 0;

  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);

    // Escape single quotes for PostgreSQL string literals.
    const json = JSON.stringify(batch).replaceAll("'", "''");

    const query = `
INSERT INTO public.movie (
    ${insertColumns}
)
SELECT
    ${selectColumns}
FROM jsonb_populate_recordset(
    NULL::public.movie,
    '${json}'::jsonb
) AS m
ON CONFLICT (tmdb_id) DO NOTHING;
`;

    sqlStatements.push(query);

    processed += batch.length;

    const percentage = ((processed / movies.length) * 100).toFixed(1);

    process.stdout.write(
      `\rMovies prepared: ${processed}/${movies.length} (${percentage}%)`,
    );
  }

  sqlStatements.push("COMMIT;");

  const outputPath = path.resolve(process.cwd(), "seed2.sql");

  await writeFile(outputPath, sqlStatements.join("\n\n"), "utf8");

  console.log(`\nSeed file created: ${outputPath}`);

  return processed;
}

export { importMovies };
