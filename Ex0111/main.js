let http = require("http");
var server = http.createServer();
let express = require("express");
let app = express();
let path=require("path");
var bodyParser = require('body-parser');
var static = require('serve-static');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());
app.use(static(path.join(__dirname, 'public')));

app.use(function (req, res, next){
    console.log("첫번째 미들웨어에서 요청 처리중.");
    var paramUserId = req.body.userId||req.query.UserId;
    var paramUserPwd = req.body.userPwd||req.query.UserPwd;
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
res.write("<h1>Express 서버에서 응답한 결과</h1>");

res.write("<div><p>Param id :"+paramUserId + '</p></div>');
res.write("<div><p>Param password :"+paramUserPwd + '</p></div>');
res.end();
})

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start.');
})