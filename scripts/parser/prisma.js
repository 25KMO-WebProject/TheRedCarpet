require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const user = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const database = encodeURIComponent(process.env.DB_NAME);

const databaseUrl =
  `postgresql://${user}:${password}` +
  `@localhost:${process.env.DB_EXPOSED_PORT}/${database}?schema=public`;

const prisma = new PrismaClient({
  datasourceUrl: databaseUrl,
});

async function testConnection() {
  try {
    await prisma.$connect();

    const result =
      await prisma.$queryRaw`SELECT current_user, current_database()`;

    console.log("Database connection successful:");
    console.log(result);
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
