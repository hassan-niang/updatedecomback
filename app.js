const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise') // this allows for async/await to be used

const app = express();

app.use(cors());

app.use(express.json());


let connection;

(async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'ecom'
    });
})(); // syntax allows for you to call the anon function immediatly by nesting it inside the async function and also allows for you to use async when it wont work

// sends products from DB
app.get('/', async function (req, res) {
    //query to return everything from DB (bad practice to use * in larger scale projects)
    const results = await connection.query(`
      SELECT id, product_type, product_name, product_img, product_price, product_description FROM product;`
    );
    res.json(results[0].map(item => ({
        id: item.id,
        product_type: item.product_type,
        product_name: item.product_name,
        product_img: item.product_img,
        product_price: item.product_price,
        product_description: item.product_description
    })));
});

// creates a new user
app.post('/signup', async (req, res) => {

    const { firstName, lastName, phoneNumber, email, password } = req.body
    await connection.query(`
      INSERT INTO customers (first_name, last_name, phone_number, email, password)
      VALUES (?, ?, ?, ?, ?);`,
        [firstName, lastName, phoneNumber, email, password], // this sets the values that we pass to be in sync.
        (err, results) => {
            if (err) {
                return console.log(err);
            }
            return console.log(results);
        }
    )
})

app.post('/login', async (req, res) => {
    console.log('here login');
    // res.json({hello: "world"});
    const email = req.body.email
    const password = req.body.password
    console.log('hello');
     await connection.query(
        `SELECT * FROM customers WHERE email = ? AND password = ?`,
        [email, password], // this sets the values that we pass to be in sync.
        (err, results) => {
            if (err) {
                console.log('err');
                console.log(err);
                res.send({ err: err });
            }
            // no errs caught now checks to see if email/pw match
            if (results) {
                console.log('results');
                console.log(results);
                res.json(results)
            } else {
                console.log('else results');
                res.send({ message: "Please check your <b> E-mail </b> and <b> Password </b>!" })
            }
        }
    );
    console.log('end login');
})

app.listen(4000, () => console.log('Listening on port 4000'));