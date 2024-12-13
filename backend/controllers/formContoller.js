import Form from "../models/Form.js";
import cloudinary from "../config/cloudinary.js";

const createForm = async (req, res) => {
  try {
    const { title, headerImage, questions } = req.body;
    console.log(title, headerImage, questions);

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Questions must be an array." });
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (!question.type) {
        throw new Error(`Type is required for question at index ${index}`);
      }
      if (["checkbox", "grid"].includes(question.type)) {
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          throw new Error(
            `Question at index ${index} must have exactly 4 options.`
          );
        }
        if (question.correctOption) {
          if (
            !Array.isArray(question.correctOption) ||
            !question.correctOption.every((opt) =>
              question.options.includes(opt)
            )
          ) {
            throw new Error(
              `CorrectOption for question at index ${index} must be an array and match options.`
            );
          }
        }
      } else if (question.type === "text" && question.correctOption) {
        if (typeof question.correctOption !== "string") {
          throw new Error(
            `CorrectOption for question at index ${index} must be a string for text type.`
          );
        }
      }
    });

    // Create form object
    const form = new Form({
      title,
      headerImage,
      questions,
    });

    await form.save();

    res.status(201).json({ message: "Form Created Successfully", form });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ form });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().select("title headerImage _id");
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch forms." });
  }
};

export { uploadImage, createForm, getFormById, getAllForms };
