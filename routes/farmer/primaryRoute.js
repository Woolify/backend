import express from "express";
import {
    generateQr,
    updateAnimalData,
    getSingleAnimalData,
    deleteAnimal,
    getAnimalsData,
    getInventoryData,
    addInventoryData,
    updateInventory,
    deleteInventory
} from "../../controllers/farmer/primaryController.js";
import upload from '../../middleWares/uploads.js'
import { authorizedUser } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/generate-qr")
  .post(authorizedUser,upload,generateQr);

router
  .route("/animals")
  .get(authorizedUser,getAnimalsData);

router
  .route("/animal/:id")
  .get(authorizedUser,getSingleAnimalData)
  .put(authorizedUser,updateAnimalData)
  .delete(authorizedUser,deleteAnimal);

router
  .route("/inventory")
  .get(authorizedUser,getInventoryData)
  .post(authorizedUser,addInventoryData);

router
  .route("/inventory/:id")
  .put(authorizedUser,updateInventory)
  .delete(authorizedUser,deleteInventory);

export default router;