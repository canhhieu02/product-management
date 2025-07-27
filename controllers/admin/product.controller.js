const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
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

    // pagination

    const countProduct = await Product.countDocuments(find);
    
    const objectPagination= paginationHelper(
        {
            currentPage: 1,
            limitItem: 5
        },
        req.query,
        countProduct
    )
    // end pagination

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);
    // console.log(products);
    // console.log(filterStatus);

    
    res.render("admin/pages/products/index", {
        pageTitle : "Danh sách sản phẩm",
        products : products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}