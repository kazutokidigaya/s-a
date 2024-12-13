import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { FORM_ENDPOINTS } from "@/constants/api";

export default function Responses() {
  const { formId } = useLocalSearchParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching responses for formId:", formId); // Debug log
    if (!formId) {
      Alert.alert("Error", "Invalid form ID.");
      return;
    }

    const fetchResponses = async () => {
      try {
        const response = await axios.get(
          FORM_ENDPOINTS.getResponsesByFormId(formId as string)
        );
        console.log("Fetched responses:", response.data.responses);
        setResponses(response.data.responses);
      } catch (error) {
        console.error("Error fetching responses:", error);
        Alert.alert("Error", "Failed to fetch responses. Check your network.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (responses.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No responses found for this form.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Responses</Text>
      {responses.map((response, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.responseText}>Response {idx + 1}</Text>
          {response.answers.map((answer: any, i: number) => (
            <Text key={i}>Answer: {answer.answer}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 },
  responseText: { fontWeight: "bold" },
});
