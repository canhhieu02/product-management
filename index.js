const express = require("express");
require("dotenv").config(); 

const database = require("./config/database");

const systemConfig = require("./config/system");

const routerAdmin = require("./router/admin/index.route");
const router = require("./router/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.prefixAdmin= systemConfig.prefixAdmin;
console.log("prefixAdmin:", app.locals.prefixAdmin); 


app.use(express.static("public"));

routerAdmin(app);
router(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});