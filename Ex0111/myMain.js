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
var expressSession = require('express-session');
var multer = require("multer");//파일 업로드용 미들웨어
var fs = require("fs");
//클라이언트에서 ajax로 요청 시 cors(다중 서버 접속) 지원
var cors = require("cors");
//public 폴더의 uploads 폴더 오픈

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(cors());

//multer 미들웨어 사용 : 미들 웨어 사용 순서 중요 body-parser -> multer ->
//파일 제한 : 10개, 1G

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 10, fileSize: 1024 * 1024 * 1024
    }
})

var expressErrorHandler = require('express-error-handler');

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

router.route('/process/upload').post(upload.array("uploadedFile", 1), function (req, res) {
    console.log('/process/upload 호출됨');
    try {
        var files = req.files;
        console.dir('#===========업로드 된 첫번째 파일 정보==============#');
        console.dir(req.files[0]);
        console.dir('#===================================================#');
        //현재의 파일 정보를 저장할 변수 선언
        var originalname = '', filename = '', mimetype = '', size = 0;
        if (Array.isArray(files)) {
            console.log("배열에 들어있는 파일 갯수 : %d", files.length);
            for (var index = 0; index < files.length; index++) {
                originalname = files[index].originalname; filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        } else {
            console.log("파일 갯수 : 1");
            originalname = files[index].originalname; filename = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        console.log("현재 파일 정보 :" + originalname + ", " + filename + ', ' + mimetype + ', ' + size);
        //클라이언트에 응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write("<h3>파일 업로드 성공</h3>");
        res.write("<hr/>");
        res.write("<p>원본 파일명 :" + originalname + "->저장 파일명 : " + filename + "</p>");
        res.write("<p>MIME TYPE : " + mimetype + "</p>");
        res.write("<p>파일 크기 :" + size + "</p>");
        res.end();
    } catch (err) {
        console.dir(err.stack);
    }
})

app.use("/", router); // 자바 controller 같은 느낌

app.listen(3000, function () {
    console.log('Express 서버가 3000번 포트에서 start.');
})