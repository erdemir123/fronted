import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useAddFcmTokenMutation } from '../features/mainSlice';
import { useSelector } from 'react-redux';

// Token'ı al ve sakla
async function getAndUpdateFcmToken(token,addFcmToken, userId) {
  try {
    // Yerel depolamada token'ı sakla
    const storedToken = await getStoredToken(); // Local storage veya AsyncStorage'dan token al

    // Eğer token farklıysa, yeni token'ı sunucuya gönder
    if (storedToken !== token) {
      await sendTokenToServer(token,addFcmToken, userId);  // Token'ı sunucuya gönder
      await storeToken(token,addFcmToken, userId);  // Yeni token'ı sakla
    }else{
   
    }
  } catch (error) {
    console.error('Token güncelleme hatası:', error);
  }
}

// Sunucuya token'ı gönderme fonksiyonu
async function sendTokenToServer(token,addFcmToken, userId) {
 
  try {
    const response = await addFcmToken({ token, userId }).unwrap();
    console.log('Token sunucuya gönderildi:', response);
  } catch (error) {
    console.error('Token gönderimi başarısız:', error);
  }
}

// Token'ı yerel depolama veya AsyncStorage'da saklamak için fonksiyon
async function storeToken(token,addFcmToken, userId) {
  await AsyncStorage.setItem('fcm_token', token);
  try {
    const response = await addFcmToken({ token, userId });
    console.log('Token sunucuya gönderildi:', response);
  } catch (error) {
    console.error('Token gönderimi başarısız:', error);
  }
}

// Token'ı yerel depolamadan almak için fonksiyon
async function getStoredToken() {
  return await AsyncStorage.getItem('fcm_token');
}

// Custom Hook
const useFcmToken = () => {
  const user = useSelector(state => state.auth.user); // useSelector burada kullanılır
  const [addFcmToken] = useAddFcmTokenMutation(); // useAddFcmTokenMutation burada kullanılır
  useEffect(() => {
    const updateFcmToken = async () => {
      try {
        const token = await messaging().getToken();  // Firebase'den token al
      
        if (user) {
          await getAndUpdateFcmToken(token,addFcmToken, user._id);  // Token'ı güncelle
        }
      } catch (error) {
        console.error('Token alırken hata oluştu:', error);
      }
    };

    // Uygulama açıldığında token'ı kontrol et
    updateFcmToken();

    // Zamanlayıcı ile token'ı belirli aralıklarla güncelle
    const intervalId = setInterval(async () => {
      await updateFcmToken(); // 24 saatte bir token'ı kontrol et ve güncelle
    }, 60 * 1000); // 24 saat

    // Cleanup (component unmount olduğunda interval'ı temizle)
    return () => clearInterval(intervalId);
  }, [user]); // user değiştiğinde token'ı güncelle

};

export default useFcmToken;
