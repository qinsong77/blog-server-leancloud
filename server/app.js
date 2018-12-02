"use strict"

const path = require("path")
const AV = require("leanengine")
const Koa = require("koa")
const Router = require("koa-router")
const statics = require("koa-static")
const koaBody = require("koa-body")
const config = require("../config")

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require("./cloud")

// 各个模块
const apiAdmin = require("./apiAdmin")
const apiBlog = require("./apiBlog")

const app = new Koa()
let router = new Router()
// 设置静态资源目录
app.use(statics(path.join(__dirname, "../public")))
// 加载云引擎中间件
app.use(AV.koa())
app.use(AV.Cloud.CookieSession({
    framework: "koa", secret: config.secret, maxAge: 36000000, fetchUser: true
}))
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 300 * 1024 * 1024 // 设置上传文件大小最大限制，默认3M
    }
}));
app.proxy = true;
app.use(AV.Cloud.HttpsRedirect({framework: 'koa'}));
app.use(async (ctx, next) => {
    let start = new Date()
    let ms = new Date() - start
    console.log("%s %s - %s", ctx.method, ctx.url, ms + "ms")
    await next()
})

// api配置
app.use(async (ctx, next) => {
    console.log(ctx.request.header.referer)
    if(ctx.request.header.referer.indexOf('https://sysuke.com')!== -1){
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    await next();
});
router.use("/admin/api", apiAdmin.routes(), apiAdmin.allowedMethods())
router.use("/blog/api", apiBlog.routes(), apiBlog.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

module.exports = app
