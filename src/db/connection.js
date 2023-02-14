const mongoose = require('mongoose');
// const validator = require('validator');
mongoose.connect("mongodb://localhost:27017/userLogin-data", { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connection sucessful...."))
    .catch((err) => console.log(err));

    // /src/db
// **/src/db
// **db
// src/db
// **/db