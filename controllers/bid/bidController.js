import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Bid} from "../../models/Bid.js";
import { User } from "../../models/User.js";
import { Farmer } from "../../models/Farmer.js";

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

    const bids = await Bid.aggregate(aggregateQuery);

    res.status(200).json({
      bids: bids[0].data,
      total: bids[0].metadata[0]
        ? Math.ceil(bids[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
    })
}))

export const createBid = (catchAsyncError(async(req, res, next) => {
  const {
    basePrice,
    quantity,
    typeOfWool,
    descp,
  } = req.body;

  const inventory = await Farmer.findOne({"ownerId": req.user._id},{"inventory":1});

  let _bid = {
    initializer:req.user._id,
    inventory : inventory._id,
    basePrice,
    quantity,
    typeOfWool,
    descp,
  } 

  await Bid.create(_bid);

  res.status(200).json({message: "Bid created successfully."});
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

export const addBid = (catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { 
    offeredPrice,
    description,
  } = req.body;

  let _bid = {
    bidder : req.user._id,
    offeredPrice,
    description,
  };

  if(description){
    _bid.description = description
  }

  const bid = await Bid.findByIdAndUpdate(id, {$push : { bids: _bid }}, {new:true});

  if(!bid){
    res.status(500).json({ message: "error setting bid"});
  } else {
    res.status(200).json({message: "bid set successfully" , bid});
  }
}))