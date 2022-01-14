//Express 기본 모듈 불러오기
let http = require("http");
let express = require("express");
let path = require("path");

// Express의 미들 웨어 불러오기
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let static = require('serve-static');

// 오류 핸들러 모듈 사용
let expressErrorHandler = require('express-error-handler');
//Session 미들웨어 불러오기
let expressSession = require('express-session');
//익스 프레스 객체 생성
let app = express();

//몽고디비 모듈 사용
let MongoClient = require('mongodb').MongoClient;
// 데이터베이스 객체를 위한 변수 선언
let mongoose = require('mongoose');
// 자바스크립트 객체와 데이터베이스 객체를 서로 매칭(스키마 지원)
let database; let MemberSchema; let MemberModel;
//데이터베이스에 연결

//기본 속성 설정
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());
//public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));


function connectDB() {
    //데이터베이스 연결 정보
    let databaseUrl = "mongodb://localhost:27017/bitDB";
    //데이터베이스 연결
    console.log('데이테베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise; // mongoose의 Promise 객체는 global의 Promise객체 사용하도록 함
    mongoose.connect(databaseUrl);
    database = mongoose.connection
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        //스키마 정의
        MemberSchema = mongoose.Schema({
            userId: { type: String, required: true, unique: true },
            userPwd: { type: String, required: true },
            userName: { type: String, index: 'hashed' },
            age: { type: Number, 'default': -1 },
            regDate: { type: Date, index: { unique: false }, 'default': Date.now },
            updateDate: { type: Date, index: { unique: false }, 'default': Date.now }
        })
        
        //스키마에 static 메소드 추가
        MemberSchema.static('findById', function (userId, callback) {
            return this.find({ userId: userId }, callback);
        })
        MemberSchema.static('findAll', function (callback) {
            return this.find({}, callback);
        })
        console.log('MemberSchema 정의함');
        //MemberModel 모델 정의
        MemberModel = mongoose.model("members2", MemberSchema);
        console.log('MemberModel 정의함.');
    })
    //연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function () {
        console.log("연결이 끊어졌습니다. 5초 후 재연결 합니다.");
        setInterval(connectDB, 5000)
    })
}
var listMember = require('./member').listMember;
var authMember = require('./member').authMember;
var addMember = require('./member').addMember;

//=======라우팅 함수 등록==========//
var router = express.Router();

router.route('/process/addMember').post(function (req, res) {
    console.log('/process/addMember 호출됨')
    var userId = req.body.userId || req.query.UserId;
    var userPwd = req.body.userPwd || req.query.UserPwd;
    var userName = req.body.userName || req.query.UserName;
    var age = req.body.age || req.query.age;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd + ', ' + userName+', '+age);
    if (database) {
        addMember(database, MemberModel, userId, userPwd, userName, age, function (err, result) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (result) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' })
                res.write("<h1>회원가입 성공</h1>");
                res.end();
            } else {//결과 객체가 없으면 실패응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write("<h1>회원가입 실패</h1>");
                res.end();
            }
        })
    } else {//데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write("<h1>데이터 베이스 연결 실패</h1>");
        res.end();
    }
})

//로그인 라우팅 함수 - 데이터 베이스의 정보와 비교
router.route('/process/authMember').post(function (req, res) {
    console.log('/process/authMember 호출됨')
    var userId = req.body.userId || req.query.UserId;
    var userPwd = req.body.userPwd || req.query.UserPwd;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd);
    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        authMember(database, MemberModel, userId, userPwd, function (err, results) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (results) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write("<h1>로그인 성공</h1>");
                res.end();
            } else {//조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write("<h1>로그인 실패</h1>");
                res.end();
            }
        })
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write("<h1>데이터 베이스 연결 실패</h1>");
        res.end();
    }
})
//회원리스트 조회
router.route('/process/listMember').post(function (req, res) {
    console.log('/process/listMember 호출됨')
    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        //1. 모든 사용자 검색
        MemberModel.findAll(function (err, results) {
            if (err) { 
                console.error('사용자 리스트 조회 중 오류 발생 : '+err.stack);
                res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                return;
            }
            //조회된 레코드가 있으면 성공 응답 전송
            if (results) {
                console.dir(results);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write("<h1>사용자 리스트</h1>");
                res.write("<div><ul>")
                for (let i = 0; i < results.length; i++) {
                    var curUserId = results[i]._doc.userId;
                    var curUserName = results[i]._doc.userName;
                    var curUserPwd = results[i]._doc.userPwd;
                    var curUserAge = results[i]._doc.age;
                    var curUserRegDate = results[i]._doc.regDate;
                    var curUserUpdateDate = results[i]._doc.updateDate;
                    res.write("<li>#"+i+' : '+curUserId +', '+curUserName+', '+curUserPwd+', '+curUserAge+', '+curUserRegDate+', '+curUserUpdateDate+'</li>');
                }
              
            } else {//조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write("<h1>로그인 실패</h1>");
                res.end();
            }
        })
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write("<h1>데이터 베이스 연결 실패</h1>");
        res.end();
    }
})


app.use("/", router);

app.listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    //데이터베이스 연결을 위한 함수호출
    connectDB();
})