const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

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

    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.limitItem).skip(objectPagination.skip);
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

    try {

        await Product.updateOne({ _id: id } , { status: status });
        req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');  

    } catch (error) {
        req.flash('error', 'Cập nhật trạng thái sản phẩm thất bại!');
    }
   
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
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({ _id: {$in: ids} } , { status: "inactive" });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: {$in: ids} } , 
                {
                    deleted: true,
                    deletedAt: new Date()
                }
            );
            req.flash('success', `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")

                position = parseInt(position)

                await Product.updateOne({_id: id },{
                    position: position
                });
            }
            req.flash('success', `Thay đổi vị trí thành công ${ids.length} sản phẩm`);
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

    try {
        //await Product.deleteOne({ _id: id });
        await Product.updateOne({ _id: id } , { 
            deleted: true,
            deletedAt: new Date()
        });
        req.flash('success', 'Xóa sản phẩm thành công!');
    } catch (error) {
        req.flash('error', 'Xóa sản phẩm thất bại!');
    }

    const referer = req.get('Referer') || '/admin/products';
    
    res.redirect(referer);
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle : "Trang Thêm mới sản phẩm"
    });
}

// [POST] /admin/products/create
module.exports.createPost = async(req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts +1;
    }else{
        req.body.position = parseInt( req.body.position);
    }

    try {
        const product = new Product(req.body);
        await product.save();
        req.flash('success', 'Thêm mới sản phẩm thành công!');

    } catch (error) {
        req.flash('success', 'Thêm mới sản phẩm thất bại!');
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle : "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        req.flash('error', 'Không có sản phẩm này!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt( req.body.position);
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    
    try {
        req.flash('success', 'Cập nhật sản phẩm thành công!'); 
        await Product.updateOne({_id: req.params.id}, req.body);
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại!');
    }

    const referer = req.get('Referer') || '${prefixAdmin}/products/edit/${product.id}?';
    res.redirect(referer);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle : product.title,
            product: product
        });
    } catch (error) {
        req.flash('error', 'Không có sản phẩm này!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    
}