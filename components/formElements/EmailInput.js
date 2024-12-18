import React, { useState, useEffect, useRef } from "react";
import { TextInput, Text, View, Image, TouchableOpacity, Animated } from "react-native";
import { useField } from "formik";
import redAlert from "../../assets/red-alert.svg";
import _ from "lodash";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function EmailInput({ label, name, ...props }) {
  const [field, meta] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useRef(new Animated.Value(0)).current; // Animated value

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    field.onBlur(name)(e);
  };

  useEffect(() => {
    if (isFocused || field.value) {
      Animated.timing(labelPosition, {
        toValue: 1, // Yukarı pozisyon
        duration: 300, // Daha yavaş animasyon
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(labelPosition, {
        toValue: 22, // Başlangıç pozisyonu
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, field.value]);

  return (
    <View className="mt-2 w-[90%] mx-auto">
      <Animated.Text
        style={{
          position: "absolute",
          left: 10,
          transform: [{ translateY: labelPosition }],
          color: "#F7F9E8",
          fontSize: 14,
        }}
      >
        {label}
      </Animated.Text>

      <TextInput
        {..._.omit(field, ["onBlur", "onChange"])}
        value={field.value}
        onChangeText={field.onChange(name)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        cursorColor={"#03346E"}
        keyboardType="email-address" // E-posta girişi için uygun klavye
        {...props}
        style={{
          width: "100%",
          height: 50,
          borderColor: meta.error && meta.touched ? "red" : "white",
          borderWidth: 1,
          borderRadius: 8,
          paddingTop: 18, // Label için alan bırakır
          paddingLeft: 10,
          paddingRight: 10, // icon alanı gerekmediği için sağdan padding azalttık
          fontWeight: "bold",
        }}
      />

      {meta.error && meta.touched && (
        <Image
          source={redAlert}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -10 }],
            width: 20,
            height: 20,
          }}
        />
      )}
    </View>
  );
}
