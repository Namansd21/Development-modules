const express = require("express");
const app = express();
const fs = require('fs')
require('dotenv').config()
const Mail = require('./mail');
const path = require("path");
const crypto = require('crypto');
const otpStorage = require('./OTPstorage');
const cors = require("cors");


app.use(cors());


app.use(express.json());




let generateOTP = () => {
    return crypto.randomInt(100000, 999999);
}


app.post('/signup', (req, res) => {
    const { email, password, name } = req.body;
    // db.push({ email, password, name, isVerified: false });
    let id = generateAccessToken({ name, email });
    let mail = new Mail();
    mail.setReceiver(email);
    mail.setSubject("Email Verification");
    mail.setHTML(`<a href="http://localhost:${PORT}/verify/${id}">Click here to verify your email</a>`);
    mail.send()
        .then((result) => {
            // res.render('verifyEmailLoading');
            res.status(200).json({ success: true, message: "Confirm through email" });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
})

app.get('/verify/:id', (req, res, next) => {
    const { id } = req.params;
    let isVerified = verifyToken(id);
    if (isVerified?.status) {

        next();
    } else {
        res.redirect('/login');
    }
});


app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    // Corrected: Check if the email exists in the db, not just if it is included as a string.
    if (email) {
        let otp = generateOTP(); // Corrected: Function name typo corrected to generateOTP.
        otpStorage.set(email, otp);
        let forget_pass_template = fs.readFileSync(path.join(__dirname, 'forgotPassword.html'), 'utf-8'); // Corrected: Filename typo corrected to forgotPassword.html.
        forget_pass_template = forget_pass_template.replace('{{user_name}}', email);
        forget_pass_template = forget_pass_template.replace('{{OTP_CODE}}', otp);
        let mail = new Mail();
        mail.setReceiver(email);
        mail.setSubject("Password Reset");
        mail.setHTML(forget_pass_template);
        mail.send()
            .then((result) => {
                res.status(200).json({ success: true, message: "Verify OTP", email: email });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send("Internal Server Error");
            });
    } else {
        res.status(400).json({ message: "Invalid Email" });
    }
});



// app.get('/verify-otp', (req, res) => {
//     const email = req.query.email;
//     const error = req.query.error;

//     res.status(200).json({ success: true, message: "Verify OTP", email: email,error:error });
// });



app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log(email, otp);

    if (otpStorage.verify(email, otp)) {
        console.log('verified');
        // res.redirect('/'); // Adjust this to the appropriate page you want to render after successful verification
        res.status(200).json({ success: true, message: "OTP Verified" });
    } else {
        const error = 'Invalid OTP';
        // res.redirect(`/verify-otp?email=${email}&error=${encodeURIComponent(error)}`);
        res.status(400).json({ message: error });
    }
});


app.get('/sendmail', (req, res) => {
    res.send("Working with nodemailer")

    const mail = new Mail();
    mail.setTo(process.env.TOEMAIL);
    mail.setText("Hello from Shyama")
    mail.setSubject("Subject hai ye")
    mail.send()

});


//sending email with taking data from user(frontend)
app.post('/mail', async (req, res) => {
    // console.log(req.body);
    let { receiver_id, subject, text, username } = req.body;

    let htmlData = fs.readFileSync(path.join(__dirname, 'mail.html'), 'utf-8')
    // console.log(htmlData)
    htmlData = htmlData.replace('username', username)

    const mail = new Mail();
    mail.setTo(receiver_id);
    mail.setSubject(subject);
    mail.setText(text);
    mail.setHTML(htmlData);

    // mail.setCC(process.env.CC)
    // mail.setBCC(process.env.BCC)

    mail.send();
    res.send('Email sent!')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})