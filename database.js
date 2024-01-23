const mysql = require('mysql2/promise'); //this allows for async/await

let connection;

(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ecom'
  });
})(); // syntax allows for you to call the anon function immediatly by nesting it inside the async function and also allows for you to use async when it wont work

