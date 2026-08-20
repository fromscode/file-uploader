import express from "express";
import cors from "cors";

import router from "./routes/index.js";

import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env["FRONTEND_URL"],
  }),
);
app.use(express.json());

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server up and runnning at port ${PORT}`);
});
