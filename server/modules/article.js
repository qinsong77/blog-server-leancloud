/**
 * LeanCloud Class Content
 */

"use strict"

const AV = require("leanengine")

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
Content.articleAll = async (req, res) => {
    const queryArticleAll = () => {
        const query = new AV.Query("ContentList") // 创建查询实例
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
            res.send(final_result)
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (error) {
        console.log(error)
    }
}

// 获取10篇文章
Content.getArticleListByPage = async (req, res) => {
    const page = req.params.page || 1

    const queryTenArticle = (page) => {
        const query = new AV.Query("ContentList") // 创建查询实例
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
                result.objectId = item.get("objectId")
                result.title = item.get("title")
                result.abstract = item.get("abstract")
                result.author = item.get("author")
                result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
                arr.push(result)
            }
            let final_result = {}
            final_result.page = page
            final_result.data = arr
            res.send(final_result)
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (err) {
        console.error(err)
    }
}

// 获取首页头图 url
Content.getImgUrl = async (req, res) => {
    const queryImgUrl = () => {
        const query = new AV.Query("index_background")
        query.descending("createdAt")
        return query.find()
    }
    try {
        const data = await queryImgUrl()
        if (data) {
            let arr = []
            for (let item of data) {
                arr.push(item.get("img_background").attributes.url)
            }
            res.send(arr)
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (error) {
        console.log(error)
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

var postContentList = AV.Object.extend("ContentList")

Content.submitArticle = async (req, res) => {
    let _post = {
        title: req.body.title,
        content: req.body.content,
        abstract: req.body.abstract,
    }
    // console.log(_post)
    // if (!_post.title.trim() || !_post.content.trim()) {
    //     res.status(500).send('昵称和内容不可为空')
    // }

    let myPost = new postContentList()
    myPost.set("title", _post.title)
    myPost.set("content", _post.content)
    myPost.set("abstract", _post.abstract)
    myPost.set("author", req.currentUser.get("username"))

    myPost.save().then(function (p) {
        console.log("objectId is " + p.id)
        res.send({
            result: true,
            msg: "post successfully,this article id :" + p.id,
        })
    }, function (error) {
        console.error(error)
        res.status(200).send(error)
    })
}

module.exports = Content
