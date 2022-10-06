const dotenv = require('dotenv');
const mysql = require('mysql');
dotenv.config();
const config = {
  host: process.env.MYSQL_HOST,
  port: '3306',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWARD,
  database: 'garosu',
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typecast: true,
    timeZone: '+09:00',
  },
  timeZone: '+09:00',
};

const conn = mysql.createConnection(config);

conn.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log('mysql connecting...');
  }
});

module.exports = { conn };
