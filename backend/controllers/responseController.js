import Form from "../models/Form.js";
import Response from "../models/Response.js";

const saveResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    console.log("Incoming formId:", formId);
    console.log("Incoming answers:", answers);

    // Validate inputs
    if (!formId || !answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: "Invalid data. formId and answers are required." });
    }

    // Fetch the form and its questions
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    console.log("Fetched form:", form);

    // Validate each answer
    let validationResults = [];
    answers.forEach((answer) => {
      const question = form.questions.find(
        (q) => q._id.toString() === answer.questionId // Match the questionId
      );

      if (!question) {
        console.log(`Question not found for questionId: ${answer.questionId}`);
        return; // Skip this answer
      }

      // Compare the correctOption
      if (question.correctOption) {
        const isCorrect = Array.isArray(question.correctOption)
          ? JSON.stringify(answer.answer) ===
            JSON.stringify(question.correctOption)
          : answer.answer === question.correctOption;
        validationResults.push({ questionId: answer.questionId, isCorrect });
      }
    });

    console.log("Validation results:", validationResults);

    // Save the response
    const response = new Response({
      formId,
      answers,
    });
    const savedResponse = await response.save();

    res.status(201).json({
      message: "Response saved successfully",
      response: savedResponse,
      validationResults,
    });
  } catch (error) {
    console.error("Error saving response:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getResponsesByForm = async (req, res) => {
  try {
    const { formId } = req.params;

    const responses = await Response.find({ formId }).populate(
      "formId",
      "title"
    );
    res.status(200).json({ responses });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export { saveResponse, getResponsesByForm };
