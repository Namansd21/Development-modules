const express = require('express')
const app = express();
const cors = require('cors')
const controller = require('./rayzorpayController')
const bodyParser = require('body-parser')
app.use(cors("*"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.post('/order',async (req,res)=>{
    console.log(req.body) 
    const {amount,currency} = req.body;
    const resp=await controller.createAndSendOrder(amount,currency);
    console.log(resp)
    res.send( resp);
})

app.listen(5000,()=>{
    console.log('server is running ...')
})