"use strict";

const path = require("path")
const AV = require("leanengine");
const Koa = require("koa");
const Router = require("koa-router");
const statics = require("koa-static");
const bodyParser = require("koa-bodyparser");
const config = require("../config")

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require("./cloud");

// 各个模块
const apiRouter = require("./api");

const app = new Koa();

// 设置静态资源目录
app.use(statics(path.join(__dirname, "../public")));

// 加载云引擎中间件
app.use(AV.koa());
app.use(AV.Cloud.CookieSession({
    framework: "koa", secret: config.secret, maxAge: 3600000, fetchUser: true
}));
app.use(bodyParser());
// api配置
let router = new Router();
router.use("/admin/api", apiRouter.routes(), apiRouter.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());
app.on("error", (err, ctx) => console.error("server error", err));
module.exports = app;
