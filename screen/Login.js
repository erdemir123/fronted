import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useLoginMutation } from "../features/apiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    // const data = await login({ username, password }).unwrap();
    try {
      const data = await login({ username, password }).unwrap();
      console.log(data, "data");
      dispatch(setCredentials(data));
      navigation.navigate("User");
      
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Giriş Başarısız", "Kullanıcı adı veya şifre hatalı.");
    }
  };

  return (
    <View className="bg-red-500">
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı Adı"
        required
        className="border border-slate-400 py-2"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
        className="bg-paradise-400 text-red-500 place-content-center"
        required
      />
      <Button
        title={isLoading ? "Yükleniyor..." : "Giriş Yap"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
      {/* Bu metni bir Text bileşeni içine aldım */}
      <Text style={{ marginTop: 20 }}>Uygulamaya Hoş Geldinizs!</Text>
    </View>
  );
};

export default Login;
