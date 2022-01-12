let http = require("http");
var server = http.createServer();
let express = require("express");
let app = express();
let path = require("path");
var bodyParser = require('body-parser');
var static = require('serve-static');
var router = express.Router();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
var expressSession = require('express-session');

var expressErrorHandler = require('express-error-handler');

var errorHandler = expressErrorHandler({
    static:{
        '404' : './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404) );
app.use(errorHandler);

const { rmSync } = require("fs");
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

router.route('/process/login').post(function (req, res) {
    console.log("/process/login 세션 호출");
    var paramUserId = req.body.userId || req.query.userId;
    var paramUserPwd = req.body.userPwd || req.query.userPwd;
    if (req.session.user) {
        console.log("이미 로그인되어 상품 페이지로 이동합니다.");
        res.redirect("/public/product.html")
    } else {
        req.session.user = { id: paramUserId, name: "코난", authorized: true };
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h1>로그인 성공</h1>');
        res.write("<div><p>Param id :" + paramUserId + '</p></div>');
        res.write("<div><p>Param password :" + paramUserPwd + '</p></div>');
        res.write("<br><br><a href='/public/login2.html'>로그인 페이지로 돌아가기</a>");
        res.end();
    }
});

router.route('/process/logout').get(function(req,res){
    console.log('/process/logout 호출됨');
    if(req.session.user){
        //로그인된 상태
        console.log('로그아웃합니다.');
        req.session.destroy(function(err){
            if(err){throw err;}
            console.log("세션을 삭제하고 로그아웃함");
            res.redirect('/public/login2.html');
        })
    }else{
        //로그인 안된 상태
        console.log("아직 로그인 되어있지 않음.");
        res.redirect("/public/login2.html")
    }
})

router.route('/process/product').get(function(req, res){
    console.log("/process/product 호출됨");
    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect("/public/login2.html");
    }
})
app.use("/", router); // 자바 controller 같은 느낌

app.listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 start.');
})