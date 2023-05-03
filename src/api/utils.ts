import {
  deleteTokens,
  getAuthRefreshToken,
  getAuthToken,
  setAuthTokens,
} from "@/utils/cookies";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export type ErrorResponseObject = {
  success: boolean;
  error: {
    code: string;
    title: string;
  };
};

export type SuccessResponse<T = unknown> = {
  success: boolean;
  data: T;
};

//Standard JSON response
// {
//     success: true;
//     data: T;
//     meta: {[key: string] : string}
// }

type StandardJSONResponse<T = unknown> = SuccessResponse<T> & {
  axiosResponse: AxiosResponse;
};

export const apiConfig = axios.create({
  baseURL: "http://127.0.0.1:8080/v1",
  headers: {
    "Content-Type": "application/json",
    "App-Type": "app",
  },
  withCredentials: true,
});

apiConfig.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequestConfig = error.config;

    if (error.response.status === 403 && !originalRequestConfig._retry) {
      originalRequestConfig._retry = true;

      try {
        const refreshToken = getAuthRefreshToken();

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const res = await apiConfig.post("/user/refreshToken", {
          refreshToken,
        });
        const { token, refreshToken: newRefreshToken } = res.data;
        setAuthTokens(token, newRefreshToken);
        return await apiConfig(originalRequestConfig);
      } catch {
        deleteTokens();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export const fetchApi = async <T = unknown>(
  path: string,
  config: AxiosRequestConfig
): Promise<StandardJSONResponse<T>> => {
  try {
    const apiResponse: AxiosResponse<any> = await apiConfig({
      ...config,
      url: path,
    });
    return {
      ...apiResponse.data,
      axiosResponse: apiResponse,
    };
  } catch (err: any) {
    err.message = err.response?.data?.error.message || err.message || "";
    throw err;
  }
};
