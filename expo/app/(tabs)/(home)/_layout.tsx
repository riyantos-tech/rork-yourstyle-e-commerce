import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
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
          title: "YourStyle",
          headerLargeTitle: true,
        }} 
      />
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          title: "Product Details",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}
