const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");



// [GET] /admin/products-category
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

    const records = await ProductCategory.find(find)

    const newRecord = createTreeHelper.Tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle : "Danh mục sản phẩm",
        filterStatus: filterStatus,
        records: newRecord
    });
}

// [PACTH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const status= req.params.status;
    const id= req.params.id;

    try {

        await ProductCategory.updateOne({ _id: id } , { status: status });
        req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');  

    } catch (error) {
        req.flash('error', 'Cập nhật trạng thái sản phẩm thất bại!');
    }
   
    const referer = req.get('Referer') || '/admin/products-category';
    
    res.redirect(referer);
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.Tree(records);


    res.render("admin/pages/products-category/create", {
        pageTitle : "Trang Thêm mới sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async(req, res) => {
    if(req.body.position == ""){
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    }else{
        req.body.position = parseInt( req.body.position);
    }
    
    try {
            const records = new ProductCategory(req.body);
            await records.save();
            req.flash('success', 'Thêm mới danh mục sản phẩm thành công!');
    
    } catch (error) {
        req.flash('success', 'Thêm mới danh mục sản phẩm thất bại!');
    }
    
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const records = await ProductCategory.findOne(find);

        let parentTitle = records;
        if(records.parent_id){
            parentTitle = await ProductCategory.findById(records.parent_id);
            console.log(parentTitle.title);
        }

        res.render("admin/pages/products-category/detail", {
            pageTitle : records.title,
            records: records,
            parentTitle: parentTitle.title
        });
    } catch (error) {
        req.flash('error', 'Không có sản phẩm này!');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => { 

    try {

        let find = {
            deleted: false,
            _id: req.params.id
        };

        records = await ProductCategory.findOne(find);
        
        const recordsParent = await ProductCategory.find({
            deleted: false
        });
        const newRecord = createTreeHelper.Tree(recordsParent);
      

        res.render("admin/pages/products-category/edit", {
            pageTitle : "Chỉnh sửa danh mục sản phẩm",
            records: records,
            newRecord: newRecord
        });
    } catch (error) {
        req.flash('error', 'Không có sản phẩm này!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.position = parseInt( req.body.position);
    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    
    try {
        req.flash('success', 'Cập nhật sản phẩm thành công!'); 
        await ProductCategory.updateOne({_id: req.params.id}, req.body);
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại!');
    }

    const referer = req.get('Referer') || '${prefixAdmin}/products/edit/${product.id}?';
    res.redirect(referer);
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async(req, res) => {
    const id= req.params.id;

    try {
        //await Product.deleteOne({ _id: id });
        await ProductCategory.updateOne({ _id: id } , { 
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