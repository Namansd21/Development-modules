const express = require('express');
const app = express(); 
const userRoutes = require('./router/userRoutes');
const songRoutes = require('./router/songRoutes')
const cors = require('cors')

const mongoose = require('mongoose');

const DBconn = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/JWT');
        console.log("DB connected successfuly.")
    }
    catch (e) {
        console.log(e)
    }
}
DBconn(); 

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Learn JWT")
})


app.use(userRoutes);
app.use(songRoutes);
app.listen(8080, () => {
    console.log("Server connected at port 8080");
})