// components/AppToast.tsx
import React from "react";
import { View, Text } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

/**
 * Ce composant configure les différents types de toast
 * et affiche <Toast /> avec cette config.
 * Configuration des toasts :
 * success, error, info, warning, custom
*/

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50", borderRadius: 17 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", borderRadius: 17 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "blue", borderRadius: 17 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#FF6B35", borderRadius: 17 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
      text2Style={{ fontSize: 14 }}
    />
  ),

  // 🎨 Nouveau type Custom
  custom: ({ text1, text2 }: any) => (
    <View
      style={{
        width: "90%",
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
        {text1}
      </Text>
      {text2 ? (
        <Text style={{ color: "white", fontSize: 14, marginTop: 4 }}>
          {text2}
        </Text>
      ) : null}
    </View>
  ),
};

export default function AppToast() {
  return <Toast config={toastConfig} />;
}