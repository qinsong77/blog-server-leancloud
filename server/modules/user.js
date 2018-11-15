"use strict"

const AV = require("leanengine")
const jwt = require("jsonwebtoken")
const config = require("../../config")
// AV.Object.extend('className') 所需的参数 className 则表示对应的表名
// 声明一个类型
// const User = AV.Object.extend('User')

let UserModel = {}

UserModel.register = async (ctx, next) => {
    const registerUser = {
        username: ctx.request.body.username,
        password: ctx.request.body.password,
    }
    console.log(registerUser)
    const user = new AV.User()
    user.setUsername(registerUser.username)
    user.setPassword(registerUser.password)
    await user.signUp().then((userRegistered)=> {
        console.log(userRegistered)
        // ctx.response.saveCurrentUser(userRegistered)
        ctx.body = {
            result: true,
            msg: "注册成功！",
        }
    }).catch(error => {
        console.log(error)
        ctx.response.body = {
            result: false,
            msg: error,
        }
    })
    next()
}

UserModel.login = async (ctx, next) =>{
    const loginUser = {
        username: ctx.request.body.username,
        password: ctx.request.body.password,
    }
    await AV.User.logIn(loginUser.username, loginUser.password).then((user) =>{
        // ctx.response.saveCurrentUser(user)
        // console.log(ctx.request.currentUser.get("username"))
        const userToken = {
            name: user.username,
            id: user.objectId
        }
        console.log(userToken)
        console.log(config.secret)
        const token = jwt.sign(userToken, config.secret) // 签发token
        ctx.body = {
            result: true,
            content: {
                msg: "登陆成功",
                token: token
            }
        }
    }).catch((error)=> {
        console.log(error)
        ctx.body = {
            result: false,
            content: {
                msg: "登陆失败",
                info:error
            }
        }
    })
    next()
}

UserModel.logout = async (req, res) => {
    AV.User.logOut()
    const currentUser = AV.User.current()
    res.send(currentUser)
}

module.exports = UserModel
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
//         console.log(user)
//         res.send(loginedUser)
//     }, function (error) {
//         console.error(error)
//         res.status(500).send(error)
//     })
// }
