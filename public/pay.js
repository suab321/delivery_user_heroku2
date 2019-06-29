


var stripeHandler=StripeCheckout.configure({
    key:stripekey,
    locale:"en",
    token:function(token){
        fetch('/payment/pay',{
            method:'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body:JSON.stringify({
                stripeTokenId:token.id,
                order_id:order_id,
                amount:amount
            })
        }).then(res=>{
            console.log(res.status)
        if(res.status === 200)
            window.location.replace('/successful_payment');
        else
            window.location.replace('/unsuccessful_payment')
        }).catch(err=>{
            window.location.replace('/unsuccessful_payment')
        })
    }

})


console.log("yes");
console.log(amount);
stripeHandler.open({
    amount
})
