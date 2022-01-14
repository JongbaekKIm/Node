// var member = require('./member3');
// function showMember(){
//     return member.getMember().userName +', '+member.group.userName;
// }
//  console.log('사용자 정보 : %s', showMember());

// var member4 = require('./member4');
// function showMember(){
//     return member4().userName +', '+'no group';
// }
// console.log('사용자 정보 : %s', showMember());

// var printMember = require('./member5').printMember;
// printMember();

// var member6 = require('./member6');
// member6.printMember(); 

var Member7 = require('./member7');
var member7 = new Member7('conan', '코난');
member7.printMember();