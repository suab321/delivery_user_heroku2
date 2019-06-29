//importing npm modules
const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const session=require('express-session');
const mongoose=require('mongoose');
const MongoStore=require('connect-mongo')(session);
const {mongourl}=require('./database/db');
const cookieparser=require('cookie-parser');
const cors=require('cors');
const axios=require('axios');

//importing from developer made folder
const {auth_route}=require('./authentication/authenticate');
const {order_route}=require('./placing_order/order');
const {socket_route}=require('./sockets/socket_fucn');
const sckt=require('./sockets/socket_fucn');
const {payment_route}=require('./payment/Stripe');
const secretKey="sk_test_Wae1JVypvlaoK5pLIFPsrexC0060Ik7P4F";
const publicKey="pk_test_mNSmGjYqswUKp1NnrGGuNk8f004q3h4DWh";
const {price,perma}=require('./database/db');
const {decodeToken}=require('./jwt/jwt');
const {service_route}=require('./services/Services');


//mongoose connection
mongoose.connect(mongourl,{useNewUrlParser:true},(err,db)=>{
    if(err)
        console.log("server.js 15"+err);
})
//middlewares
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(session({
    key:"user_sid",
    secret:"suab",
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({
        mongooseConnection:mongoose.connection
    }),
    cookie:{maxAge:null}
}))
app.use(cookieparser());

//importing router for assigning routes//
app.use('/authentication',auth_route);
app.use('/order',order_route);
app.use('/payment',payment_route);
app.use('/socket',socket_route);
app.use('/services',service_route);
//ended//

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/test.html');
})

const verify=(req,res,next)=>{
    const token=req.headers['authorization'];
    if(token !== undefined){
        req.token=token.split(' ')[1];
        next();
    }
    else
        res.status(401).json({response:'0'})
}

//route that renders payment successful page//
app.get('/successful_payment',(req,res)=>{
    res.sendFile(__dirname+'/public/success.html');
})
//route ended//

//route that renders payment was unsuccessful//
app.get('/unsuccessful_payment',(req,res)=>{
    res.sendFile(__dirname+'/public/unsuccess.html');
})
//route ended//

app.get('/pay_for_service1',verify,(req,res)=>{
    const user_id=decodeToken(req.token).user;
    perma.findById({_id:user_id}).then(user=>{
        console.log(req.query);
            price.find({}).then(user=>{
                res.render('payment',{order_id:req.query.order_id,weight:req.query.weight,charge:25,stripePublicKey:publicKey,height:req.query.height,length:req.query.length,width:req.query.width})
            }).catch(err=>{
                console.log(err)
            })
    }).catch(err=>{
        res.status(400).json({response:"Not Allowed to use this route",response:"2"});
    })
})

//route for payment
app.get('/pay_for_service2',(req,res)=>{
    res.render('payment',{order_id:req.query.order_id,weight:req.query.weight,charge:25,stripePublicKey:publicKey,height:req.query.height,length:req.query.length,width:req.query.width})

})
//route payment

const port_connection=app.listen(process.env.PORT || 3002);
sckt.connection(port_connection);



