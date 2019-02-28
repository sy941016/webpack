// //引入http模块
// let http = require("http");
// //设置主机名
// let hostName = '127.0.0.1';
// //设置端口
// let port = 4567;
// //创建服务
// let server = http.createServer(function(req,res){
//     res.setHeader('Content-Type','text/plain');
//     res.end("hello nodejs");
//
// });
// server.listen(port,hostName,function(){
//     console.log(`服务器运行在http://${hostName}:${port}`);
// });
let express = require("express");
let app = express();
app.use(express.static("dist")); //指定目录
app.listen(4567,function () {
    console.log('启动成功')
})
