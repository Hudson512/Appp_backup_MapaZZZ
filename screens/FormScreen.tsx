"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import Slider from "@react-native-community/slider"
import { sendReport } from "../services/api"
import { getCurrentLocation, type LocationData } from "../services/location"

interface FormScreenProps {
  imageUri: string
  onBack: () => void
  onComplete: () => void
}

export default function FormScreen({ imageUri, onBack, onComplete }: FormScreenProps) {
  const [severityLevel, setSeverityLevel] = useState(0.5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Obter localização ao carregar o componente
  useEffect(() => {
    const getLocation = async () => {
      try {
        const currentLocation = await getCurrentLocation()
        setLocation(currentLocation)
      } catch (error) {
        if (error instanceof Error) {
          setLocationError(error.message)
        } else {
          setLocationError("Erro ao obter localização")
        }
      }
    }

    getLocation()
  }, [])

  const handleSubmit = async () => {
    // Fechar o teclado
    Keyboard.dismiss()

    if (!comment.trim()) {
      Alert.alert("Erro", "Por favor, adicione um comentário.")
      return
    }

    if (!location) {
      Alert.alert("Aviso", "Não foi possível obter sua localização. Deseja enviar o relatório mesmo assim?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: () =>
            submitReport({
              latitude: 0,
              longitude: 0,
              accuracy: 0,
            }),
        },
      ])
      return
    }

    submitReport(location)
  }

  const submitReport = async (locationData: LocationData) => {
    setIsSubmitting(true)
    try {
      await sendReport({
        image: imageUri,
        severityLevel: Math.round(severityLevel * 100),
        comment,
        location: locationData,
      })

      Alert.alert("Sucesso", "Relatório enviado com sucesso!", [{ text: "OK", onPress: onComplete }])
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o relatório. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <View style={styles.backButtonCircle}>
                <Text style={styles.buttonText}>←</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Nivel de Gravidade</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={severityLevel}
                onValueChange={setSeverityLevel}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#000"
                thumbTintColor="#000"
              />

              <Text style={styles.label}>Comentario</Text>
              <TextInput
                style={styles.input}
                placeholder="comentario..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              {locationError && <Text style={styles.locationError}>Aviso: {locationError}</Text>}

              {location && (
                <Text style={styles.locationInfo}>
                  Localização capturada: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Publicar</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    color: "black",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  locationInfo: {
    fontSize: 12,
    color: "green",
    marginBottom: 10,
  },
  locationError: {
    fontSize: 12,
    color: "orange",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#e63946",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
