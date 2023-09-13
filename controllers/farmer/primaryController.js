import {v4 as uuidv4} from "uuid";
import qrcode from "qrcode"
import fs from 'fs'
import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Animal} from "../../models/Animal.js";
import {Farmer} from "../../models/Farmer.js";


const addAnimal = async(owner,name) => {
  const _animal = await Animal.create({owner});

  await Farmer.findByIdAndUpdate(owner, { $push: { sheepData: _animal._id } }, { new: true })

  // generate qr
  const data = `${process.env.BACKEND_URL}/api/farmer/animal/${_animal.id}`;

    const qrDataUrl = await qrcode.toDataURL(data);
    const qrImageBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  
    let filePath = `./public/uploads/animals/qr/qrImg-${ Date.now() + Math.floor(Math.random() * 90000) }.jpg`;
    fs.writeFileSync( filePath, qrImageBuffer);

    _animal.qrImg = process.env.BACKEND_URL + filePath.substring(8);
    _animal.nickName = name

    await _animal.save();  
    return process.env.BACKEND_URL +filePath.substring(8);
}

export const generateQr = catchAsyncError(async (req,res,next) =>{
    const {count} = req.body;

    let result = [];
  for (let i = 1; i <= count; i++) {
    result.push(await addAnimal(req.user._id,`SH${i}`));
  }
  return res.status(200).json(result)
})
export const updateAnimalData = catchAsyncError(async (req,res,next) =>{
  const {
    nickName,
    age,
    weight,
    lastShread,
    type,
    breed,
    descp,
  } = req.body;

  const animal = await Animal.findById(req.params.id);
  
  if(!animal){
    return res.status(404).json({message:"Animal not found!"});
  }

  if (nickName) {
    animal.nickName = nickName;
  }
  if (age) {
    animal.age = age;
  }
  if (weight) {
    animal.weight = weight;
  }
  if (lastShread) {
    animal.lastShread = lastShread;
  }
  if (type) {
    animal.type = type;
  }
  if (breed) {
    animal.breed = breed;
  }
  if (descp) {
    animal.descp = descp;
  }

  await animal.save();

  res.status(200).json({animal});
})

export const deleteAnimal = catchAsyncError(async (req,res, next) =>{
})

export const getSingleAnimalData = catchAsyncError(async(req, res, next) => {
  const {id} = req.params;

  const animal = await Animal.findById(id);

  if (!animal) {
    return res.status(404).json({message:"animal not found!"});
  }else {
    return res.status(200).json({animal})
  }

})