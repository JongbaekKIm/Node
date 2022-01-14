//사용자를 추가하는 함수

exports.addMember = function (database, MemberModel, userId, userPwd, userName, age, callback) {
    console.log('addMember 호출됨 : ' + userId + ', ' + userPwd + ', ' + userName+', '+age);
    //MemberModel 인스턴스 생성
    var user = new MemberModel({ "userId": userId, "userPwd": userPwd, "userName": userName, "age":age })
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

exports.authMember = function (database, MemberModel, userId, userPwd, callback) {
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd);
    //1. 아이디를 사용해 검색
    MemberModel.findById(userId, function (err, results) {
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

exports.listMember = function(database, MemberModel, callback){
    console.log('listMember 호출됨');
    //모든 회원 검색
    MemberModel.findAll(function (err, results){
        if(err){
            callback(err, null);
            return;
        }
        if(results.length>0){
            console.log('등록된 회원 목록 결과 : '+results);
            callback(null, results);
        }else{
            console.log('등록된 회원 없음');
            callback(null,null);
        }
    })
}