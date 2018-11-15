const check = {
    checkLogin(ctx, next) {
        console.log(ctx.request.currentUser)
        if (ctx.request.currentUser === undefined) {
            ctx.body = ctx.request
        } else {
            next()
        }
    },

    // 用于注册时
    checkNotLogin(ctx, next) {
        console.log(ctx.request.currentUser)
        if (ctx.request.currentUser === undefined) {
            next()
        } else {
            ctx.body = {
                result: false,
                msg: "已登录",
            }
        }
    },
    checkIfAdmin(req, res, next) {
        if ((req.currentUser.attributes.username !== "admin")) {
            res.status(200).send({
                result: false,
                msg: "您不是管理员，无权限操作！",
            })
            // return res.redirect('back')// 返回之前的页面
        } else {
            next()
        }
    },
}
module.exports = check
