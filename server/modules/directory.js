const AV = require("leanengine")
const Directory = AV.Object.extend("directory")
const dir = {}

dir.newDir = async (ctx, next) => {
    const {
        label, parent, root, leaf
    } = ctx.request.body
    const saveDir = async ()=> {
        console.log(parent)
        const newDir = new Directory()
        newDir.set("label", label)
        newDir.set("parent", parent)
        newDir.set("root", root)
        newDir.set("leaf", leaf)
        return newDir.save()
    }

    try {
        const data = await saveDir()
        ctx.body = {
            result: true,
            msg: "保存成功",
            content: data
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
dir.deleteDir = async (ctx, next) => {
    const id = ctx.request.body.id
    console.log(id)
    let directory = AV.Object.createWithoutData("directory", id)
    const deleteDir = async ()=> directory.destroy()
    try {
        const data = await deleteDir()
        if (data) {
            ctx.body = {
                result: true,
                msg: "删除成功",
                content: data
            }
        }
    } catch (e) {
        ctx.body = {
            result: false,
            msg: "删除失败",
            content: e
        }
    }
}
dir.queryDir = async (ctx, next) => {
    const queryDirAll = async () => {
        const query = new AV.Query("directory") // 创建查询实例
        query.descending("createdAt")// 创建时间->降序查询
        return query.find()
    }
    try {
        const data = await queryDirAll()
        const result = []
        const child = {}
        data.forEach(item =>{
            let id = item.get("objectId")
            if (item.get("root")) {
                result.push({
                    value: id,
                    label: item.get("label"),
                    root: item.get("root")
                })
                if (!child.hasOwnProperty(id)) {
                    child[id] = []
                }
            } else {
                let parent = item.get("parent").id
                if (child.hasOwnProperty(parent)) {
                    child[parent].push({
                        value: id,
                        label: item.get("label"),
                        root: item.get("root")
                    })
                } else {
                    child[parent] = [];
                    child[parent].push({
                        value: id,
                        label: item.get("label"),
                        root: item.get("root")
                    })
                }
            }
        })
        result.forEach(item => {
            if (child.hasOwnProperty(item.value) && child[item.value].length > 0) item.children = child[item.value]
        })
        ctx.body = {
            result: true,
            msg: "查询成功",
            content: result
        }
    } catch (error) {
        console.log("查询失败:" + error)
        ctx.body = {
            result: false,
            msg: "查询失败",
        }
    }
}

module.exports = dir
