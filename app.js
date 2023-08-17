require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./routes/index");
const port = process.env.PORT;
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("tiny"));
app.use(router);

app.listen(port, () => {
  console.log("listening on port " + port);
});
