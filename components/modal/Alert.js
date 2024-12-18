import { View, Text, Animated } from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAlert, setAlert } from "../../features/appSlice";

const Alert = () => {
  const alert = useSelector(selectAlert);
  const dispatch = useDispatch();
  
  // Animated value for position (X-axis)
  const translateX = new Animated.Value(300); // Start off the screen (right side)

  useEffect(() => {
    if (alert.visible) {
      // Slide in from right to left
      Animated.timing(translateX, {
        toValue: 0, // End value, at the center (visible)
        duration: 300, // Duration of the slide-in animation
        useNativeDriver: true,
      }).start();

      // After 3 seconds, slide out to the right and hide the alert
      const timeout = setTimeout(() => {
        Animated.timing(translateX, {
          toValue: 300, // Move off the screen (right side)
          duration: 300, // Duration of the slide-out animation
          useNativeDriver: true,
        }).start();

        // Hide the alert after the animation ends
        setTimeout(() => {
          dispatch(setAlert({ visible: false, message: "", type: "" }));
        }, 300); // Delay hiding after the animation completes
      }, 3000); // Wait for 3 seconds before starting the slide-out animation

      // Clean up the timeout on unmount or alert visibility change
      return () => clearTimeout(timeout);
    }
  }, [alert.visible, dispatch, translateX]);

  return (
    <>
      {alert.visible && (
        <Animated.View
          style={{
            transform: [{ translateX }],
            position: "absolute",
            top: 4,
            right: 4,
            width: 300, // You can adjust the width as needed
            padding: 16,
            borderRadius: 10,
            backgroundColor: "white", // You can change the background color as needed
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}
          className="p-4 rounded-lg shadow-lg"
        >
          <Text className="font-bold text-slate-700 text-sm">{alert?.message}</Text>
        </Animated.View>
      )}
    </>
  );
};

export default Alert;
