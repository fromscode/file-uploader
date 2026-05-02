import express from "express";

import router from "./routes";

import errorHandler from "../middlewares/errorHandler";
import notFoundHandler from "../middlewares/notFoundHandler";

const app = express();

app.use(express.json());

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server up and runnning at port ${PORT}`);
});
