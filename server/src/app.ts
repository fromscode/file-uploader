import express from "express";

import router from "./routes/index.js";

import session from "./config/session.js";

import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import passport from "passport";

import "./config/passport.js";

const app = express();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server up and runnning at port ${PORT}`);
});
