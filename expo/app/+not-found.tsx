import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PackageX } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <PackageX color="#ddd" size={80} />
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>This page doesn&apos;t exist</Text>

        <Link href="/(tabs)/(home)" style={styles.link}>
          <Text style={styles.linkText}>Go to home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  link: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: '600' as const,
  },
});
