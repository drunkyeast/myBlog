const guard = (req, res, next) => {
    // 判断用户是否访问登录页面. 判断用户是不是登录状态, 如果不是则重定向到登录页面.
    if (req.url != '/login' && !req.session.username) {
        res.redirect('/admin/login');
    } else {
        // 用户是登录状态, 将请求放行
        next();
    }
}

module.exports = guard;