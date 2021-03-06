/**
 * LeanCloud Class Content
 */

"use strict"

const AV = require("leanengine")
const Article = AV.Object.extend("article")
const tagObject = AV.Object.extend("tag")
const dirObject = AV.Object.extend("directory")
const FILE = AV.Object.extend("_File")


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

Content.queryTopHot = async (ctx,next) => {
    const query = new AV.Query("article") // 创建查询实例
    query.descending("viewCount") //
    query.limit(10) // 限制返回项数量
    try {
        const data = await query.find()

        if (data) {
            let arr = []
            for (let item of data) {
                let result = {}
                result.id = item.get("objectId")
                result.title = item.get("title")
                result.viewCount = item.get("viewCount")
                arr.push(result)
            }
            ctx.body = {
                result: true,
                msg: "查询成功",
                content: arr
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

Content.articleQuery = async (ctx, next) => {
    const tagId = ctx.query.tag
    const dirId = ctx.query.dir
    const queryArticleAll = async () => {
        if(tagId){
            const tag = AV.Object.createWithoutData('tagObject',tagId)
            const query = new AV.Query('ArticleTagMap');
            query.equalTo('tag', tag);
            query.include('article');
            query.descending("createdAt") // 创建时间->降序查询
            return await query.find()
        }else if(dirId){
            const dir = AV.Object.createWithoutData('dirObject',dirId)
            const query = new AV.Query('ArticleDirMap');
            query.equalTo('dir', dir);
            query.include('article');
            query.descending("createdAt") // 创建时间->降序查询
            return await  query.find()
        }
    }
    try {
        const data = await queryArticleAll()
        if (data) {
            let arr = []
            for (let it of data) {
                let item = it.get('article')
                let result = {}
                result.origin = item.get("origin")
                result.id = item.get("objectId")
                result.title = item.get("title")
                result.viewCount = item.get("viewCount")
                result.desc = item.get("desc")
                result.dirs = item.get("dirs")
                result.tags = item.get("tags")
                result.author = item.get("author")
                result.imgUrl = item.get("imgUrl")
                result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
                arr.push(result)
            }
            let final_result = {}
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
    const page = ctx.params.page || 1

    const queryTenArticle = (page) => {
        const query = new AV.Query("article") // 创建查询实例
        if(ctx.url.indexOf('blog') === 0){  //如果是前台的api,只查询发表状态的
            query.equalTo('status',1)
        }
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
                result.origin = item.get("origin")
                result.id = item.get("objectId")
                result.title = item.get("title")
                result.viewCount = item.get("viewCount")
                // result.content = item.get("content")
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

Content.getArticleDetailByID = async (ctx, next) => {
    const id = ctx.params.id
    console.log(id)
    const queryArticle = async () => {
        const query = new AV.Query("article") // 创建查询实例
        return query.get(id)
    }
    try {
        const item = await queryArticle()
        if (item) {
            const myPost = AV.Object.createWithoutData("article", id)
            await myPost.save().then(post=>{
                post.increment("viewCount", 1);
                // post.fetchWhenSave(true);
                return post.save();
            })
            let result = {}
            result.id = item.get("objectId")
            result.title = item.get("title")
            result.content = item.get("content")
            result.desc = item.get("desc")
            result.dirs = item.get("dirs")
            result.tags = item.get("tags")
            result.viewCount = item.get("viewCount")
            result.author = item.get("author")
            result.origin = item.get("origin")
            result.imgUrl = item.get("imgUrl")
            result.status = item.get("status")
            result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
            result.fileId = item.get("fileId")
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
        const query = new AV.Query("ArticleTagMap");
        query.equalTo("article", article);
        const data = await query.find()
        return AV.Object.destroyAll(data)
    }
    const deleteArticleDirMap = async () => {
        const query = new AV.Query("ArticleDirMap");
        query.equalTo("article", article);
        const data = await query.find()
        return AV.Object.destroyAll(data)
    }

    try {
        const data = await Promise.all([
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

Content.submitArticle = async (ctx, next) => {
    const {
        title,
        dirs,
        desc,
        tags,
        content,
        origin,
        imgUrl,
        status,
        fileId
    } = ctx.request.body
    const saveArticle = async () =>{
        const myPost = new Article()
        myPost.set("title", title)
        myPost.set("viewCount", 0) // 设置阅读人数
        myPost.set("content", content)
        myPost.set("desc", desc)
        myPost.set("origin", origin)
        myPost.set("dirs", dirs)
        myPost.set("tags", tags)
        myPost.set("status", status)
        myPost.set("imgUrl", imgUrl)
        myPost.set("fileId", fileId)
        myPost.set("owner", ctx.request.currentUser)
        myPost.set("author", ctx.request.currentUser.attributes.username)
        const File = AV.Object.createWithoutData("FILE", fileId)
        myPost.set("file", File)
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

Content.editArticle = async (ctx, next) => {
    const {
        id,
        title,
        desc,
        content,
        origin,
        imgUrl,
        status,
        fileId,
        dirs,
        tags,
        needDeleteTags,
        needSaveTags,
        needDeleteDirs,
        needSaveDirs
    } = ctx.request.body
    const saveArticle = async () =>{
        const myPost = AV.Object.createWithoutData("article", id)
        if (title) {
            myPost.set("title", title)
        }
        if (content) {
            myPost.set("content", content)
        }
        if (desc) {
            myPost.set("desc", desc)
        }
        if (origin) {
            myPost.set("origin", origin)
        }
        if (status) {
            myPost.set("status", status)
        }
        if (imgUrl) {
            myPost.set("imgUrl", imgUrl)
        }
        if (dirs) {
            myPost.set("dirs", dirs)
        }
        if (tags) {
            myPost.set("tags", tags)
        }
        if (fileId) {
            myPost.set("fileId", fileId)
            const File = AV.Object.createWithoutData("FILE", fileId)
            myPost.set("file", File)
        }
        // myPost.set("owner", ctx.request.currentUser)
        // myPost.set("author", ctx.request.currentUser.attributes.username)
        async function LinkTags(Tags) {
            for (let i = 0; i < Tags.length; i++) {
                let tag = AV.Object.createWithoutData("tagObject", Tags[i].id)
                const ArticleTagMap = new AV.Object("ArticleTagMap")
                ArticleTagMap.set("article", myPost)
                ArticleTagMap.set("tag", tag)
                await ArticleTagMap.save()
            }
        }
        async function LinkDirs(Dirs) {
            for (let i = 0; i < Dirs.length; i++) {
                let tag = AV.Object.createWithoutData("dirObject", Dirs[i].id)
                const ArticleDirMap = new AV.Object("ArticleDirMap")
                ArticleDirMap.set("article", myPost)
                ArticleDirMap.set("dir", tag)
                await ArticleDirMap.save()
            }
        }

        const deleteArticleTagMap = async (Tags) => {
            const query = new AV.Query("ArticleTagMap")
            query.equalTo("article", myPost)
            const Data = []
            for (let i = 0; i < Tags.length; i++) {
                let tag = AV.Object.createWithoutData("tagObject", Tags[i].id)
                query.equalTo("tag", tag)
                const data = await query.find()
                Data.push(data[0])
            }
            await AV.Object.destroyAll(Data)
        }
        const deleteArticleDirMap = async (Dirs) => {
            const query = new AV.Query("ArticleDirMap");
            query.equalTo("article", myPost)
            const Data = []
            for (let i = 0; i < Dirs.length; i++) {
                let dir = AV.Object.createWithoutData("tagObject", Dirs[i].id)
                query.equalTo("dir", dir)
                const data = await query.find()
                Data.push(data[0])
            }
            await AV.Object.destroyAll(Data)
        }

        await LinkTags(needSaveTags)
        await LinkDirs(needSaveDirs)
        await deleteArticleDirMap(needDeleteDirs)
        await deleteArticleTagMap(needDeleteTags)
        return myPost.save()
    }

    try {
        const data = await saveArticle()
        ctx.body = {
            result: true,
            msg: "修改成功",
            content: data
        }
    } catch (error) {
        console.log("修改失败:" + error)
        ctx.body = {
            result: false,
            msg: "修改失败",
            content: error
        }
    }
}
module.exports = Content
