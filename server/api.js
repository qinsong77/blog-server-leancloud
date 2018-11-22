/**
 * 前后端路由接口配置中心
 * 所有 API 的路由
 */

"use strict";

const Router = require("koa-router");
const router = new Router()

// 添加路由模块
const article = require("./modules/article");
const comments = require("./modules/comment");
const tags = require("./modules/tags");
const user = require("./modules/user");
const mes = require("./modules/leaveMess");
const check = require("./modules/checkLogin");
const file = require("./modules/file");
const directory = require("./modules/directory")
// 路由设置
router.get("/hello", check.checkLogin, article.hello);
// User
router.post("/login", user.login);
router.post("/logout", user.logout);
router.post("/register", check.checkNotLogin, user.register);

// 目录
router.post("/newDir", directory.newDir);
router.post("/deleteDir", directory.deleteDir);
router.get("/queryDir", directory.queryDir);
// article
router.get("/articleAll", article.articleAll);
router.get("/getArticleListByPage/:page", article.getArticleListByPage);
router.get("/article/backgroundImg", article.getImgUrl);
// Article
router.get("/getArticleDetailByID", article.getArticleDetailByID);
router.post("/article/submitArticle", check.checkLogin, check.checkIfAdmin, article.submitArticle);
// Comment
router.get("/comments", comments.commentsList);
router.post("/comments/submitComment", check.checkLogin, comments.submitComment);

// 留言
router.get("/mes/getAllMes", mes.messAll);
router.get("/mes/getUserMes", check.checkLogin, mes.getUserMess);
router.post("/mes/submitMes", check.checkLogin, mes.submitMess);

// Tag
router.get("/tags", tags.tags);
router.post("/tags", tags.newTag);
router.get("/tags/:tagId", tags.tagList);


// file
router.post("/fileUpload", check.checkLogin, check.checkIfAdmin, file.upload);
router.get("/queryFiles", file.queryFiles);
router.get("/deleteFiles", check.checkLogin, check.checkIfAdmin, file.deleteFiles);

module.exports = router;
