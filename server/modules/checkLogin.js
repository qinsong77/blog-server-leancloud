const AV = require('leanengine')
const check = {
    checkLogin(req, res, next) {
        if(req.currentUser === undefined){
            res.status(200).send({
                result:false,
                msg:'未登录'
            });
        }else{
            next();
        }
    },

    //用于注册时
    checkNotLogin(req, res, next) {
        if((req.currentUser !== undefined)){
            res.status(200).send({
                result:false,
                msg:'已登录'
            });
            //return res.redirect('back')// 返回之前的页面
        }else{
            next();
        }
    },
    checkIfAdmin(req, res, next) {
        if((req.currentUser.attributes.username !== 'admin')){
            res.status(200).send({
                result:false,
                msg:'您不是管理员，无权限操作！'
            });
            //return res.redirect('back')// 返回之前的页面
        }else{
            next();
        }
    },
}
module.exports = check;