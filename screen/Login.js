import React from "react";
import {
  View,
  Button,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useLoginMutation } from "../features/apiSlice";
import { useNavigation } from "@react-navigation/native";
import loginImage from "../assets/login.png";
import { Formik } from "formik";
import Input from "../components/formElements/Input";
import TouchableButton from "../components/formElements/TouchableButton";
import { setAlert } from "../features/appSlice";
import LinearGradient from "react-native-linear-gradient";

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values) => {
    try {
      const data = await login(values).unwrap();
      console.log(data, "data");
      dispatch(setCredentials(data));
      
    } catch (error) {
      dispatch(
        setAlert({
          visible: true,
          message: "Kullanıcı adı veya şifre hatalı.",
          type: "danger",
        })
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* TouchableWithoutFeedback ile klavyeyi kapatma */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={["#AFDAEA", "#144677"]} // Açık renk - Koyu renk geçişi
          start={{ x: 1, y: 0 }} // Başlangıç noktası
          end={{ x: 0, y: 1 }} // Bitiş noktası
          className="flex-1 justify-center items-center bg-[#AFDAEA]"
        >
          <Image source={loginImage} style={{ width: 320, height: 350 }} />
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleSubmit} // Formik submit fonksiyonu
            className="mb-4"
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="w-full">
                {/* Email Input */}
                <Input name="username" label="User Name" />

                {/* Password Input */}
                <Input name="password" label="Password" secureTextEntry />

                {/* Submit Button */}
                <TouchableButton
                  title={isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  func={handleSubmit}
                />
                <TouchableButton
                  title={"Kayıt Ol"}
                  func={() => navigation.navigate("Register")}
                />
              </View>
            )}
          </Formik>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
