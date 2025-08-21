const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/recyclebin.controller");

router.get("/", controller.index);

router.patch("/redelete/:id", controller.reDeleteItem);

module.exports = router;