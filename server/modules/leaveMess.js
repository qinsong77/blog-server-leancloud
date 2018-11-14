'use strict';

const AV = require('leanengine')

// AV.Object.extend('className') 所需的参数 className 则表示对应的表名
// 声明一个类型
const Mes = AV.Object.extend('leaveMess');

let Content = {};
// 获取某用户的留言列表
Content.getUserMess = async(req, res) => {
    const queryUserMes = () => {
        const targetUser = req.currentUser;
        console.log(targetUser);
        const query = new AV.Query('leaveMess');
        query.ascending('createdAt');
        query.equalTo('pointOwner', targetUser);
        return query.find();
    };
    try {
        const data = await queryUserMes();

        if (data) {
            let arr = [];
            for (let item of data) {
                let result = {};
                result.objectId = item.get('objectId');
                result.username = item.get('username');
                result.content = item.get('content');
                result.createdAt = item.get('createdAt').Format("yyyy-MM-dd hh:mm:ss");
                arr.push(result);
            }
            let final_result = {};
            final_result.result = true;
            final_result.listLength = arr.length;
            final_result.data = arr;
            res.send(final_result)
        } else {
            throw new Error('Can\'t find the data-Content')
        }
    } catch (error) {
        console.log(error)
    }
}
// 获取留言列表
Content.messAll = async(req, res) => {
    const queryArticleAll = () => {
        const query = new AV.Query('leaveMess'); // 创建查询实例
        query.descending('createdAt');// 创建时间->降序查询
        return query.find()
    }
    try {
        const data = await queryArticleAll();

        if (data) {
            let arr = [];
            for (let item of data) {
                let result = {};
                result.objectId = item.get('objectId');
                result.username = item.get('username');
                result.content = item.get('content');
                result.createdAt = item.get('createdAt').Format("yyyy-MM-dd hh:mm:ss");
                arr.push(result);
            }
            let final_result = {};
            final_result.result = true;
            final_result.listLength = arr.length;
            final_result.data = arr;
            res.send(final_result)
        } else {
            throw new Error('Can\'t find the data-Content')
        }
    } catch (error) {
        console.log(error)
    }
}

Content.submitMess = async(req, res) => {
    const currentUser = req.currentUser;
    const name = currentUser.get('username');
    const content = req.body.content;



    const saveMes = async() => {
        let mes = new Mes();
        mes.set('username', name);
        mes.set('content', content);
        mes.set('pointOwner', currentUser);

        return mes.save();

    };

    try {
        const data = await saveMes();

        let result = {};
        result.objectId = data.get('objectId');
        result.username = data.get('username');
        result.content = data.get('content');
        result.pointOwner = data.get('pointOwner');
        result.createdAt = data.get('createdAt').Format("yyyy-MM-dd hh:mm:ss");
        res.send({
            result:true,
            msg:result
        })
    } catch (error) {
        console.log("提交失败:"+error);
        res.status(500).send(error)
    }
}

module.exports = Content


Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                (o[k]) :
                (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

}