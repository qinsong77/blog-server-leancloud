/**
 * 前后端路由接口配置中心
 * 所有 API 的路由
 */

"use strict"

const Router = require("koa-router")
const router = new Router()

// 添加路由模块
const article = require("./modules/article")
const comments = require("./modules/comment")
const tags = require("./modules/tags")
const mes = require("./modules/leaveMess")
const check = require("./modules/checkLogin")
const directory = require("./modules/directory")
// 路由设置


// Tag
router.get("/tag/all", tags.tags)
router.get("/tag/:tagId", tags.tagList)


// 目录
router.get("/dir/all", directory.queryDir)

// article
router.get("/artitle/all", article.articleAll)
router.get("/article/:id", article.getArticleDetailByID)
router.get("/article/page/:page", article.getArticleListByPage)

// Comment
router.get("/comments", comments.commentsList)
router.post("/comments/submitComment", check.checkLogin, comments.submitComment)

// 留言
router.get("/mes/getAllMes", mes.messAll)
router.get("/mes/getUserMes", check.checkLogin, mes.getUserMess)
router.post("/mes/submitMes", check.checkLogin, mes.submitMess)


module.exports = router
