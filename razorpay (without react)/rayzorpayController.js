const Rayzorpay = require('razorpay')


let createAndSendOrder = async (amount,currency)=>{
   const rayzorpay  = new Rayzorpay({
    key_id:'',   // add your api key and secret
    key_secret:'',
   })
   const options = {
      amount,
      currency,
      receipt:"receipt#1",
      payment_capture:1
   }
   try{
     
    const response = await rayzorpay.orders.create(options)
    console.log('order created')
     return {order_id:response.id,currency:response.currency,amount:response.amount}
   }
   catch(err)
   {
      console.log(err)
      return {error:err}
   }
}

let getPaymentByPaymentId  = async(paymentId)=>{
    const rayzorpay  = new Rayzorpay({
        key_id:'rzp_test_AF2z19SWEVWF4Q',
        key_secret:'TguqXQT8XBrMxGxIctbsoGm4',
       })
       try{
         const payment = await rayzorpay.payments.fetch(paymentId);
         if(!payment){
            throw new Error('an unexpected error occured')
         }
         return {
            status:payment.status,
            method:payment.method,
            amount:payment.amount
         }
       }
       catch(err)
       {
         return {error:err}
       }
}

module.exports = {
    getPaymentByPaymentId,
    createAndSendOrder
}