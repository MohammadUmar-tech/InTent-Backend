import {intentModel} from '../models/intent.model.js'



export const createIntent=async (req,res)=>{

   try {
     const {activity,date,timeWindow,location}=req.body
 
     const intent=await intentModel.create({
         userId:req.user._id,
         activity,
         date,
         timeWindow,
         location
     })
     return res.status(200).json({intent,message:"Intent Registered Successfully"});
 
   } catch (error) {
    return res.status(500).json({error})
   }
}

export const getAllIntent=async (req,res)=>{

  try {
    const intents=await intentModel.findAll({userId:req.user._id});

    if(!intents) return res.status(400).json({message:'No intent found'});

    return res.status(200).json({intents});

    
  } catch (error) {
    return res.status(500).json({error})
  }
}

export const getsingleIntent=async (req,res)=>{
  try {
    const {id}=req.params.id
    const intent=await intentModel.findOne({id})
    if(!intent) return res.status(401).json({message:'id provided not exist'});

    return res.status(201).json({intent})


  } catch (error) {
   return res.status(500).json({error}); 
  }
}