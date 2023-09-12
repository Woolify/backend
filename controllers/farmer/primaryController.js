import {v4 as uuidv4} from "uuid";
import qr from "qrcode"
import { catchAsyncError } from "../../middleWares/catchAsyncError.js"
import {Animal} from "../../models/Animal.js";


export const generateQr = catchAsyncError(async (req,res,next) =>{
    const {count} = req.body;

    const qrCodes = [];

    for (let i = 0; i < count; i++) {
      const documentId = uuidv4();
      const qrImg = `${req.protocol}://${req.get('host')}/api/farmer/animals/${documentId}`;

      const qrCode = await qr.toDataURL(qrImg);

      const animal = new Animal({
        _id: documentId,
        qrImg,
      });

    //   await animal.save();

      qrCodes.push({ documentId, qrImg, qrCode });
    }

    res.json({ qrCodes });
})
export const updateAnimalData = catchAsyncError(async (req,res,next) =>{

})