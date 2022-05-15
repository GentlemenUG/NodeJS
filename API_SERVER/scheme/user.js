// 引入定义验证规则的包
const joi = require('joi')
// 定义用户名和密码验证规则
const username = joi.string().alphanum().min(1).max(14).required()
const password = joi.string().pattern(/^(\w){6,20}$/).required()
// 定义验证注册和登录表单数据的规则（合法性）对象 并用 exports. 向外暴露
exports.reg_login_scheme = {
    body:{
        username,
        password,
    }
}
// 定义id email nickname 验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email  = joi.string().email().required()
// 定义 规则对象 并用 exports. 向外暴露
exports.update_userinfo_scheme = {
    body:{
        id:id,
        email:email,
        nickname:nickname
    }
}
// 密码重置规则
exports.update_password_scheme = {
    body:{
        oldpwd : password ,
        newpwd:joi.not(joi.ref('oldpwd')).concat(password)    // concat(password) 合并多条验证规则 和password的规则一样
    }
}