const express = require("express");

const router = require("./router/client/index.route");

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

router(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});