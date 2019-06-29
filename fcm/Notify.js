var FCM=require('fcm-push');
var serverkey="AIzaSyCgJqVv7yZ97gcOoADX8uaCTFEeuiqbK2Y";
var fcm = new FCM(serverkey);

const axios=require('axios');

const {driver_backend}=require('../urls/links')

function notify(order){

    axios.get(`${driver_backend}/authentication/get_driver`).then(res=>{
        if(res.status === 200){
            console.log(res.data)
            var users=res.data;
            users.map(i=>{
                var message={
                    to:i.device_id,
                    notification:{
                        title:"Stowaway",
                        body:`Customer name is ${order.Giver_Name} Pickup-Address is ${order.Receving_Address} Delivery-Address is ${order.Delivery_Address} Pick-up Date is${order.Pickup_Date}`
                    }
                }
                fcm.send(message,(err,response)=>{
                    if(err)
                        console.log(err);
                    else
                        console.log(response);
                })
            })
        }
    }).catch(err=>{console.log(err)});
}

module.exports={
    notify
}