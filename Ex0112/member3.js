//module.exports에는 객체를 그대로 할당 할 수 있음
var member = {
    getMember : function(){
        return {userId : 'conan', userName : '코난'}
    },
    group:{userId : 'group01', userName : '어린이탐정단'}
}
module.exports = member;