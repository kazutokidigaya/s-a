import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  label: { type: String },
  image: { type: String },
  options: [String],
  correctOption: mongoose.Schema.Types.Mixed, // Correct answer: String (for single answer) or Array (for multiple answers)
  image: { type: String },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  headerImage: { type: String },
  questions: [questionSchema],
});

const Form = mongoose.model("Form", formSchema);

export default Form;
