const jwt = require('jsonwebtoken');
const Register = require('../models/registers');

const authdlt = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verfyuser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verfyuser);

        const user = await Register.findOne({_id:verfyuser._id});

        req.token=token;
        req.user=user;

        next();
    } catch (error) {
       res.status(401).send(error);
    }
}

module.exports = authdlt;