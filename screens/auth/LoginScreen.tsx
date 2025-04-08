"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { loginWithPhoneAndPassword } from "../../services/auth"

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void
  onForgotPassword: () => void
  onBackPress: () => void
  onOtpLoginPress: () => void
}

export default function LoginScreen({
  onLoginSuccess,
  onForgotPassword,
  onBackPress,
  onOtpLoginPress,
}: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)
    try {
      const userData = await loginWithPhoneAndPassword(phoneNumber, password)
      onLoginSuccess(userData)
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Falha ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Parte superior com o mapa */}
      <View style={styles.mapContainer}>
        <Image source={require("../../assets/map-background.png")} style={styles.mapImage} />
      </View>

      {/* Parte inferior com fundo branco */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.appName}>MapaZZZ</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.label}>Número de Telefone</Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.phonePrefix}>+244</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="923456789"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={9}
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={styles.forgotPasswordText}>Recuperar senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.otpButton} onPress={onOtpLoginPress}>
            <Text style={styles.otpButtonText}>Entrar com código SMS</Text>
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
    height: "30%", // O mapa ocupa aproximadamente 30% da tela
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  phonePrefix: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#e63946",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  otpButton: {
    marginTop: 20,
    padding: 10,
  },
  otpButtonText: {
    color: "#1976d2",
    fontSize: 16,
    textDecorationLine: "underline",
  },
})
