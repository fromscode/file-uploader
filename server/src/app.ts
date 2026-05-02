import express from "express";

import router from "./routes";

const app = express();

app.use(router);

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server up and runnning at port ${PORT}`);
});
