const express = require("express");
require("dotenv").config(); 

const database = require("./config/database");

const router = require("./router/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

router(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});