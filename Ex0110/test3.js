//노드의 파일 시스템
const fs = require("fs");

var data = fs.readFileSync('./package.json', 'utf-8');
console.log(data);

//readFile 메소드 사용하면서 callback 함수를 파라미터로 전달
fs.readFile('./package.json', 'utf-8', function(err, data){
    console.log(data);
})
console.log("프로젝트 폴더 안의 package.json 파일 읽기");

//비동기식으로 파일쓰기
fs.writeFile('/output.txt', 'Hello World!', function(err){
    if(err){
        console.log("Error : "+err);
    }
    console.log("output.txt 파일에 데이터 쓰기 완료");
})

//파일 열기, 닫기, 읽기 & 쓰기
// open, read, write, close 등의 메소드가 사용됨
fs.open('./output.txt', 'w', function(err, fd){
    if(err) throw err;
    const buf = Buffer.from("안녕!\n", "utf-8");
    fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){
        if(err) throw err;
        console.log(err, written, buffer);
        fs.close(fd, function(){
            console.log("파일 열고 데이터 쓰고 닫기 완료.")
        })
    })
})

//open으로 열고 read로 읽기, 버퍼사용
fs.open("./output.txt", 'r', function(err, fd){
    if(err) throw err;
    var buf=Buffer.alloc(20);
    console.log("버퍼 타입 : %s", Buffer.isBuffer(buf));
    fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buffer){
        if(err) throw err;
        var inStr = buffer.toString("utf-8", 0, bytesRead);
        console.log("파일에서 읽은 데이터 : %s", inStr);
        console.log(err, bytesRead, buffer);
        fs.close(fd, function(){
            console.log("output.txt 파일을 열고 읽기 완료.");
        })
    })
})

//스트림 단위로 파일 읽고 쓰기
//createReadStream으로 읽기 위해 열고, createWriteStream으로 쓰기 위해 열기
var infile = fs.createReadStream("./output.txt", {flags :'r'});
var outfile = fs.createWriteStream("./output2.txt", {flags :'w'});
infile.on('data', function(data){
    console.log("읽어 들인 데이터", data);
    outfile.write(data);
})
infile.on("end", function(){
    console.log("파일 읽기 종료.");
    outfile.end(function(){
        console.log("파일 쓰기 종료");
    })
})