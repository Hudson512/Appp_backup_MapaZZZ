"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, StatusBar, Alert, Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"

// Telas de autenticação
import WelcomeScreen from "./screens/auth/WelcomeScreen"
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import OtpLoginScreen from "./screens/auth/OtpLoginScreen"

// Telas do aplicativo
import HomeScreen from "./screens/HomeScreen"
import FormScreen from "./screens/FormScreen"

// Serviços
import { type User, loginWithGoogle } from "./services/auth"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authScreen, setAuthScreen] = useState<"welcome" | "login" | "register" | "otp">("welcome")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"home" | "form">("home")

  // Verificar se o usuário já está logado e solicitar permissões
  useEffect(() => {
    const initialize = async () => {
      try {
        // Verificar usuário logado
        const userData = await AsyncStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }

        // Solicitar permissões da câmera
        if (Platform.OS !== "web") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync()
          if (status !== "granted") {
            console.log("Permissão da câmera não concedida")
          }
        }
      } catch (error) {
        console.error("Erro na inicialização:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  // Função para salvar o usuário no AsyncStorage
  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
    }
  }

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
      setAuthScreen("welcome")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Funções para navegação entre telas de autenticação
  const goToLogin = () => setAuthScreen("login")
  const goToRegister = () => setAuthScreen("register")
  const goToOtpLogin = () => setAuthScreen("otp")
  const goToWelcome = () => setAuthScreen("welcome")

  // Funções para autenticação
  const handleLoginSuccess = (userData: User) => {
    saveUser(userData)
    setCurrentScreen("home")
  }

  const handleGoogleLogin = async () => {
    try {
      const userData = await loginWithGoogle()
      saveUser(userData)
      setCurrentScreen("home")
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error)
    }
  }

  // Funções para o fluxo principal do app
  const handleOpenCamera = async () => {
    try {
      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!cameraResult.canceled && cameraResult.assets && cameraResult.assets.length > 0) {
        setSelectedImage(cameraResult.assets[0].uri)
        setCurrentScreen("form")
      }
    } catch (error) {
      console.error("Erro ao abrir câmera:", error)
      Alert.alert("Erro", "Não foi possível abrir a câmera. Por favor, verifique as permissões do aplicativo.")
    }
  }

  const handleImageSelected = (uri: string) => {
    setSelectedImage(uri)
    setCurrentScreen("form")
  }

  const handleBack = () => {
    setSelectedImage(null)
    setCurrentScreen("home")
  }

  const handleComplete = () => {
    setSelectedImage(null)
    setCurrentScreen("home")
  }

  // Renderização condicional baseada no estado de autenticação
  if (isLoading) {
    return <View style={styles.container} />
  }

  if (!user) {
    // Fluxo de autenticação
    switch (authScreen) {
      case "login":
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={() => {}}
            onBackPress={goToWelcome}
            onOtpLoginPress={goToOtpLogin}
          />
        )
      case "register":
        return (
          <RegisterScreen
            onRegisterSuccess={handleLoginSuccess}
            onBackPress={goToWelcome}
            onGooglePress={handleGoogleLogin}
          />
        )
      case "otp":
        return <OtpLoginScreen onLoginSuccess={handleLoginSuccess} onBackPress={goToLogin} />
      default:
        return (
          <WelcomeScreen
            onLoginPress={goToLogin}
            onRegisterPress={goToRegister}
            onAnonymousPress={() => {
              // Para login anônimo, criamos um usuário com token fictício
              setUser({ id: "anonymous", name: "Anônimo", email: "", token: "anonymous-token", is_anonymous: true })
              setCurrentScreen("home")
            }}
          />
        )
    }
  }

  // Fluxo principal do app (usuário autenticado)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {currentScreen === "form" && selectedImage ? (
        <FormScreen imageUri={selectedImage} onBack={handleBack} onComplete={handleComplete} token={user.token} />
      ) : (
        <HomeScreen onImageSelected={handleImageSelected} onLogout={handleLogout} user={user} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})
