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
  const {id} = req.params;
  const {
    firstName,
    lastName,
    username,
    email,
    latitude,
    longitude,
    address,
    city,
    state,
    pincode,
    dob,
    gender,
    description,
  } = req.body;

  let _user = {};

  if(firstName){
    _user.firstName = firstName;
  }
  if(lastName){
    _user.lastName = lastName;
  }
  if(username){
    const userWithUsername = await User.findOne({username});

    if (!userWithUsername) {
      _user.username = username;
    } else {
      return res.status(409).json({message: "username already exist"});
    }
  }

  if(email){
    _user.email = email;
  }

  let _location = {};

  if(longitude && latitude){
    _location.coordinates = [longitude, latitude];
    // _location.longitude = longitude;
    // _location.latitude = latitude;
  }
  if(address){
    _location.address = address;
  }
  if(city){
    _location.city = city;
  }
  if(state){
    _location.state = state;
  }
  if(pincode){
    _location.pincode = pincode;
  }
  _user.location=_location
  if(dob){
    _user.dob = dob;
  }
  if(gender){
    _user.gender = gender;
  }
  if(description){
    _user.description = description;
  }

  const user = await User.findByIdAndUpdate(id, _user);

  if (!user) {
    return res.status(409).json({message:"Error updating user!"});
    // return res.status(404).json({message:"user not found!"});
  }

  return res.status(200).json({ message: "User updated successfully.",user})
})

export const deleteUser = catchAsyncError(async(req,res,next) => {
    await User.findByIdAndUpdate(req.params.id, {deleted:true});
    res.status(200).json({message: "User deleted successfully."})
})

export const getUsersWithinRadius = catchAsyncError( async (req,res,next) => {
  const {
    role,
    radius,
    latitude,
    longitude
  } = req.query;

  const user = new User();
  
  const users = await user.findUsersWithinRadius([longitude,latitude], radius,role?role:'vendor')
    
  if(users){
    res.status(200).json(users)
  } else {
    res.status(500).json({message:"Error extracting users data"});
  }

})