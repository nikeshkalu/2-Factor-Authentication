const express = require("express")
var app = express()
const router = express.Router();
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser')

const UserData = require('../model/userData');


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: "50mb" }));

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Post is running"
    })
});

router.post('/login', function(req, res) {
    // Prepare output in JSON format
    // Place username and password
    console.log("user sent login information");

    //const uName = req.body.email;
    // console.log(uName);
    var response = {
        username: req.body.email,
        password: req.body.password

    };
    console.log(response.username)
    console.log(response.password)

    // test if input is valid, if so, next phase
    //if (response.username == "nikesh@gmail.com" && response.password == "kalu")
    if (UserData.find({ email: response.username, password: response.password })) {
        res.sendFile(__dirname + "../public/index1.html");
        //res.send("Logged in");
    }
    // else send the original webpage back to the user
    else {
        res.sendFile(__dirname + "../public/index.html")
            //res.send("Not Logged in");

    }
});



router.get('/:userID', (req, res, next) => {
    const id = req.params.userID;
    res.status(200).json({
        message: id
    })

})
router.patch('/:userID', (req, res, next) => {
    //const id = req.params.userID;
    res.status(200).json({
        message: "updated"
    })

})


router.post('/signup', function(req, res) {

    res.sendFile(__dirname + "/public/signup.html");

    //UserData is model created in /model/userData.js
    UserData.find({
            email: req.body.inputEmail
        })
        .exec()
        .then(userData => {
            if (userData.length > 1) {
                return res.status(409).json({
                    message: "Mail exists"

                })
            } else {
                bcrypt.hash(req.body.inputPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const userData = new UserData({
                            userName: req.body.inputUserName,
                            address: req.body.inputUserAddress,
                            dateOfBirth: req.body.inputDateofBirth,
                            email: req.body.inputEmail,
                            password: hash

                        });

                        userData
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User Created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })

                            });


                    }
                })

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        });




    console.log(userData);
    console.log("Sign Up page");


});
router.delete('/:userID', (req, res, next) => {
    //const id = req.params.userID;
    UserData.remove({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })


})




module.exports = router;