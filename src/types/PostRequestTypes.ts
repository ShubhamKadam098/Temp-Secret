import { inputType } from "@/types/inputTypes";

export interface PostRequest extends Request {
  inputType: inputType;
  input: File | string;
  password?: string;
}
