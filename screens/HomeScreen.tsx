"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from "react-native"
import MapView, { Marker, Circle } from "react-native-maps"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import type { User } from "../services/auth"
import BottomNavBar from "../components/BottomNavBar"
import { combineOverlappingCircles, calculateDistance } from "../services/map_settings/circleUtils";

interface HomeScreenProps {
  onImageSelected: (uri: string) => void
  onLogout: () => void
  user: User
}

export default function HomeScreen({ onImageSelected, onLogout, user }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapZoom, setMapZoom] = useState(0.0922); // Estado para rastrear o zoom (latitudeDelta)

  const clusters = [
    { location: { latitude: -8.896, longitude: 13.234 }, intensity: 2.1, count: 10, highestRisk: "confirmed" },
    { location: { latitude: -8.843, longitude: 13.267 }, intensity: 1.2, count: 5, highestRisk: "high" },
    { location: { latitude: -8.850, longitude: 13.250 }, intensity: 0.6, count: 3, highestRisk: "low" },
  ];

  // Solicitar permissões da câmera quando o componente montar
  useEffect(() => {
    ;(async () => {
      try {
        if (Platform.OS !== "web") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync()
          if (status !== "granted") {
            Alert.alert("Permissão necessária", "Precisamos da permissão da câmera para tirar fotos.")
          }
        }
      } catch (error) {
        console.error("Erro ao solicitar permissões da câmera:", error)
      }
    })()
  }, [])

  // Função para lidar com a navegação
  const handleNavigation = (item: "mapa" | "reportar" | "comunidade" | "quiz") => {
    if (item === "reportar") {
      handleOpenCamera()
    }
    // Implementar navegação para outras telas quando necessário
  }

  // Função para abrir a câmera
  const handleOpenCamera = async () => {
    try {
      // Verificar se estamos no Android e usar a API correta
      let permissionResult

      if (Platform.OS === "android") {
        permissionResult = { granted: true } // Já solicitamos no useEffect
      } else {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      }

      if (!permissionResult.granted) {
        Alert.alert("Erro", "Permissão para usar a câmera é necessária!")
        return
      }

      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!cameraResult.canceled && cameraResult.assets && cameraResult.assets.length > 0) {
        onImageSelected(cameraResult.assets[0].uri)
      }
    } catch (error) {
      console.error("Erro ao abrir câmera:", error)
      Alert.alert("Erro", "Não foi possível abrir a câmera. Por favor, verifique as permissões do aplicativo.")
    }
  }

  // Função para determinar a cor com base na intensidade
  const getIntensityColor = (intensity: number) => {
    if (intensity > 1.5) return "rgba(255, 0, 0, 0.53)"; // Vermelho
    if (intensity > 1.0) return "rgba(255, 157, 0, 0.47)"; // Laranja
    if (intensity > 0.5) return "rgba(255, 225, 0, 0.56)"; // Amarelo
  }

  const combinedClusters = combineOverlappingCircles(clusters);

  // Função para calcular o raio ajustado com base no zoom
  const getAdjustedRadius = (intensity: number) => {
    const baseRadius = 800; // Raio base
    const zoomFactor = mapZoom / 0.0922; // Cálculo invertido com base no zoom inicial
    const adjustedRadius = baseRadius * zoomFactor;

    // Limitar o tamanho do círculo
    const minRadius = 100; // Raio mínimo
    const maxRadius = 1000; // Raio máximo
    return Math.max(minRadius, Math.min(adjustedRadius, maxRadius));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Cabeçalho com pesquisa e perfil */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={
              user.profile_photo
                ? { uri: `https://api-dota-3nri.onrender.com/profile/${user.profile_photo}.png` }
                : require("../assets/default-avatar.png")
            }
            style={styles.profileImage}
          />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>1</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onLogout}>
            <Ionicons name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mapa com círculos coloridos */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -8.838333,
            longitude: 13.234444,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChangeComplete={(region) => {
            setMapZoom(region.latitudeDelta); // Atualizar o zoom com base no latitudeDelta
          }}
        >
          {/* Renderizar clusters combinados */}
          {combinedClusters.map((cluster, index) => (
            <Circle
              key={`cluster-${index}`}
              center={cluster.location}
              radius={getAdjustedRadius(cluster.intensity)} // Ajustar o raio dinamicamente
              fillColor={getIntensityColor(cluster.intensity)}
              strokeWidth={0}
            />
          ))}

          {combinedClusters.map((cluster, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={cluster.location}
              title={`Risco: ${cluster.highestRisk}`}
              description={`Relatórios: ${cluster.count}`}
            />
          ))}
        </MapView>
      </View>

      {/* Barra de navegação inferior */}
      <BottomNavBar activeItem="mapa" onItemPress={handleNavigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  iconButton: {
    padding: 5,
    marginLeft: 5,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e63946",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
