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
  ScrollView,
} from "react-native"

interface RegisterScreenProps {
  onRegisterSuccess: () => void
  onBackPress: () => void
  onGooglePress: () => void
}

export default function RegisterScreen({ onRegisterSuccess, onBackPress, onGooglePress }: RegisterScreenProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePhoto, setProfilePhoto] = useState("1") // Default profile photo
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem")
      return
    }

    setIsLoading(true)
    try {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+244${phoneNumber}`

      const response = await fetch("https://api-dota-3nri.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone_number: formattedPhone,
          email,
          password,
          profile: "user",
          profile_photo: profilePhoto,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Falha ao criar conta")
      }

      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.", [
        { text: "OK", onPress: onBackPress },
      ])
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Falha ao criar conta. Tente novamente.")
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

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

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
                placeholder="************"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="************"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <Text style={styles.label}>Foto de Perfil</Text>
              <View style={styles.profilePhotoContainer}>
                <TouchableOpacity
                  style={[styles.photoOption, profilePhoto === "1" && styles.selectedPhotoOption]}
                  onPress={() => setProfilePhoto("1")}
                >
                  <Text style={styles.photoOptionText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.photoOption, profilePhoto === "2" && styles.selectedPhotoOption]}
                  onPress={() => setProfilePhoto("2")}
                >
                  <Text style={styles.photoOptionText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.photoOption, profilePhoto === "3" && styles.selectedPhotoOption]}
                  onPress={() => setProfilePhoto("3")}
                >
                  <Text style={styles.photoOptionText}>3</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>Criar Conta</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
              <Image source={require("../../assets/google-icon.png")} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continuar com o Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    height: "20%", // O mapa ocupa menos espaço na tela de cadastro
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
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    alignItems: "center",
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
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
  profilePhotoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  photoOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedPhotoOption: {
    borderColor: "#e63946",
    borderWidth: 2,
  },
  photoOptionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#e63946",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    width: "100%",
    maxWidth: 350,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
  },
})
