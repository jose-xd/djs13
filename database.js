const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err));