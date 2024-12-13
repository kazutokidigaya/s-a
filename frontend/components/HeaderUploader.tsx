import React, { useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

type HeaderUploaderProps = {
  onUpload: (uri: string) => void;
};

const HeaderUploader: React.FC<HeaderUploaderProps> = ({ onUpload }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onUpload(uri); // Pass the image URI to the parent component
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Header Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  image: { width: "100%", height: 150, resizeMode: "cover", marginTop: 10 },
});

export default HeaderUploader;
