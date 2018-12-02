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
    const user = new AV.User()
    user.setUsername(registerUser.username)
    user.setPassword(registerUser.password)
    try {
        await user.signUp().then((userRegistered)=> {
            console.log(userRegistered)
            ctx.response.saveCurrentUser(userRegistered)
            ctx.body = {
                result: true,
                msg: "登陆成功",
                content: userRegistered._sessionToken
            }
        }).catch(error1 => {
            console.error(error1)
            console.log(error1)
            ctx.response.body = {
                result: false,
                msg: error1,
            }
        })
    } catch (error2) {
        console.error(error2)
        ctx.response.body = {
            result: false,
            msg: error2,
        }
    }
}

UserModel.login = async (ctx, next) =>{
    const loginUser = {
        username: ctx.request.body.username,
        password: ctx.request.body.password,
    }
    await AV.User.logIn(loginUser.username, loginUser.password).then((user) =>{
        ctx.response.saveCurrentUser(user)
        // console.log(ctx.request.currentUser.get("username"))
        // 打印的user 格式
        // child {
        //     _serverData:
        //     { username: 'admin',
        //         emailVerified: false,
        //         mobilePhoneVerified: false },
        //     _opSetQueue: [ {} ],
        //         _flags: {},
        //     attributes:
        //     { username: 'admin',
        //         emailVerified: false,
        //         mobilePhoneVerified: false },
        //     _hashedJSON: {},
        //     _escapedAttributes: {},
        //     cid: 'c1',
        //         changed: {},
        //     _silent: {},
        //     _pending: {},
        //     _hasData: undefined,
        //         _previousAttributes: {},
        //     _sessionToken: '',
        //         id: '',
        //         createdAt: 2018-11-15T07:39:06.301Z,
        //         updatedAt: 2018-11-15T07:39:06.301Z }

        // 可使用jsonwebtoken管理用户状态
        // const userToken = {
        //     name: user.attributes.username,
        //     id: user.id
        // }
        // const token = jwt.sign(userToken, config.secret) // 签发token
        ctx.body = {
            result: true,
            msg: "登陆成功",
            content: user._sessionToken
        }
    }).catch((error)=> {
        console.log(error)
        ctx.body = {
            result: false,
            msg: "登陆失败," + `${error.rawMessage}(code:${error.code})`,
            // content: error
        }
    })
}

UserModel.logout = async (ctx, next) => {

    try {
        const currentUser = ctx.request.currentUser
        await currentUser.logOut()
        await ctx.response.clearCurrentUser()
        ctx.body = {
            result: false,
            msg: "退出登陆失败"
        }
    }catch (e) {
        ctx.body = {
            result: true,
            msg: "退出登陆成功",
            content: JSON.stringify(e)
        }
    }
}

module.exports = UserModel
