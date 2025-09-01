const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const path = require('path');
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

app.set('views', `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser('HGAFGHJFVH'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

// TinyMCE
//app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin= systemConfig.prefixAdmin;


app.use(express.static(`${__dirname}/public`));

routerAdmin(app);
router(app);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});