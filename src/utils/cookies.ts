import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const setAuthTokens = (token: string, refreshToken: string) => {
  setCookie("token", token, { maxAge: 14400 });
  setCookie("refreshToken", refreshToken, { maxAge: 604800 });
};

export const deleteTokens = () => {
  deleteCookie("token");
  deleteCookie("refreshToken");
};

export const getAuthToken = () => getCookie("token");

export const getAuthRefreshToken = () => getCookie("refreshToken");
