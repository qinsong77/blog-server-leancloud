'use strict';

const AV = require('leanengine')

// AV.Object.extend('className') 所需的参数 className 则表示对应的表名
// 声明一个类型
// const User = AV.Object.extend('User')

let UserModel = {};

UserModel.register = function (req, res, next) {
    const _user = {
        username: req.body.username,
        password: req.body.password
    }
    console.log(_user);
    // if (!_user.username.trim() && !_user.password.trim()) {
    //     console.log('注册账号时，用户名和密码为空了');
    //     res.status(200).send({
    //         result: false,
    //         msg: '用户名和密码不可为空!'
    //     })
    // };
    let user = new AV.User();
    user.setUsername(_user.username);
    user.setPassword(_user.password);
    // user.set('username', _user.username);
    // user.set('password', _user.password);
    user.signUp().then(function (user) {
        res.saveCurrentUser(user);
        res.send({
            result: true,
            msg: '注册成功！'
        });
        // res.redirect('/todos');
    }, function (err) {
        res.send({
            result: false,
            msg: 'Username has already been taken!'
        })
    });
};

UserModel.login = async (ctx,next) =>{
    const _user = {
        username: ctx.request.body.username,
        password: ctx.request.body.password
    }
    await AV.User.logIn(_user.username, _user.password).then(function (user) {
         ctx.response.saveCurrentUser(user);
        // console.log(req.currentUser.get('username'));
        ctx.body = {
            result: true,
            msg: user
        };
    }, function (error) {
        ctx.body = {
            result: false,
            msg: error
        }
    })
    next()
};

UserModel.logout = async (req, res) => {
    AV.User.logOut();
    var currentUser = AV.User.current();
    res.send(currentUser)
};

module.exports = UserModel;
//     async(req, res) => {
//     const _user = {
//         username: req.body.username,
//         password: req.body.password
//     }
//
//     if (!_user.username.trim() && !_user.password.trim()) {
//         res.status(500).send('用户名和密码不可为空')
//     }
//
//     AV.User.logIn(_user.username, _user.password).then(function(user) {
//         console.log(user);
//         res.send(loginedUser);
//     }, function (error) {
//         console.error(error);
//         res.status(500).send(error)
//     });
// }

