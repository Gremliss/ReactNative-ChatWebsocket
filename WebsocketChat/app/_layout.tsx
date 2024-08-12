import { Stack } from "expo-router";
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  return (
    <Stack
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: "Chat",
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
          },
          headerTintColor: Colors[colorScheme ?? 'light'].text, // Text color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
