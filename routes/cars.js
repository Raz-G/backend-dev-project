const express = require("express");
const { CarsModel, validCar } = require("../models/carModel");
const {authToken} = require("../middleWares/auth");
const router = express.Router()




router.get("/" , async(req,res)=> {
    let perPage = req.query.perPage || 5;
    let page = req.query.page || 1;
    try{
      let data = await CarsModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({_id:-1})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
  
  router.get("/search",async(req,res) => {
    try{
  let queryS = req.query.s;
  let searchReg = new RegExp(queryS)
  let data = await CarsModel.find({name:searchReg})
      .limit(50)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
  router.get("/prices",async(req,res) => {
    try{
  let queryMin = req.query.min;
  let queryMax = req.query.max;
  let data = await CarsModel.find({price:{"$gt":queryMin ,"$lt":queryMax}})
      .limit(50)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })

  router.get("/category/:idcat",async(req,res) => {
    let cat = req.params.idcat
    let data = await CarsModel.find({category:cat})
    res.json(data);
})


  router.post("/",authToken,async(req,res) => {
    let validBody = validCar(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let car = new CarsModel(req.body);
      car.user_id = req.tokenData._id;
      await car.save();
      res.status(201).json(car);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there is an error try again later",err})
    }
  })
  
  
  router.put("/:editId",authToken, async(req,res) => {
    let validBody = validCar(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let editId = req.params.editId;
      let data = await CarsModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
  
  router.delete("/:delId",authToken, async(req,res) => {
    try{
      let delId = req.params.delId;
      let data;
      if(req.tokenData.role == "admin"){
        data = await CarsModel.deleteOne({_id:delId})
      }
      else{
        data = await CarsModel.deleteOne({_id:delId,user_id:req.tokenData._id})
      }
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
  
  module.exports = router;