'use strict';

const AV = require('leanengine');
const FILES = AV.Object.extend('_File');
let multiparty = require('multiparty');
let fs = require('fs');
let fileModel = {};

fileModel.upload = async (ctx, next) =>{
    const saveFile = async () => {
        let form = new multiparty.Form();
        form.parse(ctx.req, function(err, fields, files) {
            console.log(files)
            let iconFile = files.iconImage[0];
            if(iconFile.size !== 0){
                fs.readFile(iconFile.path, function(err, data){
                    if(err) {
                        console.log(err)
                        return Promise.reject({
                            meg: '读取文件失败',
                            content: err
                        })
                    }
                    var theFile = new AV.File(iconFile.originalFilename, data);
                    theFile.save().then(function(theFile){
                        return Promise.reject({
                            meg: '读取文件失败',
                            content: theFile
                        })
                    }).catch(error=>{
                        return Promise.reject({
                            meg: '读取文件失败',
                            content: error
                        })
                    });
                });
            } else {
                return '请选择一个文件。'
            }
        });
    }
    const data = await saveFile()
    console.log(data)
}

fileModel.queryFiles = async(ctx, next) => {
    const queryAll = () => {
        const query = new AV.Query(FILES); // 创建查询实例
        query.descending('createdAt');// 创建时间->降序查询
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
            throw new Error('Can\'t find the data-Content')
        }
    } catch (error) {
        ctx.body = {
            result: false,
            msg: "获取文件列表失败",
            content: error
        }
    }
}
fileModel.deleteFiles = async(ctx, next) => {
    const fileId = ctx.query.fileId;
    if (fileId === '') {
        ctx.body = {
            result: false,
            msg:'ID为空',
            content: null
        }
    }
    const deleteFile = () => {
        let file = AV.File.createWithoutData(fileId);
        return new Promise((resolve, reject) => {
            file.destroy().then(function (success) {
                console.log(success);
                console.log('ss:'+success);
               resolve(success);
            }, function (error) {
                console.log('err:'+error);
               reject(error)
            });
        })

    }
    try {
        const data = await deleteFile();
        console.log('data:'+data);
        if (data) {
            ctx.body = {
                result: true,
                msg: "删除成功",
                content: data
            }
        } else {
            throw new Error('Can not find.');
        }
    } catch (error) {
        ctx.body = {
            result: false,
            msg: "删除失败",
            content: error
        }
    }
}

module.exports = fileModel;
