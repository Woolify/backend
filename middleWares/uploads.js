import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnailImage") {
      cb(null, "./public/uploads/courses/thumbnails");
    }
    if (file.fieldname === "thumbnail") {
      cb(null, "./public/uploads/products/thumbnails");
    }
    if (file.fieldname === "bundleThumbnailImage") {
      cb(null, "./public/uploads/bundle/thumbnails");
    }
    if (file.fieldname === "profileImg") {
      cb(null, "./public/uploads/instructors/profile");
    }
    if (file.fieldname === "blogGallery") {
      cb(null, "./public/uploads/blog/gallery");
    }
    if (file.fieldname === "blogThumbImage") {
      cb(null, "./public/uploads/blog/thumbnail");
    }
    if (file.fieldname === "userProfileImg") {
      cb(null, "./public/uploads/user/profile");
    }
    if (file.fieldname === "blogDocument") {
      cb(null, "./public/uploads/blog/documents");
    }
    if (file.fieldname === "practiceFiles") {
      cb(null, "./public/uploads/topics/practice-files");
    }
    if (file.fieldname === "categoryIcon") {
      cb(null, "./public/uploads/category");
    }
    if (file.fieldname === "quizSheet") {
      cb(null, "./public/uploads/quiz");
    }
    if (file.fieldname === "bannerImage") {
      cb(null, "./public/uploads/banners");
    }
    if (file.fieldname === "posterImage") {
      cb(null, "./public/uploads/help/posterImage");
    }
    if (file.fieldname === "stepImage") {
      cb(null, "./public/uploads/help/stepImage");
    }
    if (file.fieldname === "productGallery") {
      cb(null, "./public/uploads/products/gallery");
    }
    if (file.fieldname === "testimonialProfile") {
      cb(null, "./public/uploads/testimonials");
    }
    if (file.fieldname === "notificationImage") {
      cb(null, "./public/uploads/notifications");
    }
    if (file.fieldname === "pdfFile") {
      cb(null, "./public/uploads/topics/topic-assets");
    }
    if (file.fieldname === "customVideo") {
      cb(null, "./public/uploads/topics/topic-assets");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        Math.floor(Math.random() * 90000) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage }).fields([
  {
    name: "thumbnailImage",
  },
  {
    name: "thumbnail",
  },
  {
    name: "profileImg",
  },
  {
    name: "blogThumbImage",
  },
  {
    name: "blogGallery",
  },
  {
    name: "blogDocument",
  },
  {
    name: "userProfileImg",
  },
  {
    name: "practiceFiles",
  },
  {
    name: "categoryIcon",
  },
  {
    name: "quizSheet",
  },
  {
    name: "bannerImage",
  },
  {
    name: "posterImage",
  },
  {
    name: "stepImage",
  },
  {
    name: "productGallery",
  },
  {
    name: "testimonialProfile",
  },
  {
    name: "bundleThumbnailImage",
  },
  {
    name: "notificationImage",
  },
  {
    name: "pdfFile",
  },
  {
    name: "customVideo",
  },
]);

export default upload;
