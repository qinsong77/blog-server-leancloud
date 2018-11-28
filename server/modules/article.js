/**
 * LeanCloud Class Content
 */

"use strict"

const AV = require("leanengine")
const Article = AV.Object.extend("article")
const tagObject = AV.Object.extend("tag")
const dirObject = AV.Object.extend("directory")
// 对Date的拓展，将Date转化为制定个事的String
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d:m:s.S") ==> 2006-7-2 8:9:4.18

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)) }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[k])
                : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}

let Content = {}

Content.hello = (ctx, next) => {
    console.log(ctx.request.currentUser)
    console.log(ctx.request.currentUser.get("username"))
    if (ctx.request.currentUser) {
        // 如果已经登录，发送当前登录用户信息。
        ctx.body = ctx.request.currentUser
    } else {
        // 没有登录，跳转到登录页面。
        ctx.body = "not login!"
    }
}

// 获取文章列表
Content.articleAll = async (ctx, next) => {
    const queryArticleAll = () => {
        const query = new AV.Query("article") // 创建查询实例
        query.descending("createdAt") // 创建时间->降序查询
        return query.find()
    }
    try {
        const data = await queryArticleAll()

        if (data) {
            let arr = []
            for (let item of data) {
                let result = {}
                result.objectId = item.get("objectId")
                result.title = item.get("title")
                result.abstract = item.get("abstract")
                result.author = item.get("author")
                result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
                arr.push(result)
            }
            let final_result = {}
            final_result.result = true
            final_result.listLength = arr.length
            final_result.data = arr
            ctx.body = {
                result: true,
                msg: "查询成功",
                content: final_result
            }
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (error) {
        ctx.body = {
            result: false,
            msg: "查询失败",
            content: error
        }
    }
}

// 获取10篇文章
Content.getArticleListByPage = async (ctx, next) => {
    const page = ctx.query.page || 1

    const queryTenArticle = (page) => {
        const query = new AV.Query("article") // 创建查询实例
        query.descending("createdAt") // 创建时间->降序查询
        query.skip((page - 1) * 10) // 跳过指定项
        query.limit(10) // 限制返回项数量
        return query.find()
    }

    try {
        const data = await queryTenArticle(page)

        if (data) {
            let arr = []
            for (let item of data) {
                let result = {}
                result.id = item.get("objectId")
                result.title = item.get("title")
                result.content = item.get("content")
                result.desc = item.get("desc")
                result.dirs = item.get("dirs")
                result.tags = item.get("tags")
                result.author = item.get("author")
                result.imgUrl = item.get("imgUrl")
                result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
                arr.push(result)
            }
            let final_result = {}
            final_result.page = page
            final_result.data = arr
            ctx.body = {
                result: true,
                msg: "查询成功",
                content: final_result
            }
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (err) {
        ctx.body = {
            result: false,
            msg: "查询失败",
            content: err
        }
    }
}

Content.getArticleListByID= async (ctx, next) => {
    const id = ctx.query.id

    const queryArticle = async () => {
        const query = new AV.Query("article") // 创建查询实例
        return query.get(id)
    }

    try {
        const item = await queryArticle()

        if (item) {
            let result = {}
            result.id = item.get("objectId")
            result.title = item.get("title")
            result.content = item.get("content")
            result.desc = item.get("desc")
            result.dirs = item.get("dirs")
            result.tags = item.get("tags")
            result.author = item.get("author")
            result.imgUrl = item.get("imgUrl")
            result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
            ctx.body = {
                result: true,
                msg: "查询成功",
                content: result
            }
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (err) {
        ctx.body = {
            result: false,
            msg: "查询失败",
            content: err
        }
    }
}
Content.deleteArticle = async (ctx, next) => {
    const id = ctx.query.id
    let article = AV.Object.createWithoutData("article", id)


    const deleteArticle = async ()=> article.destroy()
    const deleteArticleTagMap = async () => {
        const query = new AV.Query('ArticleTagMap');
        query.equalTo('article', article);
        const data = await query.find()
        return AV.Object.destroyAll(data)

    }
    const deleteArticleDirMap = async () => {
        const query = new AV.Query('ArticleDirMap');
        query.equalTo('article', article);
        const data = await query.find()
        return AV.Object.destroyAll(data)

    }

    try {
        const data =  await Promise.all([
            deleteArticle(),
            deleteArticleTagMap(),
            deleteArticleDirMap(),
        ]);
        if (data && JSON.stringify(data) !== "{}") {
            ctx.body = {
                result: true,
                msg: "删除成功",
                content: data
            }
        } else {
            throw new Error("delete tag error")
        }
    } catch (e) {
        ctx.body = {
            result: false,
            msg: "删除失败",
            content: e
        }
    }
}

// 获取指定 id 的文章信息
Content.getArticleDetailByID = async (req, res) => {
    const articleId = req.query.articleId
    console.log(articleId)
    const queryArticle = (id) => {
        const query = new AV.Query("ContentList")
        return query.get(articleId)
    }
    try {
        const data = await queryArticle(articleId)

        let result = {}
        if (data) {
            result.title = data.get("title")
            // result.cover = data.get('cover').get('url')
            result.content = data.get("content")
            result.createdAt = data.get("createdAt")
            // .Format("yyyy-MM-dd")
            res.send(result)
        } else {
            throw new Error("article can not found")
        }
    } catch (error) {
        console.log(error)
    }
}


Content.submitArticle = async (ctx, next) => {
    const {
        title,
        dirs,
        desc,
        tags,
        content,
        origin,
        imgUrl,
    } = ctx.request.body
    const saveArticle = async () =>{
        const myPost = new Article()
        myPost.set("title", title)
        myPost.set("content", content)
        myPost.set("desc", desc)
        myPost.set("origin", origin)
        myPost.set("dirs", dirs)
        myPost.set("tags", tags)
        myPost.set("imgUrl", imgUrl)
        myPost.set("owner", ctx.request.currentUser)
        myPost.set("author", ctx.request.currentUser.attributes.username)

        async function LinkTags() {
            for (let i = 0; i < tags.length; i++) {
                let tag = AV.Object.createWithoutData("tagObject", tags[i].id)
                const ArticleTagMap = new AV.Object("ArticleTagMap")
                ArticleTagMap.set("article", myPost)
                ArticleTagMap.set("tag", tag)
                await ArticleTagMap.save()
            }
        }
        async function LinkDirs() {
            for (let i = 0; i < dirs.length; i++) {
                let tag = AV.Object.createWithoutData("dirObject", dirs[i].id)
                const ArticleDirMap = new AV.Object("ArticleDirMap")
                ArticleDirMap.set("article", myPost)
                ArticleDirMap.set("dir", tag)
                await ArticleDirMap.save()
            }
        }
        await LinkTags()
        await LinkDirs()

        return myPost.save()
    }

    try {
        const data = await saveArticle()
        ctx.body = {
            result: true,
            msg: "保存成功",
            content: data
        }
    } catch (error) {
        console.log("保存失败:" + error)
        ctx.body = {
            result: false,
            msg: "保存失败",
            content: error
        }
    }
}

module.exports = Content
