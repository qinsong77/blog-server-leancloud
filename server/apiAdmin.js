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
const user = require("./modules/user")
const mes = require("./modules/leaveMess")
const check = require("./modules/checkLogin")
const file = require("./modules/file")
const directory = require("./modules/directory")
// 路由设置
router.get("/hello", check.checkLogin, article.hello)
// User
router.post("/login", user.login)
router.post("/logout", user.logout)
router.post("/register", check.checkNotLogin, user.register)

// Tag
router.get("/tag/all", tags.tags)
router.post("/tag/create", tags.newTag)
router.delete("/tag/delete", tags.deleteTag)
router.get("/tag/:tagId", tags.tagList)


// file
router.post("/file/upload", check.checkLogin, check.checkIfAdmin, file.upload)
router.get("/file/all", file.queryFiles)
router.delete("/file/delete", check.checkLogin, check.checkIfAdmin, file.deleteFiles)


// 目录
router.post("/dir/create", directory.newDir)
router.delete("/dir/delete", directory.deleteDir)
router.get("/dir/all", directory.queryDir)
// article
router.get("/artitle/query", article.articleQuery)
router.get("/article/:id", article.getArticleDetailByID)
router.get("/article/page/:page", article.getArticleListByPage)
router.delete("/article/delete", article.deleteArticle)
router.post("/article/create", check.checkLogin, check.checkIfAdmin, article.submitArticle)
router.patch("/article/edit", check.checkLogin, check.checkIfAdmin, article.editArticle)
// Comment
router.get("/comments", comments.commentsList)
router.post("/comments/submitComment", check.checkLogin, comments.submitComment)

// 留言
router.get("/mes/getAllMes", mes.messAll)
router.get("/mes/getUserMes", check.checkLogin, mes.getUserMess)
router.post("/mes/submitMes", check.checkLogin, mes.submitMess)


module.exports = router
