const router=require('express').Router();

//importing other things from other folders///
const {perma,temp_order,order,temp,price}=require('../database/db');
const {charge_detail}=require('../payment/Stripe')
//ended///

//route to get unpaid orders///
router.get('/get_pending_orders',(req,res)=>{
    temp_order.find().then(user=>{
        user.reverse();
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route to get unpaid orders ended///

//route to get all users//
router.get('/get_users',(req,res)=>{
    perma.find({}).then(user=>{
        user.reverse()
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route ended///

//route to unverified users///
router.get('/get_pending_users',(req,res)=>{
    temp.find({}).then(user=>{
        user.reverse();
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route ended///

//route to get placed Order list//
router.get('/get_orders',(req,res)=>{
    order.find({}).then(user=>{
        console.log(user);
        user.reverse();
        console.log(user);
        res.status(200).json(user);
    }).catch(err=>{
        res.status(400).json(err);
    })
})
//route ended///

//route to get all charges//
router.get('/get_chargeId',(req,res)=>{
    price.find({}).then(user=>{
        res.status(200).json(user);
    }).catch(err=>{
        console.log(err)
    })
})
//route ended///

//route to get details about charge//
router.post('/get_charge_detail',(req,res)=>{
    var object=1;
    object=charge_detail(req.body.Charge_id);
    console.log(object)
    if(object)
        res.status(200).json(object);
    else
        res.status(400).json({msg:"error fetching details",response:"1"});
})
//route ended///

//route to check if user exist with this email address//
router.get('/search_email/:email',(req,res)=>{
    perma.findOne({Email:req.params.email}).then(user=>{
        if(user)
            res.status(400).json({msg:"yes"});
        else
            res.status(200).json({msg:"cant find"});
    }).catch(err=>{
        res.status(200).json({msg:"cant find"})
    })
})
//route ended

module.exports={
    service_route:router
}