import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { FORM_ENDPOINTS } from "@/constants/api";
export default function HomePage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(FORM_ENDPOINTS.getAllForms);
        setForms(response.data.forms); // Assuming the API returns { forms: [] }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch forms.");
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Forms</Text>
      <Button
        title="Create New Form"
        onPress={() => router.push("/form-editor")}
        color="blue"
      />
      {forms.map((form) => (
        <View key={form._id} style={styles.formCard}>
          <Text style={styles.formTitle}>{form.title}</Text>
          <Button
            title="View Form"
            onPress={() => router.push(`/form-preview?formId=${form._id}`)}
            color="green"
          />
          <Button
            title="View Responses"
            onPress={() => router.push(`/response?formId=${form._id}`)}
            color="orange"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  formCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  formTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});
