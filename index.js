const express = require("express");
require("dotenv").config(); 

const router = require("./router/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

router(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});