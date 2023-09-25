import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Bid} from "../../models/Bid.js";
import { User } from "../../models/User.js";
import { Farmer } from "../../models/Farmer.js";
import { Auction } from "../../models/Auction.js";
import { Inventory } from "../../models/Inventory.js";
import { sendNotification } from "../../utils/sendNotification.js";

export const getSingleAuction = (catchAsyncError(async(req,res,next) => {
    const {id} = req.params;

    const auction = await Auction.findById(id).populate([
      {
        path:'inventory',
        select:'-_id quantity typeOfWool color listed'
      },
      {
        path: 'initializer',
        populate:{
          path:'location',
          select : '-type'
        },
        select: '-_id firstName lastName email phone isVerified ' 
      },
      {
        path:'bids',
        populate:{
          path:'bidder'
        }
      }
    ]);
    // const auction = await Auction.findById(id).populate(['inventory','bids']);
  
    if (!auction) {
      return res.status(404).json({message:"Auction not found!"});
    }else {
      const highestBid = auction.bids.reduce((highest, bid) => {
        if (!highest || bid.offeredPrice > highest.offeredPrice) {
          return bid;
        }
        return highest;
      }, null);
    
      const auctionWithHighestBid = {
        ...auction.toObject(),
        highestBidDocument: highestBid || null,
      };
      return res.status(200).json(auctionWithHighestBid);
    }  
}))

export const getAllAuctions = (catchAsyncError(async(req, res, next) => {
  
  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;
  let status = req.query.status == 'false' ? false : true

  let query = {
    // deleted: false,
    status
  };

  if (search) {
      let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const regex = new RegExp(newSearchQuery, "gi");
      query.$or = [
        {
          bid: regex,
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
        $lookup: {
          from: 'inventories',
          localField: 'inventory',
          foreignField: '_id',
          as: 'inventory',
        },
      },
      {
        $unwind: '$inventory',
      },
      {
        $lookup: {
          from: 'bids',
          localField: '_id',
          foreignField: 'auction',
          as: 'bids',
        },
      },
      {
        $unwind: {
          path: '$bids',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'bids.bidder',
          foreignField: '_id',
          as: 'bids.bidder',
        },
      },
      {
        $unwind: {
          path: '$bids.bidder',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          bids: {
            $push: '$bids',
          },
          highestBid: {
            $max: '$bids.offeredPrice',
          },
          otherFields: {
            $first: '$$ROOT',
          },
        },
      },
      {
        $addFields: {
          highestBidDocument: {
            $filter: {
              input: '$bids',
              as: 'bid',
              cond: { $eq: ['$$bid.offeredPrice', '$highestBid'] },
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$otherFields', { bids: '$bids', highestBidDocument: { $arrayElemAt: ['$highestBidDocument', 0] } }],
          },
        },
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
              $count: "total",
            },
          ],
        },
      },
    ];
    
    const auctions = await Auction.aggregate(aggregateQuery);
    
    res.status(200).json({
      auctions: auctions[0].data,
      total: auctions[0].metadata[0]
        ? Math.ceil(auctions[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
    });
    
}))

export const createAuction = (catchAsyncError(async(req, res, next) => {
  const {
    basePrice,
    maxPrice,
    quantity,
    inventory,
    typeOfWool,
    descp,
  } = req.body;

  // const inventory = await Farmer.findOne({"ownerId": req.user._id},{"inventory":1});z

  const inventoryData = await Inventory.findById(inventory);

  if(inventoryData.quantity < quantity){
    return res.status(409).json({message: "Quantity excide inventory quantity."})
  } else {
    inventoryData.quantity = inventoryData.quantity - quantity;
    inventoryData.listed =+ quantity;
    inventoryData.save(); 
  }

  const woolImg = process.env.BACKEND_URL + (req.files.woolImg[0].path).slice(6);

  let _auction = {
    initializer:req.user._id,
    inventory,
    basePrice,
    woolImg,
    quantity,
    typeOfWool,
    descp,
  } 

  if(maxPrice){
    _auction.maxPrice = maxPrice;
  }

  await Auction.create(_auction);

  const user = await User.findById(req.user._id , {socketId:1}); 
  sendNotification(req.io,user._id,user.socketId,"Auction created successfully")

  res.status(200).json({message: "Auction created successfully."});
}))

export const updateAuction = (catchAsyncError(async(req, res, next) => {
    const {
        basePrice,
        maxPrice,
        quantity,
        status,
        descp,
      } = req.body;
    
      const auction = await Auction.findById(req.params.id);
      
      if(!auction){
        return res.status(404).json({message:"Auction not found!"});
      }
    
      if (basePrice) {
        auction.basePrice = basePrice;
      }
    
      if (maxPrice) {
        auction.maxPrice = maxPrice;
      }
    
      if (quantity) {
        auction.quantity = quantity;
      }
    
      if (status) {
        auction.status = status;
      }

      if (descp) {
        auction.descp = descp;
      }
    
      await auction.save();


  const user = await User.findById(req.user._id , {socketId:1}); 
  sendNotification(req.io,user._id,user.socketId,"Auction updated successfully")
    
      res.status(200).json({auction});
}))

export const deleteAuction = (catchAsyncError(async(req, res, next) => {
    await Auction.findByIdAndUpdate(req.params.id, {deleted:true});

  const user = await User.findById(req.user._id , {socketId:1}); 
  sendNotification(req.io,user._id,user.socketId,"Auction deleted successfully")

    res.status(200).json({message: "Auction deleted successfully."})
}))

export const addBid = (catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const { 
    offeredPrice,
    description,
  } = req.body;
  
  const currentHighestBid = await Bid.findOne(
    { auction: id, status: true, offeredPrice: { $gt: offeredPrice } }
  );
  
  if (currentHighestBid) {
    await Bid.updateMany({ auction: id, _id: { $ne: currentHighestBid._id } }, { status: false });
  }
  
  const status = currentHighestBid === null ? true : false;
  
  const bid = await Bid.create({
    bidder: req.user._id,
    auction: id,
    offeredPrice,
    status,
  });   

  if(description){
    bid.description = description
  }

  bid.save();


  const auction = await Auction.findByIdAndUpdate(id, {$push : { bids: bid._id }}, {new:true});

  if(!auction){
    res.status(500).json({ message: "Auction not found!"});
    // res.status(500).json({ message: "error setting bid"});
  } else {

  const user = await User.findById(req.user._id , {socketId:1}); 
  sendNotification(req.io,user._id,user.socketId,"Bid set successfully")

    res.status(200).json({message: "bid set successfully" , bid});
  }
}))

export const confirmBid = (catchAsyncError(async(req, res, next) => {
  const {id } = req.params;
  const { bidId } = req.body;

  const auction = await Auction.findByIdAndUpdate(id, { status:true, lockedBy:bidId });

  if(auction){

  const user = await User.findById(req.user._id , {socketId:1}); 
  sendNotification(req.io,user._id,user.socketId,"Bid confirmed successfully")

    res.status(200).json({message: "Bid confirmed successfully."});
  } else {
    res.status(200).json({message: "Error confirming bid!"});
  }
}))