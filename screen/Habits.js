import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useGetHabitsQuery } from '../features/mainSlice';
const Habits = () => {
  const {data:habits,isLoading}=useGetHabitsQuery()
  const bottomSheetModalRef = useRef(null);
console.log(habits,"habits")
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleCloseModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const snapPoints = useMemo(() => ["25%","50%", "90%"], []);


  return (
    <Pressable className="flex-1 p-6 justify-center bg-slate-300" onPress={handleCloseModal}>
      <BottomSheetModalProvider>
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}  
          enableDynamicSizing={false}
          onChange={handleSheetChanges}
        >
          {/* NativeWind ile className kullanımı */}
          <BottomSheetView className="flex-1 items-center justify-center ">
            <View className="w-full h-full bg-red-500 p-4">
              <Text>Modal Content</Text>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Pressable>
  );
};

export default Habits;
