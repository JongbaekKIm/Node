//server 기본 설정(default값)
var fs = require("fs");
let http = require("http");
var server = http.createServer();
// var port = 3000;
var host

//connection 이벤트와 request 이벤트 처리
// server.listen(port, function(){ // listen : 서버한테 실행전까지 대기시킨다.
//     console.log('웹 서버 시작 : %d', port);
// });
// server.on("connection", function(socket){
//     var addr = socket.address();
//     console.log("클라이언트가 접속 : %s, %d", addr.address, addr.port);
// });
// server.on("request", function(req, res){
//     console.log("클라이언트가 요청함");
//     console.dir(req);
// });
// server.listen(port, host, '50000', function(){
//     console.log('웹 서버 시작 : %s, %d', host, port);
// });

// server.on('request', function(req, res){
//     console.log("클라이언트 요청");
//     res.writeHead(200, {"Content-Type" : "text/html;charset=utf-8"});
//     res.write("<!DOCTYPE html>");
//     res.write("<html>");
//     res.write("<head>");
//     res.write("<title>응답 페이지</title>");
//     res.write("</head>");
//     res.write("<body>");
//     res.write("<h1>노드 제이에스로 부터의 응답 페이지</h1>");
//     res.write("</body>");
//     res.write("</html>");
//     res.end();
// })

// server.on('request', function(req, res){
//     console.log("클라이언트 요청");
//     var filename = 'conan.jpg';
//     fs.readFile(filename, function(err, data){
//         res.writeHead(200, {"Content-Type": "image/jpg"});
//         res.write(data);
//         res.end();
//     });
// });

// server.on('request', function(req, res){
//     console.log('클라이언트 요청');
//     var filename = 'conan.jpg';
//     var onfile = fs.createReadStream(filename, {flags:'r'});
//     infile.pipe(res);
// })

// const option={
//     host:'www.google.com',
//     port:80,
//     path:'/'
// };
// const req = http.get(option, function (res){
//     let resData='';
//     res.on('data', function(chunk){
//         resData+=chunk;
//     })
//     res.on('end', function(){
//         console.log(resData);
//     })
// })
// req.on("error", function(err){
//     console.log("오류 발생" + err.message);
// })

// let opts = {
//     host:'www.google.com',
//     port:80,
//     method: 'POST',
//     path:'/',
//     headers:{}
// };
// let resData='';
// let req = http.request(opts, function (res){
//     res.on('data', function(chunk){
//         resData+=chunk;
//     })
//     res.on('end', function(){
//         console.log(resData);
//     })
// })

// opts.headers["Content-Type"] = 'application/x-www-form-urlencoded';
// req.data = 'q=actor';
// opts.headers["Content-Length"] = req.data.length;

// req.on("error", function(err){
//     console.log("오류 발생" + err.message);
// })

// req.write(req.data);
// req.end();


// const express = require('express');
// //익스프레스 객체 생성
// var app = express();
// //기본포트를 app객체에 속성으로 설정
// app.set('port', process.env.PORT||3000);
// //Express 서버 시작
// app.get("/",(req, res)=>{
//     res.send("Hello World");
// });
// app.listen(app.get('port'), ()=>
//     console.log('익스프레스 서버를 시작했습니다 : ' +app.get('port')));

let express = require("express");
let app = express();
// app.use(function (req, res, next){
//     console.log('첫 번째 미들웨어에서 요청을 처리함');
//     // res.send({ name : '코난', age : 10});
//     // res.writeHead('200', {'Content-Type':'text/html; charset=utf8'});
//     // res.end('<h1>Express 서버 응답</h1>');

//     // //다른 페이지로 이동하기
//     // res.redirect("http://google.co.kr");

//     req.user = 'conan';
//     next();
// })
// app.use("/", function(req, res, next){
//     console.log("두번째 미들웨어에서 요청처리.");
//     res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
//     res.end('<h1>Express 서버에서' +req.user+'가 응답중</h1>');
// })

//get방식
app.use(function (req, res, next){
    console.log("첫번째 미들웨어에서 요청 처리중.");
    var userAgent = req.header("User-Agent");
    var paramName = req.query.name;
    var paramAge = req.query.age;
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
res.write("<h1>Express 서버에서 응답한 결과</h1>");
res.write("<div><p>User-Agent :"+userAgent+'</p></div>');
res.write("<div><p>Param name :"+paramName + '</p></div>');
res.write("<div><p>Param age :"+paramAge + '</p></div>');
res.end();
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start.');
})
