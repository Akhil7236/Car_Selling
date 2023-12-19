const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carselling',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    // Serve the HTML form
    fs.readFile('home.html', (err, data) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/login') {
    // Serve the HTML form
    fs.readFile('login.html', (err, data) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }else if (req.method === 'GET' && parsedUrl.pathname === '/contact') {
    // Serve the HTML form
    fs.readFile('index.html', (err, data) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  else if (req.method === 'POST' && parsedUrl.pathname === '/submit') {
    // Handle form submission
    let formData = '';

    req.on('data', (chunk) => {
      formData += chunk.toString();
    });

    req.on('end', () => {
      
      formData = JSON.parse(formData);
      console.log(formData)
      // Insert data into the table
      const query = 'INSERT INTO car_form SET ?';

      db.query(query, formData, (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          console.log('Data inserted successfully');
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Data inserted successfully');
        }
      });
    });
  }else if (req.method === 'GET' && parsedUrl.pathname === '/signup') {
    // Serve the HTML form
    fs.readFile('signup.html', (err, data) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if(req.method === 'POST' && parsedUrl.pathname === '/signup'){
    let formData = '';

    req.on('data', (chunk) => {
      formData += chunk.toString();
    });

    req.on('end', () => {
      
      formData = JSON.parse(formData);
      console.log(formData)
      // Insert data into the table
      const query = 'INSERT INTO signup SET ?';

      db.query(query, formData, (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          console.log('Data inserted successfully');
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Data inserted successfully');
        }
      });
    });          
  } else if (req.method === 'POST' && parsedUrl.pathname === '/login') {
    // Handle login form submission
    let formData = '';

    req.on('data', (chunk) => {
      formData += chunk.toString();
    });

    req.on('end', () => {
      formData = JSON.parse(formData);
       
      // Retrieve user from the database based on the username
      const query = 'SELECT * FROM signup WHERE email = ?';

      db.query(query, [formData.username], (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          if (results.length > 0) {
            const user = results[0];
            console.log(user);
            // Compare the provided password with the hashed password from the database
            bcrypt.compare(formData.password, user.password, (bcryptErr, bcryptResult) => {
              if (bcryptErr) {
                console.error('Error comparing passwords:', bcryptErr);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
              } else {
                if (bcryptResult) {
                  // Passwords match, user is authenticated
                  res.writeHead(200, { 'Content-Type': 'text/plain' });
                  res.end('Log-in successful');
                } else {
                  // Passwords do not match
                  res.writeHead(401, { 'Content-Type': 'text/plain' });
                  res.end('Incorrect password');
                }
              }
            });
          } else {
            // User not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('User not found');
          }
        }
      });
    });
  }
   else {
    // Handle other requests
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});