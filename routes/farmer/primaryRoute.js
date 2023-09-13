import express from "express";
import {
    generateQr,
    updateAnimalData,
    getSingleAnimalData,
    deleteAnimal,
} from "../../controllers/farmer/primaryController.js";
import upload from '../../middleWares/uploads.js'
import { authorizedUser } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/generate-qr")
  .post(authorizedUser,upload,generateQr);

router
  .route("/animal/:id")
  .get(getSingleAnimalData)
  .put(updateAnimalData)
  .delete(deleteAnimal);


export default router;