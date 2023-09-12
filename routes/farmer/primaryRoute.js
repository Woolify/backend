import express from "express";
import {
    generateQr,
    updateAnimalData,
    getSingleAnimalData
} from "../../controllers/farmer/primaryController.js";
import upload from '../../middleWares/uploads.js'
import { authorizedUser } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/generate-qr")
  .post(authorizedUser,upload,generateQr);

router
  .route("/update-animal")
  .post(updateAnimalData);

router
  .route("/animal/:id")
  .get(getSingleAnimalData);


export default router;