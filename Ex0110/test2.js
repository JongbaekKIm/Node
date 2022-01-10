const calc = require("./calc.js");
console.log("모듈로 분리한 후 - calc.add 함수 호출 결과 : %d", calc.add(20,20));

var calc2 = require("./calc2.js");
console.log("모듈로 분리한 후 = calc2.add 함수 호출 결과 : %d", calc2.add(10, 20));

const nconf = require("nconf");
nconf.env();
console.log("OS 환경변수의 값 : %s", nconf.get("OS"));

const os = require('OS');
console.log('시스템의 hostname : %s', os.hostname());
console.log("시스템의 메모리 : %d / %d", os.freemem(), os.totalmem());
console.log("시스템의 CPU정보 \n");
console.dir(os.cpus());
console.log("시스템의 네트워크 인터페이스 정보\n");
console.dir(os.networkInterfaces());