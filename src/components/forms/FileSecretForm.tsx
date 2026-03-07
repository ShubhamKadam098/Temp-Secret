"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X } from "lucide-react";
import { createSecretFile } from "@/lib/api/secret";
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
    } catch {
      toast.error("Error while creating link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold">File</label>
        <div className="flex items-center justify-between gap-2">
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .pdf"
            disabled={isLoading}
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setValue("file", e.target.files[0]);
              }
            }}
            className="block w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-secondary hover:file:bg-secondary-hover border border-border rounded-lg file:rounded-lg file:font-semibold"
          />
          {selectedFile && (
            <X
              className="cursor-pointer rounded-full transition-all ease-in-out hover:bg-secondary-hover flex-shrink-0"
              onClick={() => {
                setValue("file", undefined as any);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            />
          )}
        </div>
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Supports: .png, .jpg, .jpeg, .pdf (Max 5MB)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password (optional)</label>
        <Input
          {...register("password")}
          type={isShowPassword ? "text" : "password"}
          placeholder="********"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showPasswordFile"
          checked={isShowPassword}
          disabled={isLoading}
          onCheckedChange={() => setIsShowPassword(!isShowPassword)}
        />
        <label htmlFor="showPasswordFile" className="text-sm font-medium">
          Show password
        </label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Create Secret"
        )}
      </Button>
    </form>
  );
}
