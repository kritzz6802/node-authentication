const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(values) {
            if (!validator.isEmail(values)) {
                throw new Error("email not coorect")
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        validate(val) {
            if (val.toString().length < 10 || val.toString.length > 10) {
                throw new Error("Mobile no. is incorrect")
            }
        }
    },
    gender: {
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// generating tokens
usersSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        // console.log(token);
        await this.save();
        return token;
    } catch (e) {
        res.send("the err is: " + e)
        console.log(e)
    }
}

//converting pw into hash
usersSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // const passwordHash= await bcrypt.hash(password,10);
        // console.log(`current pw is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`current pw is ${this.password}`);
        this.cpassword = await bcrypt.hash(this.password, 10);
    }
    next()
})

// create collection

const Register = new mongoose.model('Register', usersSchema);
module.exports = Register;