// Tipos para autenticação
export interface User {
  id?: string
  name?: string
  email?: string
  phone_number?: string
  token: string
  profile_photo?: string
  profile?: string
  reports_count?: number
  reports_received_count?: number
  points?: number
  titulo?: string
  nivel?: number
  is_anonymous?: boolean
}

// Função para login com número de telefone e senha
export async function loginWithPhoneAndPassword(phoneNumber: string, password: string): Promise<User> {
  try {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+244${phoneNumber}`

    const response = await fetch("https://api-dota-3nri.onrender.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: formattedPhone,
        password,
      }),
    })

    const data = await response.json()
    console.log("Resposta da API de login:", data)

    if (!response.ok || !data.sucesso) {
      throw new Error(data.message || "Falha ao fazer login")
    }

    // Verificar se a estrutura da resposta está correta
    if (!data.dados || !data.dados.token || !data.dados.usuario) {
      throw new Error("Formato de resposta inválido")
    }

    // Extrair dados do usuário e token
    const { usuario, token } = data.dados

    // Criar objeto de usuário com os dados recebidos
    const userData: User = {
      id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      phone_number: usuario.phone_number,
      token: token,
      profile_photo: usuario.profile_photo,
      profile: usuario.profile,
      reports_count: usuario.reports_count,
      reports_received_count: usuario.reports_received_count,
      points: usuario.points,
      titulo: usuario.titulo,
      nivel: usuario.nivel,
      is_anonymous: usuario.is_anonymous || false,
    }

    return userData
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    throw error
  }
}

// Função para registrar um novo usuário
export async function registerUser(
  name: string,
  email: string,
  phoneNumber: string,
  password: string,
  profilePhoto = "1",
): Promise<boolean> {
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

    return true
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    throw error
  }
}

// Função para simular login com Google
export async function loginWithGoogle(): Promise<User> {
  // Em uma aplicação real, você usaria o Expo AuthSession ou react-native-google-signin
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "google-user-123",
        name: "Usuário Google",
        email: "usuario@gmail.com",
        token: "google-token-123",
      })
    }, 1000)
  })
}

// Função para enviar código OTP
export async function sendOtp(phoneNumber: string): Promise<boolean> {
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

    return true
  } catch (error) {
    console.error("Erro ao enviar OTP:", error)
    return false
  }
}

// Função para verificar código OTP
export async function verifyOtp(phoneNumber: string, code: string): Promise<User | null> {
  try {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+244${phoneNumber}`

    const response = await fetch("http://localhost:3000/api/otp/verify", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: formattedPhone, code }),
    })

    if (!response.ok) {
      throw new Error("Código inválido")
    }

    // Em uma aplicação real, você receberia os dados do usuário na resposta
    return {
      id: "phone-user-123",
      name: "Usuário Telefone",
      email: "",
      phone_number: formattedPhone,
      token: "otp-token-123",
    }
  } catch (error) {
    console.error("Erro ao verificar OTP:", error)
    return null
  }
}

// Função para fazer requisições autenticadas
export async function authenticatedFetch(url: string, options: RequestInit = {}, token: string): Promise<Response> {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
