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
                    root: item.get("root"),
                    children: []
                })
                if(!child.hasOwnProperty(id)){
                    child[id] = []
                }
            } else {
                let parent = item.get("parent").id
                console.log(parent)
                console.log(child.hasOwnProperty(parent))
                if(child.hasOwnProperty(parent)){
                    child[parent].push(item)
                } else {
                    child[parent] = [];
                    child[parent].push(item)
                }
            }
        })
        console.log(child)
        result.forEach(item => {
            item.children = child[item.value]
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
