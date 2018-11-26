const check = {
    checkLogin(ctx, next) {
        if (ctx.request.currentUser === undefined) {
            ctx.body = {
                result: false,
                msg: "未登陆",
            }
        } else {
            next()
        }
    },

    // 用于注册时
    checkNotLogin(ctx, next) {
        if (ctx.request.currentUser === undefined) {
            next()
        } else {
            ctx.body = {
                result: false,
                msg: "已登陆",
            }
        }
    },
    checkIfAdmin(ctx, next) {
        if ((ctx.request.currentUser.attributes.username === "admin") || ctx.request.currentUser.attributes.username === "sysuke") {
            next()
        } else {
            ctx.body = {
                result: false,
                msg: "您不是管理员，无权限操作！",
                content: null
            }
        }
    },
}
module.exports = check
