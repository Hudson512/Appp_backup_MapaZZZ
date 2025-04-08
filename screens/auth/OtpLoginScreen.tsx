"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"

interface OtpLoginScreenProps {
  onLoginSuccess: () => void
  onBackPress: () => void
}

export default function OtpLoginScreen({ onLoginSuccess, onBackPress }: OtpLoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const otpInputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null])

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert("Erro", "Por favor, insira um número de telefone válido")
      return
    }

    setIsLoading(true)
    try {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+244${phoneNumber}`

      const response = await fetch("http://localhost:3000/api/otp/send", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar o código OTP")
      }

      setOtpSent(true)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o código. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert("Erro", "Por favor, insira o código de 6 dígitos")
      return
    }

    setIsLoading(true)
    try {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+244${phoneNumber}`

      const response = await fetch("http://localhost:3000/api/otp/verify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhone, code: otpCode }),
      })

      if (!response.ok) {
        throw new Error("Código inválido")
      }

      onLoginSuccess()
    } catch (error) {
      Alert.alert("Erro", "Código inválido ou expirado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (text: string, index: number) => {
    // Atualiza o valor do OTP
    const newOtp = otpCode.split("")
    newOtp[index] = text
    const newOtpString = newOtp.join("")
    setOtpCode(newOtpString)

    // Move o foco para o próximo input
    if (text && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/map-background.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
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
              <Text style={styles.title}>{otpSent ? "Verificar Código" : "Login com SMS"}</Text>

              {!otpSent ? (
                <>
                  <Text style={styles.description}>
                    Insira seu número de telefone para receber um código de verificação por SMS
                  </Text>
                  <Text style={styles.label}>Número de Telefone</Text>
                  <View style={styles.phoneInputContainer}>
                    <Text style={styles.phonePrefix}>+244</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="953654649"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      maxLength={9}
                    />
                  </View>

                  <TouchableOpacity style={styles.actionButton} onPress={handleSendOtp} disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>Enviar Código</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.description}>
                    Enviamos um código de 6 dígitos para{" "}
                    {phoneNumber.startsWith("+") ? phoneNumber : `+244${phoneNumber}`}
                  </Text>
                  <Text style={styles.label}>Código de Verificação</Text>
                  <View style={styles.otpContainer}>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpInputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleOtpChange(text, index)}
                        value={otpCode[index] || ""}
                      />
                    ))}
                  </View>

                  <TouchableOpacity style={styles.actionButton} onPress={handleVerifyOtp} disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>Verificar</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp} disabled={isLoading}>
                    <Text style={styles.resendButtonText}>Reenviar Código</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.8,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    justifyContent: "center",
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
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
    marginBottom: 20,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#e63946",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  resendButtonText: {
    color: "#1976d2",
    fontSize: 14,
  },
})
