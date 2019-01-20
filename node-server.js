const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 8080;

/* Creating express instance and assigning to app */
const app = express();

/* Here we are setting port to express server on which server will listen*/
app.set('port', PORT);

/* We are parsing request object using bodyParser or express */
app.use(bodyParser.json());
app.use(express.json());


/* serving static file on server */
app.use(express.static(path.join(__dirname + '/dist')));


/* Middleware for express which can access of request, response and next
 * Using middleware we can check authentication and authorization
 * It will execute between request and response
  * */
app.use((req, res, next) => {

    /*Heare we are attaching header to response */
     res.setHeader('Content-Type', 'text/html');
     res.setHeader('status', 201);

     /* We can attach header on response using write also */
     res.write('status', 202);

    // call for authentication check
     next();
});

app.use('/', (req, res) => {

    /* This we are using for send the file whith response
    * we can send html, text or json files
    * */
    res.sendFile(path.join(__dirname + '/dist/index.html'));

    /* for sending any text over response*/
    res.send('Hello world !');
});


/* Creating Https server which will listen on port using listen*/
app.listen(app.get('port'), () => {
 console.log('Server is running on port ' + app.get('port'));
});