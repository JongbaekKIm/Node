//=============================속성 함수================================//
//사용자를 추가하는 함수
var addMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('addMember 호출됨 : ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);
    //MemberModel 인스턴스 생성
    var user = new database.MemberModel({ "userId": userId, "userPwd": userPwd, "userName": userName, "age": age })
    //save()로 저장 : 저장 성공시 addedUser 객체가 파라미터로 전달됨
    user.save(function (err, addedUser) {
        console.log("addedUser%j", addedUser);
        if (err) {
            callback(err, null);
            return;
        }
        console.log("사용자 데이터 추가함.");
        callback(null, addedUser);
    })
}

var updateMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('updateMember 호출됨 : ' + userId + ', ' + userPwd + ', ' + userName);
    //Members collection 참조
    database.MemberModel.updateOne({ "userId": userId }, { $set: { "userPwd": userPwd, "userName": userName, "age": age } }, function (err, result) {
        if (err) {//에러 방생시 콜백 함수를 호출하면서 에러 객체 전달
            callback(err, null);
            return;
        }
        if (result.modifiedCount > 0) {
            console.log('사용자 레코드 업데이트됨 : ' + result.modifiedCount);
        } else {
            console.log("추가 되지 않았음.")
        }
        callback(null, result);
    });
}

var authMember = function (database, userId, userPwd, callback) {
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd);
    //1. 아이디를 사용해 검색
    database.MemberModel.findById(userId, function (err, results) {
        if (err) {//에러 방생시 콜백 함수를 호출하면서 에러 객체 전달
            callback(err, null);
            return;
        }
        console.log("아이디 [%s]로 사용자 검색결과", userId);
        if (results.length > 0) { //조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
            console.log('아이디[%s]가 일치하는 사용자 찾음.', userId);
            //2. 비밀번호 확인
            if (results[0]._doc.userPwd === userPwd) {
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log("비밀번호 일치하지 않음");
                callback(null, null);
            }
        } else {// 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 NUll, NULl 전달
            console.log("일치하는 사용자를 찾지 못함.")
            callback(null, null);
        }
    })
}

var listMember = function (database, callback) {
    console.log('listMember 호출됨');
    //모든 회원 검색
    database.MemberModel.findAll(function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length > 0) {
            console.log('등록된 회원 목록 결과 : ' + results);
            callback(null, results);
        } else {
            console.log('등록된 회원 없음');
            callback(null, null);
        }
    })
}

//==============================라우터 함수=================================//

var procLogin = function (req, res) {
    console.log("모듈 내에 있는 procLogin 호출됨");
    var database = req.app.get('database');
    var userId = req.body.userId || req.query.UserId;
    var userPwd = req.body.userPwd || req.query.UserPwd;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd);
    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        authMember(database, userId, userPwd, function (err, results) {
            if (err) { }
            //조회된 레코드가 있으면 성공 응답 전송
            if (results) {
                var context = { userId: userId, userPwd: userPwd };
                req.app.render("loginSuccess", context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write("<h2>뷰 렌더링 중 오류 발생 </h2>");
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                });
            }
            else {//조회된 레코드가 없는 경우 실패 응답 전송
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
}

var procAddMember = function (req, res) {
    console.log("모듈 내에 있는 procAddMember 호출됨");
    var database = req.app.get('database');

    var userId = req.body.userId || req.query.UserId;
    var userPwd = req.body.userPwd || req.query.UserPwd;
    var userName = req.body.userName || req.query.UserName;
    var age = req.body.age || req.query.age;
    console.log('요청 파라미터 : ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);
    if (database) { 
        addMember(database, userId, userPwd, userName, age, function (err, result) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (result) {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
               // res.end();
                var context = { userId: userId, userPwd: userPwd, userName:userName, age:age };
                req.app.render("addMember", context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write("<h2>뷰 렌더링 중 오류 발생 </h2>");
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                });
            } else {//결과 객체가 없으면 실패응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write("<h1>회원가입 실패</h1>");
                res.end();
            }
        }) //addeMember 콜백 끝
    } else {//데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write("<h1>데이터 베이스 연결 실패</h1>");
        res.end();
    }
}

var procListMember = function (req, res) {
    console.log("모듈 내에 있는 procListMember 호출됨");
    var database = req.app.get('database');
    //모든 회원 검색
    //데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if (database) {
        //1. 모든 사용자 검색
        database.MemberModel.findAll(function (err, results) {
            if (err) {
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            //조회된 레코드가 있으면 성공 응답 전송
            if (results) {
                var context = { results : results };
                req.app.render("listMember", context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write("<h2>뷰 렌더링 중 오류 발생 </h2>");
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                });

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
}

var procUpdateMember = function (req, res) {
    var write = res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
    console.log('/process/updateMember 호출됨')
    var database = req.app.get('database');
    var userId = req.body.userId || req.query.UserId;
    var userPwd = req.body.userPwd || req.query.UserPwd;
    var userName = req.body.userName || req.query.userName;
    var age = req.body.age || req.query.age;

    console.log('요청 파라미터 : ' + userId + ', ' + userPwd + ', ' + userName);
    if (database) {
        updateMember(database, userId, userPwd, userName, age, function (err, result) {
            if (err) { throw err; }
            //조회된 레코드가 있으면 성공 응답 전송
            if (result && result.modifiedCount > 0) {
                // res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' })
                write;
                res.write("<h1>회원정보 수정 성공</h1>");
                res.end();
            } else {//결과 객체가 없으면 실패응답 전송
                // res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                write;
                res.write("<h1>회원정보 수정 실패</h1>");
                res.end();
            }
        })
    } else {//데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        // res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        write;
        res.write("<h1>데이터 베이스 연결 실패</h1>");
        res.end();
    }
}
//모듈 exports
module.exports.procLogin = procLogin;
module.exports.procAddMember = procAddMember;
module.exports.procListMember = procListMember;
module.exports.procUpdateMember = procUpdateMember;
