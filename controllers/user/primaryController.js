import {User} from "../../models/User.js"
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";

export const getUser = catchAsyncError(async(req,res,next) => {
    const {id} = req.params;
  
    const user = await User.findById(id);
  
    if (!user) {
      return res.status(404).json({message:"user not found!"});
    }else {
      return res.status(200).json({user})
    }
})

export const updateUser = catchAsyncError(async(req,res,next) => {

})

export const deleteUser = catchAsyncError(async(req,res,next) => {
    await User.findByIdAndUpdate(req.params.id, {deleted:true});
    res.status(200).json({message: "User deleted successfully."})
})