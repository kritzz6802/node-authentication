require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path')
const port = process.env.PORT || 4000;
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')
const authdlt = require('./middleware/authdlt')
const cookieParser = require("cookie-parser");

require('./db/connection');
const Register = require('./models/registers')
const static_path = path.join(path.join(__dirname, "../public"))
const templetes_path = path.join(path.join(__dirname, "../templates/views"))
const partialas_path = path.join(path.join(__dirname, "../templates/partials"))

app.use(express.static(static_path));
app.use(cookieParser());
app.set("view engine", "hbs")
app.set("views", templetes_path);
hbs.registerPartials(partialas_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index")
});
app.get("/secreat", auth, (req, res) => {
    // console.log(`this is the cookie awesome ${req.cookies.jwt}`)
    // res.render("secreat")
});
app.get("/logout", authdlt, async (req, res) => {
    try {
        // console.log(req.user)

        //one token delete ---> one login is logout
        // req.user.tokens=req.user.tokens.filter((currentEle)=>{
        //     return currentEle.token !== req.token
        // })

        //All tokens delete ---> all login is logout
        req.user.tokens = [];
        res.clearCookie("jwt")
        await req.user.save();
        console.log("logout successfully");
        res.render("login")
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get("/register", (req, res) => {
    res.render("register")
});
app.post("/register", async (req, res) => {
    try {
        // console.log(req.body.name)
        // res.send(req.body.name)
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password == cpassword) {
            const registeruser = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password: req.body.password,
                cpassword: req.body.cpassword,
                img: req.body.img
            })
            // console.log("the success part : " + registeruser)
            const token = await registeruser.generateAuthToken();
            // console.log("the token part is : " + token)

            // The res.cookie() function is used to set the cookie name to value.
            // The value parameter may be a string or object converted to JSON.

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 20000),
                httpOnly: true
            });
            // console.log(cookie);

            const userData = await registeruser.save();
            // console.log("the token part is : " + userData)
            res.status(201).render("index");
        } else {
            res.send("Passwords are incorrect")
        }
    } catch (e) {
        res.status(400).send(e)
    }
});
app.get("/login", (req, res) => {
    res.render("login")
});
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.password)
        const token = await useremail.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.status(400).send("invalid Email or password");
        }

        // res.send(useremail.password);
        // console.log(useremail)
        // console.log(`${email} and pw is ${password}`);
    } catch (e) {
        res.status(400).send("invalid Email or password");
    }
});
const createtoken = async () => {
    const token = await jwt.sign({ _id: "6389e2a71fe61d624bc03166" }, "iamkirtipatelatcreatpixinfotech");
    // console.log(token);
    const userver = await jwt.verify(token, "iamkirtipatelatcreatpixinfotech");
    // console.log(userver)
}
createtoken();
// const bcrypt = require('bcrypt');
// const securePassword = async(password)=>{

// const passwordHash = await bcrypt.hash(password,10);
// console.log(passwordHash);

// const passwordmatch = await bcrypt.compare(password,passwordHash);
// console.log(passwordmatch);

// }

// securePassword("kkk!23");

app.listen(port, () => {
    console.log(`server running at ${port}`);
})