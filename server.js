
var express = require('express');
var app = express();
const cv = require('opencv4nodejs');
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var sessionStorage = require('sessionstorage');
const nodeWebCam = require('node-webcam');

var fileUpload = require('express-fileupload');
app.use(fileUpload());

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserData = require('./model/userData');

const userRoutes = require("./routes/routes.user");
app.use('/user', userRoutes);


dbConfig = require('./config/db');


// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
        console.log('Database successfully connected')
    },
    error => {
        console.log('Database could not connected: ' + error)
    }
)


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(function (req, res, next) {
 
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type"); 
    res.header("Access-Control-Allow-Credentials", true); 
    next(); 
}); 
 





app.get('/', function(req, res) {
    console.log("user requested index page");
    res.sendFile(__dirname + "/" + "/public/index.html");

})



//once the user requests a login
app.post('/login', function(req, res) {
    response = {
        email: req.body.email,
        password: req.body.password
    };
    console.log("user sent login information");
    console.log(response.email)
    console.log(response.password)

    // req.flash('userName', 'abc')
    // res.redirect('/signup');

    // test if input is valid, if so, next phase
    UserData.findOne({ email: response.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            sessionStorage.setItem('name', user.userName);

            //console.log('asxsa')
            var abc = user.userName
            console.log(abc)



            bcrypt.compare(response.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    res.sendFile(__dirname + "/public/index1.html");


                } else {

                    res.sendFile(__dirname + "/public/index.html");



                }


            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
            return

        });

});


errors = []
app.post('/signup', function(req, res, next) {
    // res.sendFile(__dirname + "/public/signup.html");
    sessionStorage.setItem('Uname', req.body.userName);
    console.log(req.body.userName)



    UserData.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                console.log('Email exists')


            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) {

                            console.log(err)

                        } else {
                            const userData = new UserData({
                                userName: req.body.userName,
                                address: req.body.address,
                                dateOfBirth: req.body.dateOfBirth,
                                email: req.body.email,
                                password: hash

                            });


                            userData
                                .save()
                                .then(result => {


                                    console.log(result);
                                    console.log("User Created");


                                    res.sendFile(__dirname + "/public/uploadPhoto.html");


                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    })
                                    return

                                });

                        }

                    })

                })

            }
        });



});



//for stoirng image in database
app.post('/upload1', function(req, res, next) {
    var Name = sessionStorage.getItem('Uname');
    console.log(Name)
    console.log('asxas')


    console.log(sessionStorage.getItem('Uname'));
    

// specifying parameters for the pictures to be taken
var options = {
    width: 1280,
    height: 720, 
    quality: 100,
    delay: 1,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location"
};

// create instance using the above options
var webcam = nodeWebCam.create(options);

// capture function that snaps <amount> images and saves them with the given name in a folder of the same name
var captureShot = (amount, i, name) => {
    var path = `./images_db/subjects/${name}`;

    // create folder if and only if it does not exist
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
    } 

    // capture the image
    webcam.capture(`./images_db/subjects/${name}/${name}${i}.${options.output}`, (err, data) => {
        if(!err) {
            console.log('Image created')
        }
        console.log(err);
        i++;
        if(i <= amount) {
            captureShot(amount, i, name);
        }
    });  
};

// call the capture function
captureShot(30, 1, `${Name}`);


        res.sendFile(__dirname + "/public/index.html");

        console.log('User added Succesfully');

    

})

app.post('/upload2',async(req,res,next)=>{
    var Name = sessionStorage.getItem('name');

    console.log(sessionStorage.getItem('name'));

    

        // var response = {
        //     fileData: req.body.fileData
        // };
        // console.log(response.fileData);


        // console.log("user sent photo information");
        // // get the base64 encoding of the sent image
        // var data = response.fileData;
        // // remove misc information sent with it4
        // //        console.log(data);
        // var imgData = data.replace(/^data:image\/png;base64,/, "");
        //var imgData = (!  data) ? data.replace(/^data:image\/png;base64,/, "") : null;

        // // output for testing
        // console.log(`The image data is : ${imgData}`);
        



        

        var options = {
            width: 1280,
            height: 720, 
            quality: 100,
            delay: 1,
            saveShots: true,
            output: "jpeg",
            device: false,
            callbackReturn: "location"
        };
        
        // create instance using the above options
        var webcam = nodeWebCam.create(options);
        
        // capture function that snaps <amount> images and saves them with the given name in a folder of the same name
        var captureShot = (amount, i, name) => {
            var path = `./images_db/subjects/${name}`;
        
            // create folder if and only if it does not exist${name}
            if(!fs.existsSync(path)) {
                fs.mkdirSync(path);
            } 
        
            // capture the image
            webcam.capture(`./images_db/subjects/${name}/output.${options.output}`, (err, data) => {
                if(!err) {
                    console.log('Analyzing image')
                }
                console.log(err);
                i++;
                if(i <= amount) {
                    captureShot(amount, i, name);
                }
            });  
        };
        

        // // call the capture function
        captureShot(1, 1, `${Name}`);
        console.log('xasxa')

        res.sendFile(__dirname + "/public/index2.html");
        console.log('132456')

})
//For Uploading Images

var confValue = 0;
var imgLabel = "";
// if user uploads image for facial recognition
app.post('/upload', async(req, res, next) => {
    console.log('abc');
    var Name = sessionStorage.getItem('name');

    console.log(sessionStorage.getItem('name'));

    

        // var response = {
        //     fileData: req.body.fileData
        // };
        // console.log(response.fileData);


        // console.log("user sent photo information");
        // // get the base64 encoding of the sent image
        // var data = response.fileData;
        // // remove misc information sent with it4
        // //        console.log(data);
        // var imgData = data.replace(/^data:image\/png;base64,/, "");
        //var imgData = (!  data) ? data.replace(/^data:image\/png;base64,/, "") : null;

        // // output for testing
        // console.log(`The image data is : ${imgData}`);
        



        

        // var options = {
        //     width: 1280,
        //     height: 720, 
        //     quality: 100,
        //     delay: 1,
        //     saveShots: true,
        //     output: "jpeg",
        //     device: false,
        //     callbackReturn: "location"
        // };
        
        // // create instance using the above options
        // var webcam = nodeWebCam.create(options);
        
        // // capture function that snaps <amount> images and saves them with the given name in a folder of the same name
        // var captureShot = (amount, i, name) => {
        //     var path = `./images_db/subjects/${name}`;
        
        //     // create folder if and only if it does not exist${name}
        //     if(!fs.existsSync(path)) {
        //         fs.mkdirSync(path);
        //     } 
        
        //     // capture the image
        //     webcam.capture(`./images_db/subjects/${name}/output.${options.output}`, (err, data) => {
        //         if(!err) {
        //             console.log('Analyzing image')
        //         }
        //         console.log(err);
        //         i++;
        //         if(i <= amount) {
        //             captureShot(amount, i, name);
        //         }
        //     });  
        // };
        

        // // // call the capture function
        // captureShot(1, 1, `${Name}`);
        // console.log('xasxa')
        

        // save the encoded png to a file called output
        // require("fs").writeFile("images_db/subjects/nikesh/output.png", imgData, 'base64', function(err) {
        //     console.log(err);
        // });
    

        // wait for image to be processed, then apply facial recognition
        setTimeout(checkFace, 500);
        // if within threshold value and name matches username, then send the final page, else reset
        setTimeout(function() {
            if (confValue < 90.0 && imgLabel == `${Name}`) {
                console.log('Success')
                res.sendFile(__dirname + "/public/final.html");
                console.log('correct face')
            } else {
                console.log('Failed')
                res.sendFile(__dirname + "/public/index.html");
                console.log('wrong face')

            }
        }, 5000);

    

});


// facial recognition algo
async function checkFace() {
    var name1 = sessionStorage.getItem('name');
    console.log(name1)

    console.log('check face')
        // set the cascade classifier for the file
    const classifier = await new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    // detect the face within the grey image.
    const getFaceImage = (grayImage) => {
        const faceRegion = classifier.detectMultiScale(grayImage).objects;
        console.log(faceRegion);
        console.log(faceRegion.length)
        if (!faceRegion.length) {
            throw new Error('Failed to detect the face');
        }

        return grayImage.getRegion(faceRegion[0]);

    }
    console.log('process1')

    // get the path of the photo directory
    const basePath = '../project/images_db/subjects';
    const subjectsPath = path.resolve(basePath,`${name1}`);
    const nameMappings = [`${name1}`, 'unknown'];
    // get the absolute path5     
    const allFiles = fs.readdirSync(subjectsPath);

    console.log('process2')


    // to see if .DS_store is causing an error
    console.log(allFiles.map(file => path.resolve(subjectsPath, file)))
        //console.log(allFiles.map(filePath => cv.imread(filePath)))

        console.log('process')
        


    const images = allFiles
        .map(file => path.resolve(subjectsPath, file))
        .map(filePath => cv.imread(filePath))
        .map(image => image.bgrToGray())
        .map(getFaceImage)
        .map(faceImg => faceImg.resize(100, 100));



    console.log('process3')

    const isTargetImage = (_, i) => allFiles[i].includes('output');
    const isTrainingImage = (_, i) => !isTargetImage(_, i);
    // use images without the label for training the recognizer
    const trainImages = images.filter(isTrainingImage);
    // use images with the label for testing with the recognizer
    const testImages = images.filter(isTargetImage);
    // map all names of people to images of them, based on filename
    const labels = allFiles.filter(isTrainingImage)
        .map(file => nameMappings.findIndex(name => file.includes(name)));
    // use local binary patterns histograms algo
    const lbph = new cv.LBPHFaceRecognizer();
    // train the images
    lbph.train(trainImages, labels);
    // run the recognizer
    console.log('process4')
    const runPrediction = (recognizer) => {
        testImages.forEach((image) => {
            //console.log(img);
            const result = recognizer.predict(image);
            confValue = result.confidence;
            imgLabel = nameMappings[result.label]
            console.log('Predicted Individual: %s, Confidence Distance: %s', imgLabel, confValue);
        });
    };
    console.log('Answer is:')
    // output results
    console.log('lbph:');
    runPrediction(lbph);
}







var server = app.listen(8000, function() {
    // var host = server.address().address
    var port = server.address().port
    console.log("Server Running at port:%s", port)
});
