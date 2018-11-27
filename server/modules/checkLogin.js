const check = {
    async checkLogin(ctx, next) {
        if (ctx.request.currentUser === undefined) {
            ctx.body = {
                result: false,
                msg: "未登陆",
            }
        } else {
            await next()
        }
    },

    // 用于注册时
    async checkNotLogin(ctx, next) {
        if (ctx.request.currentUser === undefined) {
            await next()
        } else {
            ctx.body = {
                result: false,
                msg: "已登陆",
            }
        }
    },
    async checkIfAdmin(ctx, next) {
        if ((ctx.request.currentUser.attributes.username === "admin") || ctx.request.currentUser.attributes.username === "sysuke") {
            await next()
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
