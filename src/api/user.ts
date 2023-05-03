import { Roles } from "@/vars/roles";
import { fetchApi } from "./utils";

type RequestAccessTokenParams = { email: string; firebaseToken: string };
type RequestAccessTokenResult = { token: string; refreshToken: string };

export const requestToken = async ({
  email,
  firebaseToken,
}: RequestAccessTokenParams) => {
  const { data } = await fetchApi<RequestAccessTokenResult>("/user/login", {
    method: "POST",
    data: {
      email,
      firebaseToken,
    },
  });
  return data;
};

type CreateAccountParams = {
  name: string;
  email: string;
  country: string;
  role: string;
  firebaseToken: string;
};
type CreateAccountResult = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  refreshToken: string;
};
export const createAccount = async ({
  name,
  email,
  role,
  country,
  firebaseToken,
}: CreateAccountParams) => {
  const { data } = await fetchApi<CreateAccountResult>("/user/signup", {
    method: "POST",
    data: {
      name,
      email,
      role,
      country,
      firebaseToken,
    },
  });
  return data;
};

type RefreshAccessTokenParams = {
  refreshToken: string;
};
export const refreshAccessToken = async ({
  refreshToken,
}: RefreshAccessTokenParams) => {
  const { data } = await fetchApi<RequestAccessTokenResult>("/refreshToken", {
    method: "POST",
    data: {
      refreshToken,
    },
  });
  return data;
};

type GetMeResult = { _id: string; name: string; email: string; role: Roles };
export const getMe = async () => {
  const { data } = await fetchApi<GetMeResult>("/me", {
    method: "GET",
  });
  return data;
};
