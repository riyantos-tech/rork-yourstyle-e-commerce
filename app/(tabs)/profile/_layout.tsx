import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '700' as const,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Profile",
        }} 
      />
      <Stack.Screen 
        name="orders" 
        options={{ 
          title: "My Orders",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}
