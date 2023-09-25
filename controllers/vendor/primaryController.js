import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Auction } from "../../models/Auction.js";

export const getAuctionByVendor = catchAsyncError(async (req, res, next) => {
    const status = req.query.status === 'true' ? true : false;
  
    const auctions = await Auction.find().populate([
      {
        path: 'bids',
        populate: 'bidder',
      },
    ]);
  
    const filteredAuctions = auctions.filter((auction) => {
      return auction.status === status && auction.bids.some((bid) => bid.bidder._id.equals(req.user._id));
    });
  
    res.json(filteredAuctions);
  });
  