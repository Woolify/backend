import express from "express";
import {
    makeCall,
    ivr
} from "../../controllers/ivrs/index.js";

const router = express.Router();

router
  .route("/makeCall")
  .get(makeCall);

router
  .route("/ivr")
  .post(ivr);

export default router;