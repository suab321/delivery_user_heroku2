const router=require('express').Router();

const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";

const stripe=require('stripe')(secretKey);
const axios=require('axios')

const {save}=require("../placing_order/order");
const {emit_transaction_complete}=require('../sockets/socket_fucn');
const {decodeToken}=require('../jwt/jwt');
const {admin_link,driver_backend}=require('../urls/links');
const {order}=require('../database/db')



const verify=(req,res,next)=>{
  if(req.headers['authorization'] !== undefined){
    var token=req.headers['authorization'].split(' ')[1];
    req.token=token;
    next();
  }
  else
    res.status(400).json({response:"0"});
}

//route for paying//
router.post('/pay',(req,res)=>{
    console.log(req.body);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(user=>{
        console.log("payment was successful")
        save(req.body.order_id,user.id,req.body.amount);
        res.status(200).json({code:"1",msg:"payment was successful"})
      }).catch(err=>{
        console.log(err)
        console.log("error in payment")
        res.status(400).json({code:"0",msg:"Your transaction failed..Try again after sometime"});
        //console.log(err)
      })
})
//route for paying ended

//route for cancelling order for users//
router.post('/cancel_order',verify,(req,res)=>{
  var control;
  axios.get(`${admin_link}/authentication/get_controls/1`).then(user=>{
  control=user.data;
  const id=decodeToken(req.token).user;
  if(id){
          axios.get(`${driver_backend}/services/delete_order/${req.body.Order_id}`).then(user=>{
            order.findById({_id:req.body.Order_id}).then(user=>{
            if(user.CurrentStatus<2){
             order.findByIdAndUpdate({_id:req.body.Order_id},{CurrentStatus:4}).then(user=>{
              const resp1=user;
              stripe.refunds.create({
              charge:resp1.Charge_id,
              amount:resp1.Price*control/100
            }).then(refund=>{
              console.log(refund);
              res.status(200).json({res:"1",msg:"successfully cancelled orer"});
            }).catch(err=>{
              res.status(400).json({res:"2",msg:"error in refunding"});
              console.log(err);
            })
            
            }).catch(err=>{
              console.log(err)
              res.status(400).json({res:"3",msg:"Error updating on user side"});
            })
          }
          else{
            res.status(400).json("unable to complete order at this stage");
          }
          })
          }).catch(err=>{
              res.status(400).json({msg:"error updatin in driver side"});
          })
        }
        else{
          res.status(403).json({res:"5",msg:"You are not allowed to cancel order"});
        }
}).catch(err=>{console.log("error in stripejs line 69 "+err)});
})
//route for cancelling order ended for users ended//



//route for cancelling orders by admin//
router.post('/cancel_order',(req,res)=>{
  var control;
  axios.get(`${admin_link}/authentication/get_controls/1`).then(user=>{
  control=user.data;
          axios.get(`${driver_backend}/services/delete_order/${req.body.Order_id}`).then(user=>{
            if(resp1.CurrentStatus<2){
             order.findByIdAndUpdate({_id:req.body.Order_id},{CurrentStatus:4}).then(user=>{
              const resp1=user;
              stripe.refunds.create({
              charge:resp1.Charge_id,
              amount:resp1.Price*control/100
            }).then(refund=>{
              console.log(refund);
              res.status(200).json({res:"1",msg:"successfully cancelled orer"});
            }).catch(err=>{
              res.status(400).json({res:"2",msg:"error in refunding"});
              console.log(err);
            })
            }).catch(err=>{
              console.log(err)
              res.status(400).json({res:"3",msg:"Error updating on user side"});
            })
          }
          else{
            console.log(err);
            res.status(400).json({res:"4",msg:"Unable to cancel order at this stage"});
          } 
          }).catch(err=>{
              res.status(400).json({msg:"error updatin in driver side"});
          })
}).catch(err=>{console.log("error in stripejs line 69 "+err)});
})
//route for cancelling order by admin ended//


//function to get charge details//
router.post('/get_charge_detail',(req,res)=>{
  console.log(req.body.Charge_id);
  stripe.charges.retrieve(
    `${req.body.Charge_id}`,
    function(err,detail){
      if(err)
        res.status(400).json({msg:"error from stripe end",response:"1"});
      else  
        res.status(200).json(detail)
    }
  )
})
  

//function ended///

module.exports={
    payment_route:router,
}