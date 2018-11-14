'use strict';

const AV = require('leanengine');
const FILES = AV.Object.extend('_File');
let multiparty = require('multiparty');
let fs = require('fs');
let fileModel = {};

fileModel.upload = function (req, res) {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        let iconFile = files.file[0];
        if(iconFile.size !== 0){
            fs.readFile(iconFile.path, function(err, data){
                if(err) {
                    return res.send('读取文件失败');
                }
                let theFile = new AV.File(iconFile.originalFilename, data);

                theFile.save().then(function(theFile){
                    // let url = theFile.thumbnailURL(100, 200);
                    res.send({
                        data:theFile,
                        msg:'上传成功！',
                        result:true
                    });
                }).catch(console.error);
            });
        } else {
            res.send('请选择一个文件。');
        }
    });
}

fileModel.queryFiles = async(req, res) => {
    const queryAll = () => {
        const query = new AV.Query(FILES); // 创建查询实例
        query.descending('createdAt');// 创建时间->降序查询
        return query.find()
    };
    try {
        const data = await queryAll();

        if (data) {
            let arr = [];
            // for (let item of data) {
            //     let result = {};
            //     result.objectId = item.get('objectId');
            //     result.username = item.get('username');
            //     result.content = item.get('content');
            //     result.createdAt = item.get('createdAt').Format("yyyy-MM-dd hh:mm:ss");
            //     arr.push(result);
            // }
            let final_result = {};
            final_result.result = true;
            final_result.listLength = data.length;
            final_result.data = data;
            res.send(final_result)
        } else {
            throw new Error('Can\'t find the data-Content')
        }
    } catch (error) {
        console.log(error)
    }
}
fileModel.deleteFiles = async(req, res) => {
    const fileId = req.query.fileId;
    if (fileId === '') {
        res.status(200).send({
            result:false,
            msg:'ID为空'
        })
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
            res.send(data)
        } else {
            throw new Error('Can not find.');
        }
    } catch (error) {
        res.status(500).send({
            result:false,
            msg:error
        })
    }
}

module.exports = fileModel;