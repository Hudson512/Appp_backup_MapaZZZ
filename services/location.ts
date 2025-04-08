import * as Location from "expo-location"

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
}

export async function getCurrentLocation(): Promise<LocationData> {
  // Solicitar permissões de localização
  const { status } = await Location.requestForegroundPermissionsAsync()

  if (status !== "granted") {
    throw new Error("Permissão para acessar a localização foi negada")
  }

  // Obter a localização atual
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  })

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy,
  }
}

