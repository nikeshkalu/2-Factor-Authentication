var express = require('express');
var app = express();

//app.use(express.static('./'));

app.get('/', function(req, res) {
    console.log("user requested index page");
    res.sendFile(__dirname + "/" + "/public/index.html");
    // res.sendFile(absolutePath);
})

//once the user requests a login
app.get('/login', function(req, res) {
    // Prepare output in JSON format
    // Place username and password
    response = {
        username: req.query.username,
        password: req.query.password
    };
    console.log("user sent login information");

    console.log(response);
    // test if input is valid, if so, next phase
    if (response.username == "nikesh" && response.password == "kalu") {
        res.sendFile(__dirname + "/public/index1.html");
    }
    // else send the original webpage back to the user
    else {
        res.sendFile(__dirname + "/public/index.html")
    }
});

app.get('/signup', function(req, res) {

    res.sendFile(__dirname + "/public/signup.html");

    console.log("Sign Up page");




})

var server = app.listen(8000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Server Running at http://%s:%s", host, port)
});

// app.listen(8000, () => {
//     console.log("Server Running:8000")
// })