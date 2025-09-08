module.exports.createPost = (req, res, next) =>{
    if(!req.body.title){
        req.flash('error', 'Vui lòng nhập tiêu đề!');
        const referer = req.get('Referer') || '/admin/products/create';
        res.redirect(referer);
        return
    }

    next();
}