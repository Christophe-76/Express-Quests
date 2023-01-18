require("dotenv").config();
const mysql = require("mysql2/promise");



const database = mysql.createPool({
  host: process.env.DB_HOST, // address of the server
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD, // port of the DB server (mysql), not to be confused with the APP_PORT !
  user: process.env.DB_USER,

  database: process.env.DB_NAME,
});

database
  .query("select * from movies")
  .then(([movies]) => {
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
  });


  module.exports=database;