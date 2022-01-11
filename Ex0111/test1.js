const http = require('http');
const server = http.createServer();
const port = 3000;
server.listen(port, function(){
    console.log('웹 서버 시작 : %d', port);
})