import { inputType } from "@/types/inputTypes";

export interface FetchSecretRequest {
  id: string;
  password?: string;
}

export interface FetchSecretResponse {
  success: boolean;
  message?: string;
  inputType?: inputType;
  contentType?: string;
  fileName?: string;
}

export interface CreateSecretRequest {
  inputType: inputType;
  input: File | string;
  password?: string;
}

export interface CreateSecretResponse {
  success: boolean;
  message?: string;
  link?: string;
}

export interface ApiError {
  response?: {
    status: number;
  };
  message?: string;
}
