const express = require('express')
const app = express()

const joi = require('joi')
// 为了简化代码封装一个res.cc() 函数 , 一定在路由之前
// 声明一个全局中间件 给res 挂在res.cc()函数
app.use((req, res, next) => {
    res.cc = function (err, status = 1) { // 默认是失败，所以status = 1
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 引入 CORS 
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件 只解析 X_X_wwwX_www_form_url格式的数据
app.use(express.urlencoded({
    extended: false
}))
// 用户路由之前配置解析token的中间件
const express_jwt = require('express-jwt')
const config = require('./config')
app.use(express_jwt({
    secret: config.jwtsecretKey
}).unless({
    path: [/\/api/]
}))
//  引入并使用用户路由模块(./router/user.js)
const userRouter = require('./router/user.js')
app.use('/api', userRouter) // 要访问userRouter 的话 url 要加上/api 才能访问
// 导入并使用用户信息的路由
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
// 定义全局的错误级别中间件 
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    res.cc(err) // 未知的错误
})




app.listen(3007, () => {
    console.log('Api server is running at http://127.0.0.1:3007')
})