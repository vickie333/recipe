import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://recipe-app-gamma-gold.vercel.app/api";

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
}) as CustomAxiosInstance;

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
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
