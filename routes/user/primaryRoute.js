import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  getUsersWithinRadius
} from "../../controllers/user/primaryController.js";
// import { extractUserInfo } from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/users-within")
  .get(getUsersWithinRadius)

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
