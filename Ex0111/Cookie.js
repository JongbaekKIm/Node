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
app.use("/", router); // 자바 controller 같은 느낌

router.route('/process/setUserCookie').get(function (req, res) {
    console.log("/process/setUserCookie 호출");
   //쿠키설정.. 응답 객체의 cookie 메소드 호출
   res.cookie("user",{
       id : "conan",
       name : "코난",
       authorized : true
   })//redirect로 응답
   res.redirect('/process/showCookie');
})

router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie 호출됨');
    res.send(req.cookies);
})

app.all('*', function(req, res){
    res.status(404).send('<h1>ERROR-페이지를 찾을 수 없습니다. </h1>');
})



app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 start.');
})