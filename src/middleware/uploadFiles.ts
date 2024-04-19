import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (_req: any, file: { mimetype: string; }, cb: (arg0: Error, arg1: boolean) => void) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); 
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const uploadImage = multer({ storage, fileFilter });

export default uploadImage;
