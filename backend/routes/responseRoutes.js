import express from "express";
import {
  getResponsesByForm,
  saveResponse,
} from "../controllers/responseController.js";

const router = express.Router();

router.post("/", saveResponse);

router.get("/:formId", getResponsesByForm);

export default router;
