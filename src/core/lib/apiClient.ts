import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// Obtener la URL del API desde variables de entorno
// En desarrollo: usa localhost
// En producción: usa la variable de entorno VITE_API_URL configurada en Vercel
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000/api"
    : "https://recipe-app-gamma-gold.vercel.app/api");

// Create a custom type that returns data directly instead of AxiosResponse
interface CustomAxiosInstance
  extends Omit<AxiosInstance, "get" | "post" | "put" | "patch" | "delete"> {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

const apiClient: CustomAxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
}) as CustomAxiosInstance;

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(
        `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }
    return response.data;
  },
  (error: AxiosError) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      console.error("❌ 401 Unauthorized - Limpiando token");
      localStorage.removeItem("authToken");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Log de errores
    console.error(
      `❌ API Error ${error.response?.status}:`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export const setAuthToken = (token?: string) => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

export const uploadBlobImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await (apiClient.post("/recipe/blob/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }) as any);

  return response.blob.url;
};

export default apiClient;
