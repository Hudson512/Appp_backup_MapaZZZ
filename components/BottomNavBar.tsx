import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type NavItem = "mapa" | "reportar" | "comunidade" | "quiz"

interface BottomNavBarProps {
  activeItem: NavItem
  onItemPress: (item: NavItem) => void
}

export default function BottomNavBar({ activeItem, onItemPress }: BottomNavBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navItem, activeItem === "mapa" && styles.activeNavItem]}
        onPress={() => onItemPress("mapa")}
      >
        <Ionicons name="location" size={24} color={activeItem === "mapa" ? "#fff" : "#e63946"} />
        <Text style={[styles.navText, activeItem === "mapa" && styles.activeNavText]}>Mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeItem === "reportar" && styles.activeNavItem]}
        onPress={() => onItemPress("reportar")}
      >
        <Ionicons name="camera" size={24} color={activeItem === "reportar" ? "#fff" : "#e63946"} />
        <Text style={[styles.navText, activeItem === "reportar" && styles.activeNavText]}>Reportar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeItem === "comunidade" && styles.activeNavItem]}
        onPress={() => onItemPress("comunidade")}
      >
        <Ionicons name="people" size={24} color={activeItem === "comunidade" ? "#fff" : "#e63946"} />
        <Text style={[styles.navText, activeItem === "comunidade" && styles.activeNavText]}>Comunidade</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeItem === "quiz" && styles.activeNavItem]}
        onPress={() => onItemPress("quiz")}
      >
        <Ionicons name="cube" size={24} color={activeItem === "quiz" ? "#fff" : "#e63946"} />
        <Text style={[styles.navText, activeItem === "quiz" && styles.activeNavText]}>Quiz</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeNavItem: {
    backgroundColor: "#e63946",
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: "#e63946",
  },
  activeNavText: {
    color: "#fff",
  },
})
