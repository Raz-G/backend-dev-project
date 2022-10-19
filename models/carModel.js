const mongoose = require("mongoose");
const Joi = require("joi");


const CarsScema = new mongoose.Schema({
name: String ,
info: String ,
category: String ,
img_url:String , 
price: Number, 
user_id:String,
date_created:{
  type:Date, default:Date.now()
},
})


const CarsModel = mongoose.model("cars",CarsScema);
exports.CarsModel = CarsModel;

exports.validCar = (_reqBody) => {
    let joiSchama = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        info:Joi.string().min(5).max(150).required(),
        category:Joi.string().min(2).max(50).required(),
        img_url:Joi.string().min(2).max(999).required(),
        price:Joi.number().min(1).max(99999999).required(),
    })
    return joiSchama.validate(_reqBody)
}