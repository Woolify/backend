import qrcode from "qrcode"
import fs from 'fs'
import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Animal} from "../../models/Animal.js";
import {Farmer} from "../../models/Farmer.js";
import PDFDocument from "pdfkit"
import { Inventory } from "../../models/Inventory.js";


const addAnimal = async(owner,name) => {
  const _animal = await Animal.create({owner});

  await Farmer.findByIdAndUpdate(owner, { $push: { sheepData: _animal._id } }, { new: true })

  // generate qr
  const data = `${process.env.BACKEND_URL}/api/farmer/animal/${_animal.id}`;

    const qrDataUrl = await qrcode.toDataURL(data);
    const qrImageBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  
    // let filePath = `./public/uploads/animals/qr/qrImg-${ Date.now() + Math.floor(Math.random() * 90000) }.jpg`;
    // fs.writeFileSync( filePath, qrImageBuffer);

    // _animal.qrImg = process.env.BACKEND_URL + filePath.substring(8);
    // _animal.nickName = name

    // await _animal.save();  
    // return filePath;
  return qrImageBuffer;
  }

export const generateQr = catchAsyncError(async (req,res,next) =>{
    const {count} = req.body;

    let result = [];
  for (let i = 1; i <= count; i++) {
    result.push(await addAnimal(req.user._id,`SH${i}`));
  }
  // return res.status(200).json(result)

  let filePath = `./public/uploads/animals/pdf/qrPdf-${ Date.now() + Math.floor(Math.random() * 90000) }.pdf`;

  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  
  doc.pipe(stream);

  for (const imagePath of result) {
    doc.addPage({ size: [612, 612] }); 

    try {
      await new Promise((resolve, reject) => {
        try {
          doc.image(imagePath, 0, 0, { width: 612, height: 612 });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error(`Error embedding image: ${error}`);
    }
  }

  doc.end();

  let outputUrl = process.env.BACKEND_URL + filePath.substring(8);

  stream.on('finish',() => {
    res.status(200).json({"pdfUrl": outputUrl });
  })
  stream.on('error',() => {
    res.status(500).json({message: "Unable to generate pdf!"});
  })

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

  animal.saveAsDraft = false;
  await animal.save();

  res.status(200).json({animal});
})

export const deleteAnimal = catchAsyncError(async (req,res, next) =>{
  await Animal.findByIdAndUpdate(req.params.id, {deleted:true});
  res.status(200).json({message: "Animal deleted successfully."})
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

export const getAnimalsData = catchAsyncError( async( req, res, next ) => {
  let query = {
    // deleted: false,
    owner: req.user._id
  };

  if(req.query.breed){
    query.breed = req.query.breed
  }

  if(req.query.breed){
    query.breed = req.query.breed
  }

  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 };
  let search = req.query.search;

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        nickName: regex,
      },
    ];
  }

  let aggregateQuery = [
    {
      $match: query,
    },
    {
      $sort: sort,
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        metadata: [
          {
            $match: query,
          },
          {
            $count: "total",
          },
        ],
      },
    },
  ];

  const animals = await Animal.aggregate(aggregateQuery);

  res.status(200).json({
    animals: animals[0].data,
    total: animals[0].metadata[0]
      ? Math.ceil(animals[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  })
})

export const getInventoryData = catchAsyncError( async(req,res,next) => {

  // let inventory = await Inventory.findOne({ ownerId : req.user._id }).populate();



  // res.status(200).json(inventory)
})

export const addInventoryData = catchAsyncError( async(req,res,next) => {
  
  const {
    quantity,
    typeOfWool,
    color
  } = req.body;
  
  let user = await Farmer.findOne({userId : req.user._id});
  
  const inventory = await Inventory.create({
    owner: "farmer",
    ownerId: user._id,
    quantity,
    typeOfWool,
    color,
  })

  user.inventory.push(inventory._id);
  user.save();

  if(inventory) {
    res.status(200).json({inventory, user});
  } else {
    res.status(500).json({message: "Error creating inventory!"})
  }
})

export const updateInventory = catchAsyncError( async(req,res,next) => {
  
})

export const deleteInventory = catchAsyncError( async(req,res,next) => {
  
  })