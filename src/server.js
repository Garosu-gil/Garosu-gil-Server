const express = require('express');
const app = express();
const { conn } = require('./config/config');
const uuid = require('uuid-sequential');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static('public'));

function makeId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

conn.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log('mysql connecting...');
  }
});

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
      `insert into cafe(id, title, explanation, categoryId) values('${uuid()}', '${title}', '${explanation}', '${categoryId}')`,
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
  const author = '익명의 ' + makeId(5);
  const cafeName = req.query.name;
  conn.query(`select id from cafe where title = '${cafeName}'`, (err, result) => {
    if (err) throw err;
    const cafeId = result[0].id;
    conn.query(
      `insert into post(id, content, author, cafeId) values('${uuid()}', '${context}', '${author}', '${cafeId}')`,
      (err, results) => {
        if (err) throw err;
        res.json({
          author: author,
          content: context,
          massage: 'insert 완료',
        });
      },
    );
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

let port = 8888;
app.listen(port, () => {
  console.log('server on! http://localhost:' + port);
});
