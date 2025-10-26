import express from "express";
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, upload.single('image'), addProduct); 

router.route("/allproducts").get(fetchAllProducts);
router.route('/:id/reviews').post(authenticate, checkId, addProductReview);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.route("/:id")
  .get(checkId, fetchProductById)
  .put(authenticate, authorizeAdmin, upload.single('image'), updateProductDetails) 
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);


export default router;