import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function TouchableButton({
  title,
  func,
  isLoading = false,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={func}
      disabled={disabled}
      
      className="mx-auto mt-2 bg-[#144677] w-[50%] flex justify-center items-center py-2 rounded-lg "
    >
      <Text className="text-white font-bold">
        {isLoading ? "Yükleniyor..." : title || "Giriş Yap"}
      </Text>
    </TouchableOpacity>
  );
}
