const input = document.querySelector('input')
const button  = document.querySelector('button')

const loadscript = (src)=>{
    const script = document.createElement('script')
    script.src = src;
    src.onload = ()=>{
        console.log('script loaded')
    }
    document.body.appendChild(script)
}

const createrazorypayorder = async (amt)=>{
    data = {
        amount:amt*100,
        currency:'INR'
    }
    const resp = await fetch('http://localhost:5000/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    handlerazorpayscreen(await (resp.json()))
}

const handlerazorpayscreen = async (orderData)=>{
    const res = await loadscript('https://checkout.razorpay.com/v1/checkout.js')

    const options = {
        key:'',      // add your api key
        "amount": orderData.amount, 
        "currency": "INR",
        "name": "IDeaNest",
        "description": "Test Transaction",
        "order_id": orderData.order_id, 
        "handler": function (response) {
            alert('Payment Successful');
            alert('Razorpay Payment ID: ' + response.razorpay_payment_id);
            alert('Razorpay Order ID: ' + response.razorpay_order_id);
            alert('Razorpay Signature: ' + response.razorpay_signature);

        },
        "prefill": {
            "name": "Naman",
            "email": "namangupta@example.com",
            "contact": "123456789"
        },
        "notes": {
            "address": "Me"
        },
        "theme": {
            "color": "#F37254"
        }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open();

}

button.onclick = ()=>{
    if(input.value != '')
    {
        createrazorypayorder(Number(input.value));
    }
}