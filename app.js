require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FIRSTNAME: firstName,
                    LASTNAME: lastName
                }
            }
        ]
    };
    var jsonDATA = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/3aca61d95f";;
    const options = {
        method: "POST",
        auth: process.env.MAIL_CHIMP_API_KEY,
        
    }



    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonDATA);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is Running on port 3000");
});



