"use strict";

const AV = require("leanengine");
const tagObject = AV.Object.extend("tag")
let Tag = {}

// 获取所有 tags
Tag.tags = async (ctx, next) => {
    const queryTags = () => {
        const query = new AV.Query("Tags")
        return query.find()
    }
    try {
        const data = await queryTags()

        if (data) {
            let arr = []
            for (let item of data) {
                let result = {}
                result.objectId = item.get("objectId")
                result.tagName = item.get("tagName")
                arr.push(result)
            }
            ctx.body = {
                result: true,
                msg: "保存成功",
                content: arr
            }
        } else {
            throw new Error("can not find tags")
        }
    } catch (error) {
        console.log("提交失败:" + error)
        ctx.body = {
            result: false,
            msg: "提交失败",
            content: error
        }
    }
}

Tag.newTag = async (ctx, next) => {
    const {
        name
    } = ctx.request.body
    const saveTag = async ()=> {
        const newTag = new tagObject()
        newTag.set("name", name)
        return newTag.save()
    }

    try {
        const data = await saveTag()
        ctx.body = {
            result: true,
            msg: "保存成功",
            content: data
        }
    } catch (error) {
        ctx.body = {
            result: false,
            msg: "提交失败",
            content:error
        }
    }
}

Tag.tagList = async (ctx, res) => {
    const tagId = ctx.params.tagId

    const queryTagList = (tagId) => {
        const targetTag = AV.Object.createWithoutData("Tags", tagId) // 更新对象 第一个参数是 className，第二个参数是 objectId
        const query = new AV.Query("ContentList")
        query.equalTo("relationTags", targetTag)
        query.descending("createdAt")
        return query.find()
    }
    try {
        const data = await queryTagList(tagId)

        if (data) {
            let arr = []
            console.log(data)
            for (let item of data) {
                let result = {}
                result.objectId = item.get("objectId")
                result.title = item.get("title")
                result.abstract = item.get("abstract")
                result.createdAt = item.get("createdAt").Format("yyyy-MM-dd hh:mm:ss")
                arr.push(result)
            }

            res.send(arr)
        } else {
            throw new Error("Can not find tagList.");
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = Tag
