const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
require("dotenv").config(); 

const database = require("./config/database");

const systemConfig = require("./config/system");

const routerAdmin = require("./router/admin/index.route");
const router = require("./router/client/index.route");

database.connect();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.prefixAdmin= systemConfig.prefixAdmin;


app.use(express.static("public"));

routerAdmin(app);
router(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});