import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Bid} from "../../models/Bid.js";

export const getSingleBid = (catchAsyncError(async(req,res,next) => {
    const {id} = req.params;

    const bid = await Bid.findById(id);
  
    if (!bid) {
      return res.status(404).json({message:"bid not found!"});
    }else {
      return res.status(200).json({bid});
    }  
}))

export const getAllBids = (catchAsyncError(async(req, res, next) => {

}))

export const createBid = (catchAsyncError(async(req, res, next) => {

}))

export const updateBid = (catchAsyncError(async(req, res, next) => {
    const {
        basePrice,
        quantity,
        status,
        descp,
      } = req.body;
    
      const bid = await Bid.findById(req.params.id);
      
      if(!bid){
        return res.status(404).json({message:"Bid not found!"});
      }
    
      if (basePrice) {
        bid.basePrice = basePrice;
      }
    
      if (quantity) {
        bid.quantity = quantity;
      }
    
      if (status) {
        bid.status = status;
      }

      if (descp) {
        bid.descp = descp;
      }
    
      await bid.save();
    
      res.status(200).json({bid});
}))

export const deleteBid = (catchAsyncError(async(req, res, next) => {
    await Bid.findByIdAndUpdate(req.params.id, {deleted:true});
    res.status(200).json({message: "Bid deleted successfully."})
}))