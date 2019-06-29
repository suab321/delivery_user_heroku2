//credentials for twili//
const accountSid="ACdc74124f6519512ccaa103de0ee15a6b";
const auth_token="1820cb75e39f757e8a38fcd5dbb15b04";


//importing node modules//
const router=require('express').Router();
const jwt=require('jsonwebtoken');
const axios=require('axios');
const client=require('twilio')(accountSid,auth_token);


//developer made modules import
const token=require('../jwt/jwt');
const {order,perma,temp_order,price}=require('../database/db');
const {emit_order}=require('../sockets/socket_fucn');
const {notify}=require('../fcm/Notify');
// const {refund}=require('../payment/Stripe');
const {driver_backend}=require('../urls/links')


router.use(function check(req,res,next){
   next();
})

router.get('/trial/:no',(req,res)=>{
    client.messages.create({
        to:`+91${req.params.no}`,
        from:'+919051571833',
        body:'this is trial message '
    },(err,message)=>{
        if(message)
            console.log(message);
        else
            console.log(err);
    }
    )
})

const verify=(req,res,next)=>{
    const token=req.headers['authorization']
    if(token !== undefined){
    req.token=token.split(' ')[1];
    next();
    }
    else{
        res.status(401).json({err:"1"});
    }
}

//route for temp order//
router.post('/temp_place_order',verify,(req,res)=>{
    console.log(req.token);
    const userId=token.decodeToken(req.token).user;
    console.log(userId);
     if(userId){
            const db=new temp_order
             db.User_id=userId;
             db.Commodity=req.body.Commodity;
             db.Receving_Address=req.body.Receving_Address;
             db.Delivery_Address=req.body.Delivery_Address;
             db.Giver_Name=req.body.Giver_Name;
             db.Giver_Email=req.body.Giver_Email;
             db.Giver_Phone=req.body.Giver_Phone;
             db.Recevier_Phone=req.body.Recevier_Phone;
             db.Recevier_Name=req.body.Recevier_Name;
             db.Recevier_Email=req.body.Recevier_Email;
             db.Price=req.body.Price;
             db.Weight=req.body.Weight;
             db.Height=req.body.Height;
             db.Width=req.body.Width;
             db.Length=req.body.Length;
             db.Landmark=req.body.Landmark;
             db.Pickup_Date=req.body.Pickup_Date;
             db.Delivery_Date_User=req.body.Delivery_Date_User;
             db.Date=new Date();
             db.G_Latitude=req.body.G_Latitude;
             db.G_Longitude=req.body.G_Longitude;
             db.R_Latitude=req.body.R_Latitude;
             db.R_Longitude=req.body.R_Longitude;
             db.Order_Stamp=Date.now();
             db.save().then(user=>{
                res.status(200).json({user,response:"1"});
             }).catch(err=>{
                 console.log({response:"0"});
             })
     }
     else
         res.status(401).json({err:"2"});
 })
////route ended for temp order//////

//saving from temp to perma///
function save(id,Charge_id,Price){
    const db=new price;
    db.Charge_id=Charge_id;
    db.save().then(user=>{
        console.log(user);
    }).catch(err=>{console.log(err)});
    temp_order.findByIdAndDelete({_id:id}).then(user=>{
        console.log(user);
            const db=new order
            db.User_id=user.User_id;
            db.Commodity=user.Commodity;
            db.Receving_Address=user.Receving_Address;
            db.Delivery_Address=user.Delivery_Address;
            db.Giver_Name=user.Giver_Name;
            db.Giver_Email=user.Giver_Email;
            db.Giver_Phone=user.Giver_Phone;
            db.Recevier_Phone=user.Recevier_Phone;
            db.Recevier_Name=user.Recevier_Name;
            db.Recevier_Email=user.Recevier_Email;
            db.Price=Price/100;
            db.Earning=Price*0.2*0.01;
            db.Weight=user.Weight;
            db.Date=user.Date;
            db.Length=user.Length;
            db.Width=user.Width;
            db.Height=user.Height;
            db.Landmark=user.Landmark;
            db.Pickup_Date=user.Pickup_Date;
            db.Delivery_Date_User=user.Delivery_Date_User;
            db.Charge_id=Charge_id;
            db.Order_Stamp=user.Order_Stamp;
            db.G_Latitude=user.G_Latitude;
            db.G_Longitude=user.G_Longitude;
            db.R_Latitude=user.R_Latitude;
            db.R_Longitude=user.R_Longitude;
            db.save().then(user=>{
                perma.findByIdAndUpdate({_id:user.id},{$addToSet:{'History':{"Order_id":user._id}}}).then(res1=>{
                    notify(user);
                    emit_order(user);
                    console.log(user);
                }).catch(err=>{
                    console.log("order.js 52 "+err);
                })
            }).catch(err=>{
                console.log("order.js 55 "+err);
            })
    }).catch(err=>{
        console.log(err);
    })
}
///function saving perma into ended//

//route for permanant order route
router.post('/place_order',verify,(req,res)=>{
   console.log(req.token);
   const userId=token.decodeToken(req.token).user;
   console.log(userId);
    if(userId){
           const db=new order
            db.User_id=userId;
            db.Commodity=req.body.Commodity;
            db.Receving_Address=req.body.Receving_Address;
            db.Delivery_Address=req.body.Delivery_Address;
            db.Giver_Name=req.body.Giver_Name;
            db.Giver_Email=req.body.Giver_Email;
            db.Giver_Phone=req.body.Giver_Phone;
            db.Recevier_Phone=req.body.Recevier_Phone;
            db.Recevier_Name=req.body.Recevier_Name;
            db.Recevier_Email=req.body.Recevier_Email;
            db.Price=req.body.Price;
            db.Weight=req.body.Weight;
            db.Date=new Date();
            db.Preferred_time=req.body.time;
            db.save().then(user=>{
                perma.findByIdAndUpdate({_id:userId},{$addToSet:{'History':{"Order_id":user._id}}}).then(res1=>{
                    notify(user);
                    sockets.emit_order(user);
                    console.log(user);
                }).catch(err=>{
                    console.log("order.js 52 "+err);
                })
            }).catch(err=>{
                console.log("order.js 55 "+err);
            })
    }
    else
        res.status(401).json({err:"2"});
})
//// route ended ////


module.exports={
    order_route:router,
    save,
}


