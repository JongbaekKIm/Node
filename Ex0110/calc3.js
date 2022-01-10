//계산기 객체를 모듈로 구성
//계산기 객체가 EventEmitter를 상속하면 emit과 on 메소드 사용가능

var util = require("util");
var EventEmitter = require("events").EventEmitter;
var Calc = function(){
    var self = this;

    this.on('stop', function(){
        console.log('Calc에 stop event 전달됨.');
    });
};
util.inherits(Calc, EventEmitter);
Calc.prototype.add = function(a,b){
    return a+b;
}

module.exports = Calc;
module.exports.title = 'calculator';