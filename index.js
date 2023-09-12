const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3500;

const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://postgres:2zuy5TyWsONptHqxqNco@containers-us-west-79.railway.app:6130/railway',
    host: 'containers-us-west-79.railway.app',
    user: 'postgres',
    port: 6130,
    password: '2zuy5TyWsONptHqxqNco'
})

client.connect((err) => {
    if (err) throw err;
      console.log("Connected.")
    })


app.use(cors());
app.use(express.static('./build'));
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(session({
    secret: 'ashlie-Kim',
    resave: false,
    saveUninitialized: true
}))


let logChecker = {};
let userName = {};

/* Logout Functionality */
app.post('/logout', (req, res) => {
    req.session.login = false;
    logChecker[req.session.username] = req.session.login;
    res.json({logout: true});
})

function requireLogin(req, res, next) {
    
    if (!logChecker[req.session.username]) {
        res.redirect('/login');
        return;
    }
    next();
  }

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'login_page.html'));

})

app.get('/', requireLogin, (req, res) => {
    
        res.sendFile(path.join(__dirname, 'build', 'home.html'));
})

app.get('/home',  requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'home.html'));
})


app.get('/imgs/login_background', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'static', 'media', 'login-background.jpeg'));
});

app.get('/loading', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'loading.html'));
})

app.post('/register', (req, res) => {

   client.query('SELECT * FROM customers', (err, result) => {

    let checker = true;
    const userInfo = {email: false, username: false};
    result.rows.forEach(data => {
        if (data.email == req.body.email || 
            data.username == req.body.username) {

                if (data.email == req.body.email) userInfo.email = true;
                if (data.username == req.body.username) userInfo.username = true;

                checker = false;
                return;
            }
    })
    
    if (!checker) {
        res.json({
            added: false,
            userInfo: userInfo
        });
        return;
    }

        client.query(
            'INSERT INTO customers(username, email, password) VALUES($1, $2, $3)', 
            [req.body.username, req.body.email, req.body.password]
            , (err) => {
                if (err) throw err;
                res.json({
                    added: true
                })
                
   })
})
})


app.post('/login', (req, res) => {
    client.query(
        'SELECT * FROM customers WHERE username = $1 AND password = $2',
        [req.body.username, req.body.password],
        (err, result) => {
            if (err) throw err;
            
            if (result.rows.length != 0) {

                /* Generated id for every user */
                const uniqueUserId = uuidv4();
                
                /* user Products Database */
                client.query('SELECT * FROM products WHERE username = $1', [req.body.username], (err, data) => {
                    if (err) throw err;
                    
                    if (data.rows.length != 0) {
                        
                        res.json({login: true, 
                                   userInfo: data.rows[0], 
                                   username: result.rows[result.rows.length - 1].username, 
                                   uniqueId: uniqueUserId,
                                });
                        return;
                    }
                    
                    res.json({login: true, uniqueId: uniqueUserId, username: result.rows[result.rows.length - 1].username});
                });
                
                req.session.login = true;
                req.session.username = result.rows[0].username;
                logChecker[req.session.username] = req.session.login;
                userName[uniqueUserId] = req.session.username;
            } else {
                req.session.login = false;
                res.json({login: false});
            }

        })
})

/* adding products to database */
app.post('/add-product', (req, res) => {
    const { productName, quantity, price, numItem, uniqueId } = req.body;

    client.query(
        `INSERT INTO products (username, product_name, quantity, price, num_item) VAlUES($1, $2, $3, $4, $5)`,  
        [userName[uniqueId], productName, quantity, price, numItem], 
        err => {
            if (err) throw err;
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            /* Getting an if from database */
            client.query('SELECT * FROM products WHERE username = $1 AND product_name = $2', [req.session.username, productName], 
            (err, data) => {
                if (err) throw err;
                res.json({mess: 'added', productID: data.rows[data.rows.length - 1].id});
               
            })
        })

})

/* Deleting a product in the database */
app.post('/delete-item', (req, res) => {
  client.query(
    'DELETE FROM products WHERE username = $1 AND id = $2', 
    [req.session.username, req.body.productID],(err) => {
        if (err) throw err;
       
        res.json({mess: 'Product Deleted'});
    });
})


/* Checking if the user has a product or not */
app.post('/check-item', (req, res) => {
    client.query('SELECT * FROM products WHERE id = $1', [req.body.id], 
      (err, result) => {
      if (err) throw err; 

        if (result.rows.length > 0) {
            res.json({hasProduct: true})
            return;
        }

        res.json({hasProduct: false})

    })

})


/* Checkout Functionality */
app.get('/checkout-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'checkout.html'));
})

app.post('/item-checkout', (req, res) => {
    
  client.query(
    `SELECT * FROM products WHERE username = $1 AND id = $2`, 
    [req.body.username, req.body.productID], 
    (err, result) => {
        if (err) throw err;
       
        if (result.rows.length > 0) {
            res.json({stats: true, price: result.rows[0].price});
            return;
        }

        res.json({stats: false});

    })

})


app.get('/small-img', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'static', 'media', 'small-img'))

})

app.get('/page-not-found', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'static', 'media', 'jisunpark_404-error.gif'));
   
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'page-not-found.html'));

})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
