"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, FileText, Upload, X } from "lucide-react";
import { createSecretFile, getErrorMessage, isRateLimitError } from "@/lib/api/secret";
import { fileSecretSchema, FileSecretFormData } from "@/types/schemas";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

interface FileSecretFormProps {
  onSuccess: (link: string) => void;
}

export function FileSecretForm({ onSuccess }: FileSecretFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FileSecretFormData>({
    resolver: zodResolver(fileSecretSchema),
    defaultValues: {
      file: undefined,
      password: "",
    },
  });

  const selectedFile = watch("file");

  const onSubmit = async (data: FileSecretFormData) => {
    if (!data.file) return;

    if (data.file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(data.file.type)) {
      toast.error("Invalid file type. Only images and PDFs are allowed");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createSecretFile(data.file, data.password);
      if (response.success && response.link) {
        onSuccess(response.link);
        reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error("Error while creating link");
      }
    } catch (error) {
      const message = isRateLimitError(error)
        ? "Too many requests. Please wait a moment and try again."
        : getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2.5">
        <label htmlFor="secret-file" className="text-sm font-medium text-foreground">
          File
        </label>
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-3.5">
          <input
            id="secret-file"
            type="file"
            accept=".png, .jpg, .jpeg, .pdf"
            disabled={isLoading}
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setValue("file", e.target.files[0], { shouldValidate: true });
              }
            }}
            className="sr-only"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                <FileText aria-hidden="true" className="h-4 w-4 text-foreground" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {selectedFile ? selectedFile.name : "Choose a file to share"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : "PNG, JPG, JPEG, or PDF. Maximum size 5 MB."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:shrink-0">
              <Button
                type="button"
                variant={selectedFile ? "ghost" : "outline"}
                className="w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload aria-hidden="true" className="mr-2 h-4 w-4" />
                {selectedFile ? "Replace" : "Select"}
              </Button>
              {selectedFile && (
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  onClick={() => {
                    setValue("file", undefined as never, { shouldValidate: true });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  aria-label="Remove selected file"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

        </div>
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <label htmlFor="file-password" className="text-sm font-medium text-foreground">
          Password
          <span className="ml-2 text-muted-foreground">(optional)</span>
        </label>
        <div className="relative">
          <Input
            id="file-password"
            {...register("password")}
            type={isShowPassword ? "text" : "password"}
            placeholder="Add a password for an extra check…"
            disabled={isLoading}
            autoComplete="new-password"
            className="pr-14"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setIsShowPassword(!isShowPassword)}
            disabled={isLoading}
            aria-label={isShowPassword ? "Hide password" : "Show password"}
          >
            {isShowPassword ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <LoadingButton type="submit" isLoading={isLoading} className="w-full" size="lg">
        Create File Link
      </LoadingButton>
    </form>
  );
}
