import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { Formik } from "formik";
import FileInput from "../components/formElements/FileInput";
import Input from "../components/formElements/Input";
import EmailInput from "../components/formElements/EmailInput";
import TouchableButton from "../components/formElements/TouchableButton";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "../features/apiSlice";
import { setCredentials, updateUser } from "../features/authSlice";
import User from "./User";

const Settings = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const [update, { isLoading }] = useUpdateUserMutation();
  const dispatch = useDispatch();
  console.log(user?._id, "sadık");
  const handleSubmit = async (values) => {
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
      formData.append("id", user._id);

      console.log(formData.id);
      const data = await update({ id: user?._id, formData }).unwrap();
      console.log(data?.new, "data");
      dispatch(
        updateUser({
          // Mevcut accessToken veya gerekli diğer bilgiler
          ...data.new, // Mevcut user bilgileri ve güncellenen alanlar
        })
      );
      navigation.navigate("TabNav", {
        screen: "User",
      });
    } catch (error) {
      console.log(error);
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
              username: user.username,
              password: "",
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              file: user.profileImage,
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

                <TouchableButton title={"Kaydet"} func={handleSubmit} />
              </View>
            )}
          </Formik>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Settings;
