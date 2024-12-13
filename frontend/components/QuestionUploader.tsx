import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

type QuestionEditorProps = {
  question: {
    type: string; // Add type to the question object
    label: string;
    options: string[];
    correctOption: any;
    image: string | null;
  };
  onUpdate: (question: any) => void;
  onDelete: () => void;
};

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onDelete,
}) => {
  const [type, setType] = useState(question.type || "text"); // Default to "text"
  const [label, setLabel] = useState(question.label);
  const [options, setOptions] = useState(question.options || ["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(question.correctOption);
  const [imageUri, setImageUri] = useState(question.image);

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    onUpdate({ ...question, options: updatedOptions });
  };

  const selectCorrectOption = (value: any) => {
    setCorrectOption(value);
    onUpdate({ ...question, correctOption: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onUpdate({ ...question, image: uri });
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Type Picker */}
      <Text style={styles.label}>Question Type:</Text>
      <Picker
        selectedValue={type}
        onValueChange={(value: any) => {
          setType(value);
          onUpdate({ ...question, type: value });
        }}
      >
        <Picker.Item label="Text" value="text" />
        <Picker.Item label="Checkbox" value="checkbox" />
        <Picker.Item label="Grid" value="grid" />
      </Picker>

      <Text style={styles.label}>Add Question Image (Optional):</Text>
      <Button title="Upload Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Question Label */}
      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter question label"
        value={label}
        onChangeText={(value) => {
          setLabel(value);
          onUpdate({ ...question, label: value });
        }}
      />

      {/* Options for Checkbox/Grid Questions */}
      {(type === "checkbox" || type === "grid") && (
        <>
          <Text style={styles.label}>Options (4 Required):</Text>
          {options.map((option, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(value) => updateOption(index, value)}
            />
          ))}
        </>
      )}

      {/* Correct Option Selection */}
      <Text style={styles.label}>Correct Option:</Text>
      {type === "text" ? (
        <TextInput
          style={styles.input}
          placeholder="Enter correct option"
          value={correctOption || ""}
          onChangeText={(value) => selectCorrectOption(value)}
        />
      ) : (
        options.map((option, index) => (
          <Button
            key={index}
            title={option || `Option ${index + 1}`}
            onPress={() => selectCorrectOption([option])}
            color={correctOption?.includes(option) ? "green" : "gray"}
          />
        ))
      )}

      {/* Delete Question */}
      <Button title="Delete Question" onPress={onDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  label: { fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginTop: 10,
  },
});

export default QuestionEditor;
