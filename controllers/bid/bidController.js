import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Bid} from "../../models/Bid.js";
import { User } from "../../models/User.js";
import { Farmer } from "../../models/Farmer.js";
import { Auction } from "../../models/Auction.js";

export const getSingleAuction = (catchAsyncError(async(req,res,next) => {
    const {id} = req.params;

    const auction = await Auction.findById(id).populate('bids');
  
    if (!auction) {
      return res.status(404).json({message:"Auction not found!"});
    }else {
      return res.status(200).json(auction);
    }  
}))

export const getAllAuctions = (catchAsyncError(async(req, res, next) => {
    let query = {
      // deleted: false,
    };
    let limit = parseInt(req.query.perPage) || 10;
    let page = req.query.page ? req.query.page : 1;
    let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
    let sort = req.query.sort ? {} : { createdAt: -1 };
    let search = req.query.search;

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

    const auctions = await Auction.aggregate(aggregateQuery);

    res.status(200).json({
      auctions: auctions[0].data,
      total: auctions[0].metadata[0]
        ? Math.ceil(auctions[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
    })
}))

export const createAuction = (catchAsyncError(async(req, res, next) => {
  const {
    basePrice,
    maxPrice,
    quantity,
    typeOfWool,
    descp,
  } = req.body;

  const inventory = await Farmer.findOne({"ownerId": req.user._id},{"inventory":1});

  let _auction = {
    initializer:req.user._id,
    inventory : inventory._id,
    basePrice,
    quantity,
    typeOfWool,
    descp,
  } 

  if(maxPrice){
    _auction.maxPrice = maxPrice;
  }

  await Auction.create(_auction);

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
    
      res.status(200).json({auction});
}))

export const deleteAuction = (catchAsyncError(async(req, res, next) => {
    await Auction.findByIdAndUpdate(req.params.id, {deleted:true});
    res.status(200).json({message: "Auction deleted successfully."})
}))

export const addBid = (catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const { 
    offeredPrice,
    description,
  } = req.body;

  const bid = await Bid.create({
    bidder : req.user._id,
    auction:id,
    offeredPrice,
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
    res.status(200).json({message: "bid set successfully" , bid});
  }
}))

export const confirmBid = (catchAsyncError(async(req, res, next) => {
  const {id } = req.params;
  const { bidId } = req.body;

  const auction = await Auction.findByIdAndUpdate(id, { status:true, lockedBy:bidId });

  if(auction){
    res.status(200).json({message: "Bid confirmed successfully."});
  } else {
    res.status(200).json({message: "Error confirming bid!"});
  }
}))