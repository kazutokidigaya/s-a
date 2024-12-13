import express from "express";
import {
  createForm,
  uploadImage,
  getFormById,
  getAllForms,
} from "../controllers/formContoller.js";

const router = express.Router();

router.get("/all", getAllForms); // Fetch all forms

router.post("/", createForm);

router.get("/:formId", getFormById);

router.post("/upload", uploadImage);

export default router;
