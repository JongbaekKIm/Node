let http = require("http");
var server = http.createServer();
let express = require("express");
let app = express();
let path = require("path");
var bodyParser = require('body-parser');
var static = require('serve-static');
var router = express.Router();
var cookieParser = require("cookie-parser");
app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));


router.route('/process/login').post(function (req, res) {

    var paramUserId = req.body.userId || req.query.UserId;
    var paramUserPwd = req.body.userPwd || req.query.UserPwd;
    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
    res.write("<h1>Express 서버에서 응답한 결과(Login)</h1>");

    res.write("<div><p>Param id :" + paramUserId + '</p></div>');
    res.write("<div><p>Param password :" + paramUserPwd + '</p></div>');
    res.end();
})

router.route('/process/login/:name').post(function (req, res) {

    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
    res.write("<h1>/process/login/:name 을 처리함</h1>");
    var paramName = req.params.name;
    var paramUserId = req.body.userId || req.query.UserId;
    var paramUserPwd = req.body.userPwd || req.query.UserPwd;

    res.write("<div><p>Param name :" + paramName + '</p></div>');
    res.write("<div><p>Param id :" + paramUserId + '</p></div>');
    res.write("<div><p>Param password :" + paramUserPwd + '</p></div>');
    res.write("<br><br><a href='/public/login.html'>로그인 페이지로 돌아가기</a>");
    res.end();
})

router.route('/process/users/:id').get(function (req, res) {

    var paramUserId = req.params.id;
    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
    res.write("<h1>/process/users/:id 을 처리함</h1>");


    res.write("<div><p>Param id :" + paramUserId + '</p></div>');
    res.write("<br><br><a href='/public/login.html'>로그인 페이지로 돌아가기</a>");
    res.end();
})
app.use("/", router); // 자바 controller 같은 느낌
app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start.');
})

