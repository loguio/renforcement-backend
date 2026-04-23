import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider as PaperProvider } from "react-native-paper";
import { UserProvider } from "@/app/context/user-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <PaperProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Homepage" }} />
          <Stack.Screen name="login" options={{ title: "Connexion" }} />
          <Stack.Screen name="sinistre/[id]" options={{ title: "Sinistre" }} />
        </Stack>
        <StatusBar style="auto" />
      </UserProvider>
    </PaperProvider>
  );
}
