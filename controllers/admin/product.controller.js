const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/products

module.exports.index = async (req, res) => {

    const filterStatus= filterStatusHelper(req.query); // Bộ lọc trạng thái

    let find = {
        deleted: false
    };

    if(req.query.status){
        find.status= req.query.status;
    }

    const objectSearch= searchHelper(req.query); // tìm kiếm
    if(req.query.keyword){
        find.title= objectSearch.regex;
    }


    const products = await Product.find(find);
    // console.log(products);
    // console.log(filterStatus);
    
    res.render("admin/pages/products/index", {
        pageTitle : "Danh sách sản phẩm",
        products : products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}