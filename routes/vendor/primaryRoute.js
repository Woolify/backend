import express from "express";
import {
    getAuctionByVendor
} from "../../controllers/vendor/primaryController.js";
import { authorizedUser } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/auction/list")
  .get(authorizedUser,getAuctionByVendor);

export default router;