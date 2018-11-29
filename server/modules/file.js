"use strict";

const AV = require("leanengine")
const FILES = AV.Object.extend("_File")
let fs = require("fs")
let fileModel = {}

fileModel.upload = async (ctx, next) =>{
    const file = ctx.request.files.file; // 获取上传文件
    const saveFile = async ()=> {
        const readFile = async (File)=> {
            return new Promise((resolve, reject) => {
                fs.readFile(File.path, (err, data) => {
                    if (err) {
                        reject(new Error("读取文件失败"))
                    }
                    resolve(data)
                })
            })
        }
        const data1 = await readFile(file).then(res=>{
            return res
        }).catch(error => {
            console.log("error:" + error)
            return error
        })

        const saveF = async (File, data)=> {
            if (Buffer.isBuffer(data)) {
                const theFile = new AV.File(File.name, data);
                return theFile.save()
            }
            throw new Error(data)
        }
        const data2 = await saveF(file, data1)
        return data2
    }
    try {
        const result = await saveFile()
        console.log(result)
        ctx.body = {
            result: true,
            msg: "上传成功！",
            content: result
        }
    } catch (e) {
        ctx.body = {
            result: false,
            msg: "上传失败！",
            content: e
        }
    }
}

fileModel.queryFiles = async (ctx, next) => {
    const queryAll = () => {
        const query = new AV.Query(FILES); // 创建查询实例
        query.descending("createdAt");// 创建时间->降序查询
        return query.find()
    };
    try {
        const data = await queryAll();

        if (data) {
            let final_result = {};
            final_result.result = true;
            final_result.listLength = data.length;
            final_result.data = data;
            ctx.body = {
                result: true,
                msg: "获取文件列表成功",
                content: final_result
            }
        } else {
            throw new Error("Can't find the data-Content")
        }
    } catch (error) {
        ctx.body = {
            result: false,
            msg: "获取文件列表失败",
            content: error
        }
    }
}
fileModel.deleteFiles = async (ctx, next) => {
    const fileId = ctx.query.fileId;
    console.log(fileId)
    if (fileId === "") {
        ctx.body = {
            result: false,
            msg: "ID为空",
            content: null
        }
    }
    let file = AV.File.createWithoutData(fileId)
    const deleteFile = async ()=> {
        return await file.destroy().then((success)=>{
            return Promise.resolve(success)
        }).catch(error=>{
            return Promise.reject(error)
        })
    }
    try {
        const data = await deleteFile();
        console.log("data:");
        console.log(data)
        if (data && JSON.stringify(data) !== "{}") {
            ctx.body = {
                result: true,
                msg: "删除成功",
                content: data
            }
        } else {
            throw new Error("Can not find.");
        }
    } catch (error) {
        console.log(error)
        ctx.body = {
            result: false,
            msg: "删除失败",
            content: error
        }
        next()
    }
}

module.exports = fileModel
