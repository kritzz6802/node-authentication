const jwt = require('jsonwebtoken');
const Register = require('../models/registers');

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verfyuser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verfyuser);

        const user = await Register.findOne({_id:verfyuser._id});
        req.token=token;
        req.user=user;
        const displaydata = {
            name:user.name,
            img:user.img,
            email:user.email,
            phone:user.phone
        }
        // console.log(displaydata)
        res.render("secreat",displaydata)
        next();

        // res.send(user.name);
        // console.log(user.img);
        // console.log(user.email);
        // console.log(user.phone);

    } catch (error) {
       res.status(401).send(error);
    }
}

module.exports = auth;