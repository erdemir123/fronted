import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useField } from "formik";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

const FileInput = ({ label, name }) => {
  const [field, meta, helpers] = useField(name);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Galeriye erişim izni al
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Galeriyi kullanmak için izin vermelisiniz!");
      return;
    }

    // Resim seçimi
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
      helpers.setValue(selectedImage.uri); // Formik state'ini güncelle
    }
  };

  const removeImage = () => {
    setImage(null);
    helpers.setValue(""); // Formik state'ini sıfırla
  };

  return (
    <View className="mt-4 w-[90%]   mx-auto flex justify-center items-center gap-y-2">
      <View
        className={`h-24 w-24 border rounded-full  flex items-center justify-center bg-[#03346E] ${
          meta.error && meta.touched ? "border-red-500" : "border-white"
        }`}
      >
        {image ? (
          <View className="relative w-full h-full rounded-full ">
            <Image
              source={{ uri: image }}
              className="w-full h-full object-cover rounded-full"
            />
            <TouchableOpacity
              onPress={removeImage}
              className="absolute bottom-2 -right-2 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center z-20"
            >
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="relative w-full h-full rounded-full ">
            <Image
              source={require("../../assets/deneme.png")}
              className="w-full h-full object-cover rounded-full"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-2 -right-2 bg-[#0f0f37] rounded-full w-8 h-8 flex items-center justify-center z-20"
            >
              <Icon name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text className="text-sm text-white mb-2">{label}</Text>

      {meta.error && meta.touched && (
        <Text className="text-red-500 mt-2 text-sm">{meta.error}</Text>
      )}
    </View>
  );
};

export default FileInput;
