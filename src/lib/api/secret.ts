import axios from "axios";
import {
  FetchSecretRequest,
  FetchSecretResponse,
  CreateSecretRequest,
  CreateSecretResponse,
} from "@/types/api";

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

export const createSecret = async (
  data: CreateSecretRequest
): Promise<CreateSecretResponse> => {
  const formData = new FormData();
  formData.append("inputType", data.inputType);

  if (data.inputType === "file" && data.input instanceof File) {
    formData.append("file", data.input);
  } else {
    formData.append("input", data.input as string);
  }

  if (data.password) {
    formData.append("password", data.password);
  }

  const res = await axios.post<CreateSecretResponse>("/api/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
