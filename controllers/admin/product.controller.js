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

// [PACTH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const status= req.params.status;
    const id= req.params.id;

    await Product.updateOne({ _id: id } , { status: status });
   
    const referer = req.get('Referer') || '/admin/products';
    
    res.redirect(referer);
}

// [PACTH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: {$in: ids} } , { status: "active" });
            break;
        case "inactive":
            await Product.updateMany({ _id: {$in: ids} } , { status: "inactive" });
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: {$in: ids} } , 
                {
                    deleted: true,
                    deletedAt: new Date()
                }
            );
            break;
        default:
            break;
    }

    const referer = req.get('Referer') || '/admin/products';
    
    res.redirect(referer);
}

// [PACTH] /admin/products/delete/:id
module.exports.deleteItem = async(req, res) => {
    const id= req.params.id;

    //await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id } , { 
        deleted: true,
        deletedAt: new Date()
    });
  
    const referer = req.get('Referer') || '/admin/products';
    
    res.redirect(referer);
}