import { getAllCategories } from "../controller/categoryController.js";
import express from "express";

const router = express.Router();

// api lay danh muc san pham
router.get('/', getAllCategories);



export default router;
