const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 获取用户信息的函数
exports.get_userinfo = (req,res)=>{ 
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?';
    db.query(sql,req.user.id,(err,results)=>{
        if(err) return res.cc(err)   // 判断执行SQL是否出错
        if(results.length !== 1) res.cc('信息获取失败') // 判断是否成功的拿到信息
        // 到这里就获取成功了  
        res.send({status:0,               
        message:'获取信息成功',
        data:results[0]})   //results[0] 是获取的信息
    })
}

// 更新用户信息的函数
exports.update_userinfo = (req,res)=>{ 
    const sql = 'update ev_users set ? where id=?';
    db.query(sql,[req.body,req.body.id],(err,results)=>{
        if(err) return res.cc(err)   // 判断执行SQL是否出错
        if(results.affectedRows !== 1) res.cc('信息更新失败') // 判断是否成功的拿到信息
        // 到这里就更新成功了  
        res.send({status:0,               
        message:'更新信息成功',
        })  
    })
}
// 重置密码处理函数
exports.update_password = (req,res)=>{ 
    const sql = 'select * from ev_users  where id=?';
    db.query(sql,[req.user.id],(err,results)=>{
        if(err) return res.cc(err)   // 判断执行SQL是否出错
        if(results.length !== 1) res.cc('用户不存在') // 判断数据库里是否存在这用户
        // 旧密码是否与数据库里的一致
        const compareResult= bcrypt.compareSync(req.body.oldpwd , results[0].password)
        if(!compareResult) return res.send('旧密码不正确')
        // 到这里就 旧密码正确 可以重置
        pwdSql = 'update ev_users set password=? where id=?'
        // 对新密码进行加密 
        const newpwd = bcrypt.hashSync(req.body.newpwd,10)
        db.query(pwdSql,[newpwd,req.user.id],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('重置密码失败')
            // 重置成功
            res.cc('重置成功',0)
        
        })  
    })


}
// 更新头像 
exports.update_avatar = (req,res)=>{
    res.send('ok')
}