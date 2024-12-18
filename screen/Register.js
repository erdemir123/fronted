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
import { useLoginMutation, useRegisterMutation } from "../features/apiSlice";
import { useNavigation } from "@react-navigation/native";
import loginImage from "../assets/login.png";
import { Formik } from "formik";
import Input from "../components/formElements/Input";
import TouchableButton from "../components/formElements/TouchableButton";
import { setAlert } from "../features/appSlice";
import LinearGradient from "react-native-linear-gradient";
import FileInput from "../components/formElements/FileInput";
import EmailInput from "../components/formElements/EmailInput";

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (values) => {
    console.log(values.profileImage, "values.file"); // Form verilerini görmek için

    try {
      // FormData oluşturuluyor
      const formData = new FormData();

      // Dosya bilgilerini al ve uygun şekilde formatla
      if (values.profileImage) {
        const fileUri = values.profileImage;
        const fileName = fileUri.split("/").pop(); // Dosya adını al
        const fileType = "image/jpeg"; // Dosya türünü belirtin (örneğin: 'image/jpeg' veya 'image/png')

        formData.append("profileImage", {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
      }

      formData.append("email", values.email);
      

      formData.append("firstName", values.firstName);
      
      formData.append("lastName", values.lastName);
      formData.append("password", values.password);
      formData.append("username", values.username);

      console.log(formData);

      const data = await register(formData).unwrap();
      dispatch(
        setAlert({
          visible: true,
          message: "Kayıt Başarılı.",
          type: "success",
        })
      );
      setTimeout(() => {

          data.error === false && navigation.navigate("Login");
    },3000)
    } catch (error) {
      dispatch(
        setAlert({
          visible: true,
          message: "Bir hata oluştu.",
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
          <Formik
            initialValues={{
              username: "",
              password: "",
              firstName: "",
              lastName: "",
              email: "",
              file: "",
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
                <FileInput name="profileImage" label="Profil Resmi" />
                <Input name="firstName" label="First Name" />
                <Input name="lastName" label="Last Name" />
                <Input name="username" label="User Name" />
                <EmailInput name="email" label="E-mail" />
                <Input name="password" label="Password" secureTextEntry />

                <TouchableButton title={"Kayıt Ol"} func={handleSubmit} />
              </View>
            )}
          </Formik>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
