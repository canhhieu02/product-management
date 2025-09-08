const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product-category.controller");

const multer  = require('multer');
const upload = multer();

const validate = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/create", controller.create);

router.delete("/delete/:id", controller.deleteItem);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.uploadSingle,
    validate.createPost , 
    controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"),
    uploadCloud.uploadSingle,
    validate.createPost, 
    controller.editPatch);

router.get("/detail/:id", controller.detail);

module.exports = router;