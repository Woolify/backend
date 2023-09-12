import express from "express";
import {
    generateQr,
    updateAnimalData,

} from "../../controllers/farmer/primaryController.js";

const router = express.Router();

router
  .route("/generate-qr")
  .post(generateQr);

router
  .route("/update-animal")
  .post(updateAnimalData);


export default router;