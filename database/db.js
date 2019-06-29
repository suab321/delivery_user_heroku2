
//modules imports
const mongoose=require('mongoose');



const mongourl="mongodb://suab:Suab123@cluster0-shard-00-00-ynffd.mongodb.net:27017,cluster0-shard-00-01-ynffd.mongodb.net:27017,cluster0-shard-00-02-ynffd.mongodb.net:27017/delivery_user?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(mongourl,{useNewUrlParser:true},(err,db)=>{
    if(err)
        console.log("db.js 11"+err);
    else
       console.log("database connected");
})

const Price_Schema=new mongoose.Schema({
    Charge_id:String
})

const Order_schema=new mongoose.Schema({
    User_id:{type:String,required:true},
    Driver_Name:String,
    Driver_Phone:String,
    Driver_Email:String,
    Driver_id:String,
    Commodity:String,
    Receving_Address:String,
    Delivery_Address:String,
    Giver_Name:String,
    Giver_Phone:String,
    Giver_Email:String,
    Recevier_Phone:String,
    Recevier_Name:String,
    Recevier_Email:String,
    Price:String,
    Earning:String,
    CurrentStatus:{type:Number,default:0},
    Weight:String,
    Length:String,
    Width:String,
    Height:String,
    Date:String,
    Charge_id:String,
    Giver_Otp:String,
    Recevier_Otp:String,
    Pickup_Date:String,
    Landmark:String,
    Order_Stamp:String,
    Delivery_Date_User:String,
    G_Latitude:String,
    G_Longitude:String,
    R_Latitude:String,
    R_Longitude:String
})

const temp_Order_schema=new mongoose.Schema({
    User_id:{type:String,required:true},
    Driver_id:String,
    Commodity:String,
    Receving_Address:String,
    Delivery_Address:String,
    Giver_Name:String,
    Giver_Phone:String,
    Giver_Email:String,
    Recevier_Phone:String,
    Recevier_Name:String,
    Recevier_Email:String,
    Price:String,
    CurrentStatus:{type:Number,default:-1},
    Weight:String,
    Length:String,
    Width:String,
    Height:String,
    Date:String,
    Pickup_Date:String,
    Landmark:String,
    Order_Stamp:String,
    Delivery_Date_User:String,
    G_Latitude:String,
    G_Longitude:String,
    R_Latitude:String,
    R_Longitude:String
})



const temp_schema=new mongoose.Schema({
    device_id:String,
    Name:String,
    Password:String,
    MobileNo:{type:String},
    Email:{type:String,unique:true},
    IMEI:{type:String},
    Flag:{type:Number,default:0},
    Date:{type:Date},
    response:{type:String},
})
const perma_schema=new mongoose.Schema({
    device_id:String,
    Name:String,
    Password:String,
    MobileNo:{type:String},
    Email:{type:String,unique:true},
    IMEI:{type:String},
    Flag:{type:Number,default:0},
    Date:{type:Date},
    response:{type:String},
    My_Address:[{Place_Type:String,Value:[{value:String}]}],
    Delivery_Address:[{Value:String}],
    History:[{Order_id:String,CurrentStatus:{type:Number,default:0}}],
})

const temp_model=mongoose.model('temp',temp_schema);
const perma_model=mongoose.model('perma',perma_schema);
const order_model=mongoose.model('orders',Order_schema);
const price_model=mongoose.model('price',Price_Schema);
const temp_order=mongoose.model('temp-order',temp_Order_schema);


module.exports={
    temp:temp_model,
    perma:perma_model,
    order:order_model,
    temp_order:temp_order,
    price:price_model,
    mongourl
}
