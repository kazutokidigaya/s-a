import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ResponseCardProps = {
  response: {
    answers: { questionId: string; answer: string | string[] }[];
  };
  index: number;
};

const ResponseCard: React.FC<ResponseCardProps> = ({ response, index }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Response {index + 1}</Text>
      {response.answers.map((answer, idx) => (
        <View key={idx} style={styles.answer}>
          <Text style={styles.question}>Question ID: {answer.questionId}</Text>
          <Text style={styles.answerText}>
            Answer:{" "}
            {Array.isArray(answer.answer)
              ? answer.answer.join(", ") // Join array answers with commas
              : answer.answer}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  answer: {
    marginBottom: 5,
  },
  question: {
    fontWeight: "bold",
  },
  answerText: {
    color: "#333",
  },
});

export default ResponseCard;
