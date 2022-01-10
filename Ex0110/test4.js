//server 기본 설정(default값)
var http = require("http");
var server = http.createServer();
var port = 3000;
var host = '192.168.0.18';
var fs = require("fs");

//connection 이벤트와 request 이벤트 처리
server.listen(port, function(){ // listen : 서버한테 실행전까지 대기시킨다.
    console.log('웹 서버 시작 : %d', port);
});
server.on("connection", function(socket){
    var addr = socket.address();
    console.log("클라이언트가 접속 : %s, %d", addr.address, addr.port);
});
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

server.on('request', function(req, res){
    console.log("클라이언트 요청");
    var filename = 'conan.jpg';
    fs.readFile(filename, function(err, data){
        res.writeHead(200, {"Content-Type": "image/jpg"});
        res.write(data);
        res.end();
    });
});// request;

// server.on('request',function(req,res){
//     console.log('클라이언트 요청');
//     var filename ='aaa.jpg';
//     fs.readFile(filename,function(err,data){
//         res.writeHead(200,{"Content-Type":"image/JPG"});
//         res.write(data);
//         res.end();
//     })
// });