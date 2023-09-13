import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../../controllers/user/primaryController.js";
// import { extractUserInfo } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
