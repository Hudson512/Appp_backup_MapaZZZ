"use client"
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native"

interface WelcomeScreenProps {
  onLoginPress: () => void
  onRegisterPress: () => void
  onAnonymousPress: () => void
}

export default function WelcomeScreen({ onLoginPress, onRegisterPress, onAnonymousPress }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Parte superior com o mapa */}
      <View style={styles.mapContainer}>
        <Image source={require("../../assets/map-background.png")} style={styles.mapImage} />
      </View>

      {/* Parte inferior com fundo branco */}
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.appName}>MapaZZZ</Text>
        </View>

        <Text style={styles.subtitle}>Where does it come from?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
            <Text style={styles.buttonText}>Cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onLoginPress}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity onPress={onAnonymousPress}>
            <Text style={styles.anonymousText}>Reportar de forma anônima</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapContainer: {
    height: "45%", // O mapa ocupa aproximadamente 45% da tela
    width: "100%",
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#e63946",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
  anonymousText: {
    color: "#1976d2",
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
})
