import express from "express";
import {
  getAllBids,    
  getSingleBid,
  createBid,
  updateBid,
  deleteBid,
} from "../../controllers/bid/bidController.js";
import { authorizedUser } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/")
  .post(authorizedUser,createBid)

router
  .route("/list")
  .get(authorizedUser,getAllBids)
  
  router
    .route("/:id")
    .get(authorizedUser,getSingleBid)
    .put(authorizedUser,updateBid)
    .delete(authorizedUser,deleteBid);

export default router;