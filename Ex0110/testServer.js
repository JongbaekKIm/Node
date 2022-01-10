/* 1번 예제
var http = require('http');
var server = http.createServer();

var port =3000;
server.listen(port,function(){
    console.log('웹서버 시작  : %d',port);
});
*/
// ctrl + c 강제 종료

/* 2번 예제
var http = require('http');
var server = http.createServer();
var host ='192.168.0.45';
var port =3000;
server.listen(port,host,'50000',function(){
    console.log("웹서버 시작 %s %d",host,port);
});
*/

var fs  = require('fs');
var http = require('http');
var server = http.createServer();
var port =3000;

server.listen(port,function(){
    console.log("웹서버 시작 %d",port);
});

server.on('connection',function(socket){
    var addr = socket.address();
    console.log("클라이언트가 접속 %s %d",addr.address,addr.port);
});

//server.on('request',function(req,res){
//    console.log("클라이언트가 요청함");
//    console.dir(req);
//})
/*
server.on('request',function(req,res){
    console.log('클라이언트 요청');
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>응답페이지</title>");
    res.write("</head>");
    res.write("<body>");
    res.write("<h1>노드제이에스로부터 응답페이지</h1>");
    res.write("</body>");
    res.end();
});*/


server.on('request',function(req,res){
    console.log('클라이언트 요청');
    var filename ='aaa.jpg';
    fs.readFile(filename,function(err,data){
        res.writeHead(200,{"Content-Type":"image/jpg"});
        res.write(data);
        res.end();
    })
});