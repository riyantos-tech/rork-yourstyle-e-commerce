import { Stack } from "expo-router";
import React from "react";

export default function CartLayout() {
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
          title: "Shopping Cart",
        }} 
      />
    </Stack>
  );
}
