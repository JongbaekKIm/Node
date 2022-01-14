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
// 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/semantic', static(path.join(__dirname, 'semantic')));
app.use('/images', static(path.join(__dirname, 'images')));


function createMemberSchema(database) {
    console.log('createMemberSchema() 호출되었음');
    database.MemberSchema = require('./database/memberSchema.js').createSchema(mongoose);
    database.MemberModel = mongoose.model("members2", database.MemberSchema);
    console.log('Schema 생성 되었음.');
    console.dir('Model 생성되었음');
}

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
        createMemberSchema(database);
    })
    //연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function () {
        console.log("연결이 끊어졌습니다. 5초 후 재연결 합니다.");
        setInterval(connectDB, 5000)
    })
    app.set('database', database);
}

//=======라우팅 함수 등록==========//
var router = express.Router();

var member = require('./member');
router.route('/process/authMember').post(member.procLogin);
router.route('/process/addMember').post(member.procAddMember);
router.route('/process/listMember').post(member.procListMember);
router.route('/process/updateMember').post(member.procUpdateMember);

app.use("/", router);

app.listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    //데이터베이스 연결을 위한 함수호출
    connectDB();
})