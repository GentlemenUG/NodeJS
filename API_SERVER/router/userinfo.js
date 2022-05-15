const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
// 导入验证规则对象
const {update_userinfo_scheme} = require('../scheme/user')
// 挂在路由

// 获取用户基本信息的路由
const userinfoHandler = require('../router_handler/userinfo')
router.get('/userinfo',userinfoHandler.get_userinfo)
// 更新用户信息的路由 
router.post('/userupdate',expressJoi(update_userinfo_scheme),userinfoHandler.update_userinfo)
// 密码重置 
    // 导入密码验证规则对象
    const {update_password_scheme} = require('../scheme/user')
router.post('/updatepwd',expressJoi(update_password_scheme),userinfoHandler.update_password)
// 更新头像 
router.post('/update/avatar',userinfoHandler.update_avatar)



module.exports = router
