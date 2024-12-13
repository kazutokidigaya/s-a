import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { FORM_ENDPOINTS } from "@/constants/api";
import { router } from "expo-router";

const FormEditor = () => {
  const [title, setTitle] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "text",
        label: "",
        options: ["", "", "", ""], // Default 4 empty options for checkbox/grid
        correctOption: null,
        image: null,
      },
    ]);
  };

  const updateQuestion = (index: number, updatedQuestion: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const updateOption = (qIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[qIndex].options];
    updatedOptions[optionIndex] = value; // Update specific option
    updatedQuestions[qIndex].options = updatedOptions;
    setQuestions(updatedQuestions);
  };

  const selectCorrectOption = (qIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctOption = [value]; // Set correct option as an array
    setQuestions(updatedQuestions);
  };

  const updateCorrectAnswer = (qIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctOption = value; // Set correct answer for text question
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || questions.length === 0) {
      Alert.alert("Error", "Please complete all required fields.");
      return;
    }
    try {
      const response = await axios.post(FORM_ENDPOINTS.createForm, {
        title,
        headerImage,
        questions,
      });
      Alert.alert("Success", "Form created successfully!");
      console.log("Created form:", response.data);
      router.push("/"); // Assuming '/' is the home page route
    } catch (error) {
      Alert.alert("Error", "Failed to create form.");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Form Title"
        value={title}
        onChangeText={setTitle}
      />
      <Button
        title="Upload Header Image"
        onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
          if (!result.canceled) setHeaderImage(result.assets[0].uri);
        }}
      />
      {headerImage && (
        <Image source={{ uri: headerImage }} style={styles.image} />
      )}
      {questions.map((q, idx) => (
        <View key={idx} style={styles.questionContainer}>
          <Text style={styles.questionLabel}>Question {idx + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Question"
            value={q.label}
            onChangeText={(text) => updateQuestion(idx, { ...q, label: text })}
          />
          <Picker
            selectedValue={q.type}
            onValueChange={(value) =>
              updateQuestion(idx, { ...q, type: value })
            }
          >
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Checkbox" value="checkbox" />
            <Picker.Item label="Grid" value="grid" />
          </Picker>

          {/* Input for Text Question Correct Answer */}
          {q.type === "text" && (
            <>
              <Text style={styles.label}>Correct Answer:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the correct answer"
                value={q.correctOption || ""}
                onChangeText={(value) => updateCorrectAnswer(idx, value)}
              />
            </>
          )}

          {/* Options for Checkbox and Grid Types */}
          {(q.type === "checkbox" || q.type === "grid") && (
            <>
              <Text style={styles.label}>Options (4 Required):</Text>
              {q.options.map((option: string, optionIdx: number) => (
                <TextInput
                  key={optionIdx}
                  style={styles.optionInput}
                  placeholder={`Option ${optionIdx + 1}`}
                  value={option}
                  onChangeText={(value) => updateOption(idx, optionIdx, value)}
                />
              ))}
              <Text style={styles.label}>Select Correct Option:</Text>
              {q.options.map((option: string, optionIdx: number) => (
                <Button
                  key={optionIdx}
                  title={option || `Option ${optionIdx + 1}`}
                  onPress={() => selectCorrectOption(idx, option)}
                  color={q.correctOption?.includes(option) ? "green" : "gray"}
                />
              ))}
            </>
          )}

          <Button
            title="Upload Image"
            onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
              });
              if (!result.canceled)
                updateQuestion(idx, { ...q, image: result.assets[0].uri });
            }}
          />
          {q.image && <Image source={{ uri: q.image }} style={styles.image} />}
          <Button
            title="Delete Question"
            onPress={() => deleteQuestion(idx)}
            color="red"
          />
        </View>
      ))}
      <Button title="Add Question" onPress={addQuestion} />
      <Button title="Submit Form" onPress={handleSubmit} color="green" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  questionLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  label: { fontWeight: "bold", marginVertical: 5 },
  optionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  image: { height: 200, width: "100%", marginVertical: 10 },
  questionContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default FormEditor;
