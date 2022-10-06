const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const { conn } = require('../config/config');
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

const CorsOptions = {
  origin: '*',
  method: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  credentials: true
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(CorsOptions));
app.use('/static', express.static('public'));
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.status(200).json({
    massage: '인덱스 화면과 연결 잘 됨.',
  });
});

app.post('/create_cafe', (req, res) => {
  const title = req.body.title;
  const explanation = req.body.explanation;
  const category = req.body.category;

  conn.query(`select * from category where name = '${category}'`, (err, results) => {
    if (err) throw err;
    const categoryId = results[0].id;
    conn.query(
      `insert into cafe(title, explanation, categoryId) values('${title}', '${explanation}', '${categoryId}')`,
      (err, results) => {
        if (err) throw err;
        res.json({
          massage: '카페 생성이 완료 되었습니다.',
          cafeName: title,
        });
      },
    );
  });
});

app.post('/create_post', (req, res) => {
  const context = req.query.context;
  const author = req.query.nickName
  const cafeName = req.query.name;
  var api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
  var request = require('request');
  var options = {
    url: api_url,
    form: { 'query':  `'${context}'`},
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const obj = JSON.parse(body);
      const langCode = obj.langCode
      console.log(langCode)
      conn.query(`select id from cafe where title = '${cafeName}'`, (err, result) => {
        if (err) throw err;
        const cafeId = result[0].id;
        conn.query(
          `insert into post(content, author, cafeId, source) values('${context}', '${author}', '${cafeId}', '${langCode}')`,
          (err, results) => {
            if (err) throw err;
            return res.json({
              author: author,
              content: context,
              source : langCode,
              massage: 'insert 완료',
            });
          },
        );
      });
    } else {
      console.log(error)
      return res.json({ error : error})
    }
  });
});

app.get('/get_post', (req, res) => {
  const context = req.query.context;
  let postList = new Array();
  conn.query(`select * from post where content Like '%${context}%'`, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      const author = result[i].author;
      const content = result[i].content;
      const date = new Date(result[i].createdAt);
      var year = date.getFullYear().toString();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);
      const finalDate = year + '/' + month + '/' + day;
      postList.push({
        name: author,
        content: content,
        date: finalDate,
      });
    }
    console.log(postList);
    conn.query(`select title from cafe where id = '${result[0].cafeId}'`, (err, result) => {
      if (err) throw err;
      res.json({
        postList: postList,
      });
    });
  });
});

app.get('/find_category', (req, res) => {
  const categoryName = req.query.category;
  let arr = new Array();
  conn.query(
    `select category.name, cafe.title from cafe, category 
                    where cafe.categoryId = category.id and category.name = '${categoryName}'`,
    (err, results) => {
      if (err) throw err;
      else if (results.length === 0) {
        res.send({ massage: '감지되는 카페 없음' });
      } else {
        for (let i = 0; i < results.length; i++) {
          arr.push(results[i].title);
        }
        console.log(arr);
        res.json({
          result: arr,
        });
      }
    },
  );
});

app.get('/search_cafe', (req, res) => {
  const searchWord = req.body.word;
  let arr = new Array();
  conn.query(`select title from cafe where title Like '%${searchWord}%'`, (err, results) => {
    if (err) throw err;
    else if (results.length === 0) {
      res.send({ massage: '감지되는 카페 없음' });
    } else {
      for (let i = 0; i < results.length; i++) {
        arr.push(results[i].title);
      }
      res.json({
        result: arr,
      });
    }
  });
});

app.get('/translate', function (req, res) {
  const target = req.query.target
  const text = req.query.text

  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var request = require('request');
  conn.query(`select source from post where content = '${text}'`, (err, result) => {
    if(err) throw err;
    const source = result[0].source;
    var options = {
      url: api_url,
      form: { 'source': `${source}`, 'target': `${target}`, 'text': `${text.toString()}` },
      headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const obj = JSON.parse(body)
        const translatedText = obj.message.result.translatedText
        return res.send(translatedText);
      } else {
        return res.json({ error: error })
      }
    });
  })
});

let port = 8888;
app.listen(port, () => {
  console.log('server on! http://localhost:' + port);
});
