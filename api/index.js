import "dotenv/config";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import healthCheck from "./middleware/healthCheck.js";

import accountRouter from "./routes/accountRouter.js";
import movieRouter from "./routes/movieRouter.js";
import searchRouter from "./routes/searchRouter.js";
import favoriteRouter from "./routes/favoriteRouter.js";
import registerRouter from "./routes/registerRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import groupRouter from "./routes/groupRouter.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Check health before routes
app.get("/api/health", healthCheck);

// Routes
app.use("/", movieRouter);
app.use("/", registerRouter);
app.use("/tmdb", searchRouter);
app.use("/", reviewRouter);

app.use("/", accountRouter);
app.use("/", favoriteRouter);
app.use("/", groupRouter);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Backend hot reload is working!");
});
