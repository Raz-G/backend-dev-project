const express = require("express");
const bcrypt = require("bcrypt")
const { validUser, UsersModel, validLogin, createToken } = require("../models/userModel");
const { authToken ,authAdmin } = require("../middleWares/auth");
const router = express.Router()



router.get("/",(req,res)  => { 
    res.json({msg:"Users work please Sign Up"})
})

router.get("/usersList" , authAdmin, async(req,res) => {
    try{
      let data = await UsersModel.find({},{password:0});
      res.json(data)
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  })

router.get("/userInfo", authToken, async(req,res)  => { 
let user = await UsersModel.findOne({_id:req.tokenData._id},{pass:0})
res.json(user)
})



router.post("/",async(req,res) => {
    let validBody = validUser(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details)
    }
    try{
        let user = new UsersModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save()
        user.password = "******";
        res.json(user);
        }
        catch(err){
            if(err.code == 11000){
                return res.status(500).json({msg:"Email already in system, try log in",code:11000})
            }
         console.log(err);
         res.status(400).json({err:"Email already in system or there is another problem"})
    }
})


router.post("/login", async(req,res) => {
    let validBody = validLogin(req.body);
    if(validBody.error){

      return res.status(400).json(validBody.error.details);
    }
    try{
      let user = await UsersModel.findOne({email:req.body.email})
      if(!user){
        return res.status(401).json({msg:"Password or email is worng ,code:1"})
      }
      let authPassword = await bcrypt.compare(req.body.password,user.password);
      if(!authPassword){
        return res.status(401).json({msg:"Password or email is worng ,code:2"});
      }
     
      let token = createToken(user._id, user.role);
      res.json({token});
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })


module.exports = router ;