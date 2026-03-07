import axios, { AxiosError } from "axios";
import {
  FetchSecretRequest,
  FetchSecretResponse,
  CreateSecretRequest,
  CreateSecretResponse,
  ApiError,
} from "@/types/api";

export const isRateLimitError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 429;
  }
  return false;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 429) {
      return "Too many requests. Please try again later.";
    }
    return error.response?.data?.message || "An error occurred";
  }
  return "An unexpected error occurred";
};

export const fetchSecret = async ({
  id,
  password,
}: FetchSecretRequest): Promise<FetchSecretResponse> => {
  const res = await axios.post<FetchSecretResponse>("/api/secret", {
    id,
    password,
  });
  return res.data;
};

export const createSecretText = async (
  input: string,
  password?: string
): Promise<CreateSecretResponse> => {
  const formData = new FormData();
  formData.append("inputType", "text");
  formData.append("input", input);
  if (password) formData.append("password", password);

  const res = await axios.post<CreateSecretResponse>("/api/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const createSecretLink = async (
  input: string,
  password?: string
): Promise<CreateSecretResponse> => {
  const formData = new FormData();
  formData.append("inputType", "link");
  formData.append("input", input);
  if (password) formData.append("password", password);

  const res = await axios.post<CreateSecretResponse>("/api/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const createSecretFile = async (
  input: File,
  password?: string
): Promise<CreateSecretResponse> => {
  const formData = new FormData();
  formData.append("inputType", "file");
  formData.append("file", input);
  if (password) formData.append("password", password);

  const res = await axios.post<CreateSecretResponse>("/api/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
