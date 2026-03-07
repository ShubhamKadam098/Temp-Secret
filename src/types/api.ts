import { inputType } from "@/types/inputTypes";

export interface Secret {
  id: string;
  inputType: inputType;
  encryptedContent: string | null;
  iv: string | null;
  filePath: string | null;
  contentType: string | null;
  password: string | null;
  createdAt?: string;
}

export interface AddSecretPayload {
  inputType: inputType;
  encryptedContent?: string;
  iv?: string;
  filePath?: string;
  contentType?: string;
  password?: string;
}

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

export interface CreateSecretTextRequest {
  inputType: "text";
  input: string;
  password?: string;
}

export interface CreateSecretLinkRequest {
  inputType: "link";
  input: string;
  password?: string;
}

export interface CreateSecretFileRequest {
  inputType: "file";
  input: File;
  password?: string;
}

export type CreateSecretRequest = 
  | CreateSecretTextRequest 
  | CreateSecretLinkRequest 
  | CreateSecretFileRequest;

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
