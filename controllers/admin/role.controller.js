const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");

// [GET] /admin/roles
module.exports.index = async(req, res) => {

    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle : "Nhóm quyền",
        records: records
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle : "Thêm nhóm quyền"
    });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    try {
        const records = new Role(req.body);
        await records.save();
        req.flash('success', 'Thêm mới sản phẩm thành công!');
    } catch (error) {
        req.flash('error', 'Thêm mới sản phẩm thất bại!');
    }
    
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}