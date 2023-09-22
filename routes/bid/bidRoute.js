import express from "express";
import {
  getAllAuctions,    
  getSingleAuction,
  createAuction,
  updateAuction,
  deleteAuction,
  addBid,
  confirmBid,
} from "../../controllers/bid/bidController.js";
import { authorizedUser } from "../../middleWares/accessAuth.js";
import upload from "../../middleWares/uploads.js";

const router = express.Router();

router
  .route("/")
  .post(authorizedUser,upload,createAuction)

router
  .route("/list")
  .get(authorizedUser,getAllAuctions)

router
  .route("/add/:id")
  .post(authorizedUser,addBid);

router
  .route("/confirm/:id")
  .put(authorizedUser,confirmBid);
  
  router
    .route("/:id")
    .get(authorizedUser,getSingleAuction)
    .put(authorizedUser,updateAuction)
    .delete(authorizedUser,deleteAuction);


export default router;