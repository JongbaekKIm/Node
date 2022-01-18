// 네이버 검색 API예제는 블로그를 비롯 전문자료까지 호출방법이 동일하므로 blog검색만 대표로 예제를 올렸습니다.
// 네이버 검색 Open API 예제 - 블로그 검색
var express = require('express');
let http = require("http");
let path = require("path");
let static = require('serve-static');
let bodyParser = require('body-parser')
var app = express();
var client_id = '5Jl3LLFq6CRMPpwIsTRL';
var client_secret = 'GVgezEv8Yw';
//익스프레스에서 뷰 엔진을 ejs로 설정
app.set('port', process.env.PORT || 3000);
app.set('/views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/semantic', static(path.join(__dirname, 'semantic')));
//body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
//body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());
app.post('/naver/news', function (req, res) {
  var query = req.body.query||req.query.query;
  var api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(query); // json 결과
  //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
  var request = require('request');
  var option = {};
  var options = {
    url: api_url,
    qs: option,
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let newsItems = JSON.parse(body).items; //itmes - title, link, description, pubDate
      const newsArray = [];
      for (let i = 0; i < newsItems.length; i++) {
        let newsItem = {};
        newsItem.title = newsItems[i].title.replace(/(<([^>]+)>)|&quot:/ig, "");
        newsItem.link = newsItems[i].link.replace(/(<([^>]+)>)|&quot:/ig, "");
        newsItem.description = newsItems[i].description.replace(/(<([^>]+)>)|&quot:/ig, "");
        newsItem.pubDate = newsItems[i].pubDate.replace(/(<([^>]+)>)|&quot:/ig, "");
        newsArray.push(newsItem);
      }
      //  res.json(newsArray);
      var context = { newsArray: newsArray };
      req.app.render("searchList", context, function (err, html) {
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
      //  res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});
app.listen(3000, function () {
  console.log('http://localhost:3000/naver/news?query=검색어 app listening on port 3000!');
});