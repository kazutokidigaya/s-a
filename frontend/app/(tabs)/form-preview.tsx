import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FORM_ENDPOINTS } from "@/constants/api";

export default function FormPreview() {
  const router = useRouter();
  const { formId } = useLocalSearchParams();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          FORM_ENDPOINTS.getFormById(formId as string)
        );
        console.log("Fetched form:", response.data);
        setForm(response.data.form);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch form details.");
        console.error("Error fetching form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (questionId: string, value: string) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      formId,
      answers: Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const response = await axios.post(FORM_ENDPOINTS.submitResponse, payload);
      console.log("Backend Response:", response.data);
      Alert.alert("Success", "Form submitted successfully!");

      // Reset the response state after submission
      setResponses({});
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to submit the form.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!form) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Form not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>
      {form.headerImage && (
        <Image source={{ uri: form.headerImage }} style={styles.headerImage} />
      )}
      {form.questions.map((question: any, index: number) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.label}</Text>
          {question.image && (
            <Image
              source={{ uri: question.image }}
              style={styles.questionImage}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Enter your response"
            onChangeText={(value) => handleInputChange(question._id, value)}
          />
        </View>
      ))}
      <Button title="Submit Form" onPress={handleSubmit} color="green" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  questionText: { fontWeight: "bold", marginBottom: 5 },
  questionImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});
