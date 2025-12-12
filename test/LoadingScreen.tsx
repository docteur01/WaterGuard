import { View, ActivityIndicator, StyleSheet } from "react-native"
import { Text } from "react-native-paper"

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B00" />
      <Text style={styles.text}>Chargement...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
})
