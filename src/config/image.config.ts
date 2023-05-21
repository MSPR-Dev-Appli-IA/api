import {Request} from "express";
import multer, {FileFilterCallback} from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void


const storage = multer.diskStorage({
    destination: function (_: Request, __: Express.Multer.File, cb: DestinationCallback) {
        cb(null, "public/image");
    },
    filename: function (_: Request, file: Express.Multer.File, cb: FileNameCallback) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});


const filters = (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
};
const fileSize = 1024 * 1024 * 5;

export default multer({
    storage: storage,
    limits: {
        fileSize: fileSize,
    },
    fileFilter: filters,
});
