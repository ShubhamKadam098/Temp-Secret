import { useMutation } from "@tanstack/react-query";
import { fetchSecret } from "@/lib/api/secret";
import { inputType } from "@/types/inputTypes";

export interface FetchSecretState {
  message: string;
  inputType: inputType;
  contentType: string;
  fileName: string;
  isPasswordRequired: boolean;
  isMessageAvailable: boolean;
}

export interface UseFetchSecretOptions {
  id: string;
}

export function useFetchSecret({ id }: UseFetchSecretOptions) {
  return useMutation<FetchSecretState, Error, string | undefined>({
    mutationFn: async (password?: string) => {
      const response = await fetchSecret({
        id,
        password,
      });

      if (!response.success) {
        throw new Error(response.message || "Error fetching secret");
      }

      if (response.inputType === "link" && response.message) {
        window.location.href = response.message;
        return {
          message: "",
          inputType: "link",
          contentType: "",
          fileName: "",
          isPasswordRequired: false,
          isMessageAvailable: true,
        };
      }

      return {
        message: response.message || "",
        inputType: response.inputType || "text",
        contentType: response.contentType || "",
        fileName: response.fileName || "",
        isPasswordRequired: false,
        isMessageAvailable: true,
      };
    },
    throwOnError: false,
  });
}
