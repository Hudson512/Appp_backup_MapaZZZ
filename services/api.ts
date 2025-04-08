import type { ReportData } from "../types"

// URL base da API
const API_URL = "url..."

export async function sendReport(data: ReportData): Promise<void> {
  try {
    // Criar um FormData para enviar a imagem
    const formData = new FormData()

    // Adicionar a imagem
    formData.append("image", {
      uri: data.image,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any)

    // Adicionar outros dados
    //formData.append("severityLevel", data.severityLevel.toString())
    formData.append("comment", data.comment)

    // Adicionar dados de localização
    formData.append("latitude", data.location.latitude.toString())
    formData.append("longitude", data.location.longitude.toString())
    if (data.location.accuracy) {
      formData.append("accuracy", data.location.accuracy.toString())
    }

    // Enviar para a API
    const response = await fetch(`${API_URL}/reports`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (!response.ok) {
      throw new Error("Falha ao enviar relatório")
    }
  } catch (error) {
    console.error("Erro ao enviar relatório:", error)
    throw error
  }
}
