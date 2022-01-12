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
let database;
//데이터베이스에 연결

//기본 속성 설정
app.set('port', process.env.PORT || 3000);
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());
//public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));


// function connectDB() {
//     //데이터베이스 연결 정보
//     let databaseUrl = "mongodb://localhost:27017/";
//     //데이터베이스 연결
//     MongoClient.connect(databaseUrl, function(err, client){
//         database = client.db('bitDB');
//         if(err) { throw err; } 
//         console.log("데이터베이스에 연결되었습니다..:" + databaseUrl);
//     });
// }

app.use("/", router);

app.listen(app.get('port'), function () {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
    //데이터베이스 연결을 위한 함수호출
    connectDB();
})