// 引入数据库操作模块
const db = require('../db/index.js')
// 引入加密包 bcryptjs
const bcrypt = require('bcryptjs')
const token = require('jsonwebtoken')
const config = require('../config')  // 导入全局配置文件
const jwt = require('jsonwebtoken')  // 生成token的第三方包
// 注册新用户的处理函数 并用exports向外暴露
exports.regUser = (req, res) => {
    const userinfo = req.body // 获取用户提交的数据
    // if(!userinfo.username || !userinfo.password ){  // 检测账号密码的合法性
    //     return res.send({
    //         status:'1',
    //         msg:'用户名或密码不合法'
    //     })
    // }   改成用第三方包 joi和express-joi 来实现对用户信息的合法性检测
    // 定义 SQL 语句  查询用户名是否已经被占用
    const sqlStr = 'select * from ev_users where username = ?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) { //执行 SQL 语句  失败 
            // return res.send({status:'1',message:err.message})
            return res.cc(err)
        }
        //  判断用户名是否已经被占用
        if (results.length > 0) {
            // return res.send({status:'1',message:'用户名被占用，请更换其他用户名'})
            return res.cc('用户名被占用，请更换其他用户名')
        }
        // 到了这里就说明 用户名可以使用
        // 调用 bcrypt.hashSync() 对密码进行加密,第二个参数是安全性 一般就写10
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 数据库里插入新用户账号密码
        const sql = 'insert into ev_users set ? '
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            // if(err) return res.send({status:'1',message:err.message}) // 判断sql语句执行是否成功
            if (err) return res.cc(err)
            // 判断影响行数是否为 1 ， 账户插入是否成功
            // if(results.affectedRows !== 1) return res.send({status:'1',message:'注册用户失败，请稍后再试'}) 
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试!')
            // 注册成功了
            // res.send({status:'0',message:'注册成功'}) 
            res.cc('注册成功', 0)
        })
    })
}
// 登录 处理函数
exports.login = (req, res) => {
    // 接受表单的数据
    const userinfo = req.body
    //定义SQL语句
    const sql = 'select * from ev_users where username = ?'
    // 执行SQL 查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        if (err){return res.cc(err)}
        // 执行SQL ， 但是获取到的数据条数不等于1 也是失败的情况
        if (results.length !==  1){return res.cc('未查询到数据')}
        // 判断密码是否正确 
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult){return res.cc('登录失败，密码有误')}
        // 登录成功 
             // 获取用户信息 并把敏感信息剔除
        const user = {...results[0],password:null,user_pic:null}
            // 对用户信息加密然后生成token 字符串
            const jwtStr = jwt.sign(user,config.jwtsecretKey,{expiresIn:config.expiresIn})
            // token 字符串响应给客户端
            res.send({
                status:0,
                message:'登录成功',
                token:'Bearer ' + jwtStr
            })
    })
}


